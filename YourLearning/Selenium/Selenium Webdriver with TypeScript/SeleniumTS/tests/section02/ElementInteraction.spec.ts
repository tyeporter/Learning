import { Builder, By, WebDriver } from 'selenium-webdriver';

describe('Tests for Section 05', (): void => {
    let driver: WebDriver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('firefox').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('Lesson 13 - Hidden Files', async () => {
        await driver.get('https://www.automationtesting.co.uk/hiddenElements.html');

        const element1 = await driver.findElement(
            By.css('.col-12.col-12-small > p:nth-of-type(2)')
        );

        const element2 = await driver.findElement(
            By.css('.col-12.col-12-small > p:nth-of-type(3)')
        );

        let expected = false;
        let actual = await element1.isDisplayed();

        expect(actual).toBe(expected);

        expected = true;
        actual = await element2.isDisplayed();

        expect(actual).toBe(expected);
    });
});
