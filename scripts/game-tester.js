#!/usr/bin/env node
/**
 * Comprehensive game testing script using Puppeteer
 * Can simulate gameplay, clicks, and capture screenshots during specific actions
 *
 * Usage:
 *   node scripts/game-tester.js <mode> <output-dir> [duration-seconds]
 *
 * Modes:
 *   quick    - 10 second playtest with 3 screenshots
 *   standard - 30 second playtest with 10 screenshots
 *   deep     - 60 second playtest with 20+ screenshots, tests edge cases
 *
 * Examples:
 *   node scripts/game-tester.js quick screenshots/
 *   node scripts/game-tester.js deep screenshots/ 60
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const PREVIEW_URL = 'file:///app/preview/index.html';

// Find Playwright's Chromium
function findChromium() {
    const npxPlaywrightPath = process.env.HOME + '/.cache/ms-playwright';
    if (fs.existsSync(npxPlaywrightPath)) {
        const chromiumDirs = fs.readdirSync(npxPlaywrightPath)
            .filter(d => d.startsWith('chromium-') && !d.includes('headless'))
            .sort()
            .reverse();
        for (const dir of chromiumDirs) {
            for (const subdir of ['chrome-linux64', 'chrome-linux']) {
                const chromePath = path.join(npxPlaywrightPath, dir, subdir, 'chrome');
                if (fs.existsSync(chromePath)) {
                    return chromePath;
                }
            }
        }
    }
    return null;
}

async function runGameTest(mode, outputDir, durationSeconds) {
    const executablePath = findChromium();
    if (!executablePath) {
        console.error('ERROR: Chrome not found. Run: npx playwright install chromium');
        process.exit(1);
    }

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const config = {
        quick: { duration: 10000, screenshots: 3, clicks: 5 },
        standard: { duration: 30000, screenshots: 10, clicks: 15 },
        deep: { duration: 60000, screenshots: 20, clicks: 30 }
    };

    const settings = config[mode] || config.standard;
    if (durationSeconds) {
        settings.duration = durationSeconds * 1000;
    }

    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║  GAME TESTER - ${mode.toUpperCase()} MODE`);
    console.log(`╠════════════════════════════════════════════════════════════╣`);
    console.log(`║  Duration: ${settings.duration / 1000}s`);
    console.log(`║  Screenshots: ${settings.screenshots}`);
    console.log(`║  Interactions: ${settings.clicks}`);
    console.log(`╚════════════════════════════════════════════════════════════╝\n`);

    let browser;
    const results = {
        mode,
        startTime: new Date().toISOString(),
        screenshots: [],
        interactions: [],
        consoleErrors: [],
        issues: []
    };

    try {
        browser = await puppeteer.launch({
            executablePath,
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();

        // Capture console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                results.consoleErrors.push(msg.text());
            }
        });

        page.on('pageerror', err => {
            results.consoleErrors.push(err.message);
            results.issues.push({
                type: 'crash',
                description: err.message,
                severity: 'critical'
            });
        });

        // Set viewport to match iPhone frame
        await page.setViewport({ width: 800, height: 900, deviceScaleFactor: 2 });

        console.log('Loading game...');
        await page.goto(PREVIEW_URL, { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 1000)); // Let game initialize

        // Get iPhone frame element
        const iphoneFrame = await page.$('.iphone-frame');
        if (!iphoneFrame) {
            throw new Error('.iphone-frame not found');
        }

        // Get frame bounds for click calculations
        const frameBox = await iphoneFrame.boundingBox();

        // Calculate screen area within frame (accounting for padding/bezels)
        const screenArea = {
            x: frameBox.x + 12,  // Left padding
            y: frameBox.y + 12,  // Top padding
            width: frameBox.width - 24,
            height: frameBox.height - 24
        };

        // Take initial screenshot
        console.log('Taking initial screenshot...');
        const initialPath = path.join(outputDir, 'test-00-initial.png');
        await iphoneFrame.screenshot({ path: initialPath });
        results.screenshots.push({ time: 0, path: initialPath, label: 'initial' });

        const startTime = Date.now();
        const screenshotInterval = settings.duration / settings.screenshots;
        const clickInterval = settings.duration / settings.clicks;

        let screenshotCount = 1;
        let lastScreenshotTime = 0;
        let lastClickTime = 0;

        console.log(`Playing game for ${settings.duration / 1000} seconds...`);

        while (Date.now() - startTime < settings.duration) {
            const elapsed = Date.now() - startTime;

            // Simulate random tap/click
            if (elapsed - lastClickTime >= clickInterval) {
                // Random position within game screen (avoiding edges)
                const x = screenArea.x + 50 + Math.random() * (screenArea.width - 100);
                const y = screenArea.y + 100 + Math.random() * (screenArea.height - 200);

                await page.mouse.click(x, y);
                results.interactions.push({
                    time: elapsed,
                    type: 'click',
                    x: Math.round(x - screenArea.x),
                    y: Math.round(y - screenArea.y)
                });
                lastClickTime = elapsed;
            }

            // Take periodic screenshots
            if (elapsed - lastScreenshotTime >= screenshotInterval) {
                const ssPath = path.join(outputDir, `test-${String(screenshotCount).padStart(2, '0')}-${Math.round(elapsed/1000)}s.png`);
                await iphoneFrame.screenshot({ path: ssPath });
                results.screenshots.push({
                    time: elapsed,
                    path: ssPath,
                    label: `${Math.round(elapsed/1000)}s gameplay`
                });
                console.log(`  Screenshot ${screenshotCount}/${settings.screenshots} at ${Math.round(elapsed/1000)}s`);
                screenshotCount++;
                lastScreenshotTime = elapsed;
            }

            await new Promise(r => setTimeout(r, 100));
        }

        // Take final screenshot
        const finalPath = path.join(outputDir, `test-${String(screenshotCount).padStart(2, '0')}-final.png`);
        await iphoneFrame.screenshot({ path: finalPath });
        results.screenshots.push({ time: settings.duration, path: finalPath, label: 'final' });

        // Deep mode: test specific scenarios
        if (mode === 'deep') {
            console.log('\nRunning edge case tests...');

            // Test rapid tapping
            console.log('  Testing rapid taps...');
            for (let i = 0; i < 10; i++) {
                const x = screenArea.x + 100 + Math.random() * 200;
                const y = screenArea.y + 300 + Math.random() * 200;
                await page.mouse.click(x, y);
                await new Promise(r => setTimeout(r, 50));
            }
            const rapidPath = path.join(outputDir, 'test-edge-rapid-taps.png');
            await iphoneFrame.screenshot({ path: rapidPath });
            results.screenshots.push({ time: 'edge', path: rapidPath, label: 'rapid taps' });

            // Test corners
            console.log('  Testing corner taps...');
            const corners = [
                { x: screenArea.x + 20, y: screenArea.y + 60 },  // Top-left
                { x: screenArea.x + screenArea.width - 20, y: screenArea.y + 60 },  // Top-right
                { x: screenArea.x + 20, y: screenArea.y + screenArea.height - 40 },  // Bottom-left
                { x: screenArea.x + screenArea.width - 20, y: screenArea.y + screenArea.height - 40 }  // Bottom-right
            ];
            for (const corner of corners) {
                await page.mouse.click(corner.x, corner.y);
                await new Promise(r => setTimeout(r, 200));
            }
            const cornerPath = path.join(outputDir, 'test-edge-corners.png');
            await iphoneFrame.screenshot({ path: cornerPath });
            results.screenshots.push({ time: 'edge', path: cornerPath, label: 'corner taps' });

            // Let game run for a few more seconds to check stability
            console.log('  Stability check...');
            await new Promise(r => setTimeout(r, 5000));
            const stabilityPath = path.join(outputDir, 'test-edge-stability.png');
            await iphoneFrame.screenshot({ path: stabilityPath });
            results.screenshots.push({ time: 'edge', path: stabilityPath, label: 'stability' });
        }

        results.endTime = new Date().toISOString();
        results.success = true;

    } catch (error) {
        console.error(`ERROR: ${error.message}`);
        results.success = false;
        results.error = error.message;
        results.issues.push({
            type: 'error',
            description: error.message,
            severity: 'critical'
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    // Save results
    const resultsPath = path.join(outputDir, 'test-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

    // Print summary
    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║  TEST COMPLETE`);
    console.log(`╠════════════════════════════════════════════════════════════╣`);
    console.log(`║  Screenshots: ${results.screenshots.length}`);
    console.log(`║  Interactions: ${results.interactions.length}`);
    console.log(`║  Console Errors: ${results.consoleErrors.length}`);
    console.log(`║  Issues Found: ${results.issues.length}`);
    console.log(`║  Results: ${resultsPath}`);
    console.log(`╚════════════════════════════════════════════════════════════╝\n`);

    if (results.consoleErrors.length > 0) {
        console.log('Console Errors:');
        results.consoleErrors.forEach(e => console.log(`  - ${e}`));
    }

    if (results.issues.length > 0) {
        console.log('\nIssues Found:');
        results.issues.forEach(i => console.log(`  - [${i.severity}] ${i.description}`));
    }

    return results;
}

// Parse arguments
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node scripts/game-tester.js <mode> <output-dir> [duration-seconds]');
    console.log('');
    console.log('Modes:');
    console.log('  quick    - 10 second playtest');
    console.log('  standard - 30 second playtest');
    console.log('  deep     - 60 second comprehensive test');
    process.exit(1);
}

const mode = args[0];
const outputDir = args[1];
const duration = args[2] ? parseInt(args[2]) : null;

runGameTest(mode, outputDir, duration);
