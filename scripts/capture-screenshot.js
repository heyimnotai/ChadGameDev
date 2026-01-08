#!/usr/bin/env node
/**
 * Screenshot capture script using Puppeteer
 * Bypasses MCP Playwright which has persistent lock issues
 *
 * Usage: node scripts/capture-screenshot.js <url> <output-path> [wait-ms]
 *
 * Examples:
 *   node scripts/capture-screenshot.js file:///path/to/preview/index.html screenshots/test.png
 *   node scripts/capture-screenshot.js file:///path/to/preview/index.html screenshots/test.png 2000
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function captureScreenshot(url, outputPath, waitMs = 1000) {
    let executablePath = null;

    // PRIORITY 1: Check Playwright-installed Chromium (works with WSL file:// paths)
    const npxPlaywrightPath = process.env.HOME + '/.cache/ms-playwright';
    if (fs.existsSync(npxPlaywrightPath)) {
        const chromiumDirs = fs.readdirSync(npxPlaywrightPath)
            .filter(d => d.startsWith('chromium-') && !d.includes('headless'))
            .sort()
            .reverse(); // Get newest version
        for (const dir of chromiumDirs) {
            // Check both chrome-linux64 and chrome-linux
            for (const subdir of ['chrome-linux64', 'chrome-linux']) {
                const chromePath = path.join(npxPlaywrightPath, dir, subdir, 'chrome');
                if (fs.existsSync(chromePath)) {
                    executablePath = chromePath;
                    break;
                }
            }
            if (executablePath) break;
        }
    }

    // PRIORITY 2: Linux native browsers
    if (!executablePath) {
        const linuxPaths = [
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable',
            '/snap/bin/chromium',
        ];
        for (const p of linuxPaths) {
            if (fs.existsSync(p)) {
                executablePath = p;
                break;
            }
        }
    }

    // NOTE: We intentionally DON'T use Windows Chrome from WSL
    // because it can't access file:// URLs with Linux paths

    if (!executablePath) {
        console.error('ERROR: Could not find Chrome/Chromium. Run: npx playwright install chromium');
        process.exit(1);
    }

    console.log(`Using browser: ${executablePath}`);

    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath,
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ]
        });

        const page = await browser.newPage();

        // Set viewport large enough to fit the iPhone frame
        await page.setViewport({
            width: 800,
            height: 900,
            deviceScaleFactor: 2
        });

        console.log(`Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Wait for game to initialize
        await new Promise(resolve => setTimeout(resolve, waitMs));

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Capture screenshot of ONLY the iPhone frame (not the dev controls panel)
        const iphoneFrame = await page.$('.iphone-frame');
        if (iphoneFrame) {
            await iphoneFrame.screenshot({ path: outputPath });
        } else {
            // Fallback to viewport screenshot if frame not found
            console.log('Warning: .iphone-frame not found, capturing viewport');
            await page.screenshot({ path: outputPath, fullPage: false });
        }
        console.log(`Screenshot saved: ${outputPath}`);

        // Also capture console messages
        const consolePath = outputPath.replace('.png', '-console.txt');
        page.on('console', msg => {
            fs.appendFileSync(consolePath, `[${msg.type()}] ${msg.text()}\n`);
        });

    } catch (error) {
        console.error(`ERROR: ${error.message}`);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Parse arguments
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node capture-screenshot.js <url> <output-path> [wait-ms]');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/capture-screenshot.js file:///home/user/project/preview/index.html screenshots/game.png');
    console.log('  node scripts/capture-screenshot.js file:///home/user/project/preview/index.html screenshots/game.png 2000');
    process.exit(1);
}

const url = args[0];
const outputPath = args[1];
const waitMs = parseInt(args[2]) || 1000;

captureScreenshot(url, outputPath, waitMs);
