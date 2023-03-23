import { Builder, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

jest.setTimeout(20000);

describe('Advanced Subjects', (): void => {
    let driver: WebDriver;

    beforeAll(async (): Promise<void> => {
        const options = new chrome.Options();
        options.addArguments('incognito', 'start-maximized');

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    afterAll(async (): Promise<void> => {
        // await driver.quit();
    });

    it('Lesson 1 - Chrome Options', async (): Promise<void> => {
        // ^ Example in beforeAll function
        await driver.get('https://www.automationtesting.co.uk');
    });
});
