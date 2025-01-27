const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Load test data from a JSON file
const testDataPath = path.join(__dirname, '../testdata.json');
const data = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

data.forEach(({ tab, column, task, tags }) => {
    test(`${task} should appear in the correct tab and column`, async ({ page }) => {
        // Set the timeout for this test (optional)
        test.setTimeout(60000); // Set timeout to 60 seconds 
        // Navigate to the page you are testing
        await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/');

        // enter login credentials
        await page.fill('#username', 'admin');
        await page.fill('#password', 'password123');
        console.log('Filled in login credentials.');

        // Click the login button
        await page.click('//button[@type="submit"]');
        console.log('Clicked the login button.');

        // Verify that the user is logged in
        await page.waitForSelector('text=Projects', { timeout: 5000 });

        // Find and click the tab
        await page.click(`text=${tab}`);

        // Verify task are in correct columns
        const tagName = page.locator(`//h3[text()='${task}']//..//..//..//h2[text()="${column}"]`);
        expect(tagName).toBeVisible();
        
        // Verify tags are correct
        for (let i = 0; i < tags.length; i++) {
            const tagName = page.locator(`//h3[text()='${task}']//..//span[text()="${tags[i]}"]`);
            console.log('Element: ', tagName);
            expect(tagName).toBeVisible();
        }
    });
});