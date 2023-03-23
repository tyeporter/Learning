import { Builder, By, WebDriver } from 'selenium-webdriver';
import { AfterAll, BeforeAll, Given, Then, When } from '@cucumber/cucumber';
import { assert } from 'chai';

const wait = (timeout: number): Promise<void> => {
    return new Promise((resolve: any, reject: any) => {
        setTimeout(() => resolve(), timeout);
    });
};

let driver: WebDriver;

BeforeAll(async () => {
    driver = await new Builder().forBrowser('firefox').build();
    await driver.manage().setTimeouts({
        implicit: 10000
    });
});

AfterAll(async () => {
    await driver.quit(); 
});

Given('User visits {string}', async (url: string) => {
    await wait(2000);
    await driver.get(url);
});

When('User presses the {string} button', async (action: string) => {
    await wait(2000);
    const button = await driver.findElement(
        By.xpath(`/html//form[@id='${action}-or-refresh']//button[@type='submit']`)
    );

    button.click();
});

Then('Add to cart modal should be shown', async () => {
    await wait(2000);
    const modalDialog = await driver.findElement(
        By.xpath("//div[@id='blockcart-modal']/div[@role='document']")
    );

    const expected = true;
    const actual = await modalDialog.isDisplayed();

    assert.equal(actual, expected); 
});
