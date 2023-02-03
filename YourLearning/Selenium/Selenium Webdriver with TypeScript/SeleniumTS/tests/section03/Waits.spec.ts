import { Builder, By, until, WebDriver } from 'selenium-webdriver';

jest.setTimeout(15000);

describe('Tests for Section 05', (): void => {
    let driver: WebDriver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        // await driver.quit();
    });

    it('Lesson 1 - Implicit Waits', async () => {
        // Element is not interact-able initially
        // Set a 10 second implicit wait
        await driver.manage().setTimeouts({implicit: 10000});

        await driver.get('https://www.automationtesting.co.uk/loader.html');

        const element = await driver.findElement(
            By.id('loaderBtn')
        );

        await element.click();
    });

    it('Lesson 2 - Explicit Waits', async () => {
        await driver.get('https://www.automationtesting.co.uk/loader.html');

        const element = await driver.findElement(By.id('loaderBtn'));
        await driver.wait(until.elementIsVisible(element), 10000);

        await element.click();
    });

    it('Lesson 3 - Fluent Waits', async () => {
        await driver.get('https://www.automationtesting.co.uk/loadertwo.html');

        const element = await driver.wait(
            until.elementLocated(By.id('appears')),
            10000,
            'Timeout after 10 seconds',
            5000
        );

        console.log(await element.getText());
    });
});
