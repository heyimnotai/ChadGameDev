const puppeteer = require('puppeteer-core');
const { execSync } = require('child_process');

async function captureScreenshot() {
    console.log('Launching Windows Chrome from WSL...');

    const winTempPath = execSync('wslpath -w /tmp').toString().trim();

    const browser = await puppeteer.launch({
        executablePath: '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            `--user-data-dir=${winTempPath}\\puppeteer_profile_${Date.now()}`
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 920 });

    const wslPath = process.cwd();
    const winPath = execSync(`wslpath -w "${wslPath}/preview/index.html"`).toString().trim();
    const previewPath = `file:///${winPath.replace(/\\/g, '/')}`;

    console.log(`Navigating to: ${previewPath}`);
    await page.goto(previewPath, { waitUntil: 'networkidle0' });

    console.log('Waiting for game to initialize...');
    await new Promise(r => setTimeout(r, 2000));

    const timestamp = Date.now();

    const canvasBox = await page.$eval('#gameCanvas', el => {
        const rect = el.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });

    const scaleX = canvasBox.width / 1179;
    const scaleY = canvasBox.height / 2556;

    // Helper function to drag block
    async function dragBlock(slotIndex, targetGridX, targetGridY) {
        // Block slot positions (in canvas coords)
        const slotX = 294.75 * (slotIndex + 1);  // slots at 294.75, 589.5, 884.25
        const slotY = 1582;

        // Grid cell position
        const gridX = 109.5;  // Grid starts here
        const gridY = 442;
        const cellSize = 120;

        const startX = canvasBox.x + slotX * scaleX;
        const startY = canvasBox.y + slotY * scaleY;
        const endX = canvasBox.x + (gridX + targetGridX * cellSize + cellSize/2) * scaleX;
        const endY = canvasBox.y + (gridY + targetGridY * cellSize + cellSize/2) * scaleY;

        console.log(`  Dragging block ${slotIndex + 1} to grid (${targetGridX}, ${targetGridY})`);

        await page.mouse.move(startX, startY);
        await new Promise(r => setTimeout(r, 50));
        await page.mouse.down();
        await new Promise(r => setTimeout(r, 100));

        // Smooth drag
        for (let i = 1; i <= 15; i++) {
            const x = startX + (endX - startX) * (i / 15);
            const y = startY + (endY - startY) * (i / 15);
            await page.mouse.move(x, y);
            await new Promise(r => setTimeout(r, 20));
        }

        await new Promise(r => setTimeout(r, 50));
        await page.mouse.up();
        await new Promise(r => setTimeout(r, 500));
    }

    // Initial screenshot
    await page.screenshot({
        path: `screenshots/session-1767841365/final-initial-${timestamp}.png`,
        fullPage: true
    });
    console.log('Initial state captured');

    // Place first block
    console.log('Placing block 1...');
    await dragBlock(0, 0, 0);

    await page.screenshot({
        path: `screenshots/session-1767841365/final-block1-${timestamp}.png`,
        fullPage: true
    });

    // Place second block
    console.log('Placing block 2...');
    await dragBlock(1, 3, 0);

    await page.screenshot({
        path: `screenshots/session-1767841365/final-block2-${timestamp}.png`,
        fullPage: true
    });

    // Place third block
    console.log('Placing block 3...');
    await dragBlock(2, 5, 0);

    await page.screenshot({
        path: `screenshots/session-1767841365/final-block3-${timestamp}.png`,
        fullPage: true
    });

    // Final screenshot after all placements
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({
        path: `screenshots/session-1767841365/final-complete-${timestamp}.png`,
        fullPage: true
    });
    console.log('Final state captured');

    await browser.close();
    console.log('Done!');
}

captureScreenshot().catch(err => {
    console.error('Error:', err.message);
    console.error(err.stack);
    process.exit(1);
});
