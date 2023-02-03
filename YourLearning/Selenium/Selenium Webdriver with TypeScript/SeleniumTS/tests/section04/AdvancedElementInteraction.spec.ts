import { Builder, By, until, WebDriver } from 'selenium-webdriver';

jest.setTimeout(20000);

const sleep = async (milliseconds: number): Promise<any> => {
    return new Promise((resolve: any) => setTimeout(resolve, milliseconds));
};

describe('Advanced Element Interaction', (): void => {
    let driver: WebDriver;

    beforeAll(async (): Promise<void> => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async (): Promise<void> => {
        // await driver.quit();
    });

    it('Lesson 1 - Travel Website Pt. 1', async (): Promise<void> => {
        await driver.get('https://easyjet.com/us');

        await driver.findElement(By.id('ensCloseBanner')).click();

        const element = await driver.findElement(By.css('[name="origin"]'));
        await element.clear();
        await element.sendKeys('London');

        const origins = await driver.wait(until.elementsLocated(By.css('#ui-id-1 li>a>span')), 20000);

        for (const origin of origins) {
            const text = await origin.getText();
            if (text.includes('Southend')) {
                await origin.click();
            }
        }
    });

    it('Lesson 2 - Travel Website Pt. 2', async (): Promise<void> => {
        await driver.get('https://easyjet.com/us');

        await driver.findElement(By.id('ensCloseBanner')).click();

        const element = await driver.findElement(By.css('[name="origin"]'));
        await element.clear();
        await element.sendKeys('London');

        const origins = await driver.wait(until.elementsLocated(By.css('#ui-id-1 li>a>span')), 20000);

        for (const origin of origins) {
            const text = await origin.getText();
            if (text.includes('Luton')) {
                await origin.click();
            }
        }

        const destinations = await driver.wait(until.elementsLocated(By.css('#ui-id-2 li>a>span')), 20000);

        for (const destination of destinations) {
            const text = await destination.getText();
            if (text.includes('Antalya')) {
                await destination.click();
            }
        }
    });

    it('Lesson 3 - IFrames Pt. 1', async (): Promise<void> => {
        await driver.get('https://www.automationtesting.co.uk/iframes.html');

        await driver.switchTo().frame(0);
        await driver.findElement(By.className('toggle')).click();
    });

    it('Lesson 4 - IFrames Pt. 2', async (): Promise<void> => {
        await driver.get('https://www.automationtesting.co.uk/iframes.html');

        await driver.switchTo().frame(0);
        await driver.findElement(By.className('toggle')).click();

        await driver.switchTo().parentFrame();

        await driver.switchTo().frame(1);
        await driver.findElement(By.css('[aria-label="Play"]')).click();
    });

    it('Lesson 5 - Browser Tabs', async (): Promise<void> => {
        await driver.get('https://www.automationtesting.co.uk/browserTabs.html');

        for (let i = 0; i < 3; i++) {
            await driver.findElement(By.xpath('//input[@value="Open Tab"]')).click();
        }

        const windowHandles = await driver.getAllWindowHandles();

        for (const handle of windowHandles) {
            await driver.switchTo().window(handle);
            await sleep(2000);
        }

        await driver.switchTo().window(windowHandles[0]);
    });

    it('Lesson 6 - JavaScript Executor Pt. 1', async (): Promise<void> => {
        await driver.get('https://www.automationtesting.co.uk');

        await sleep(2000);
        await driver.executeScript('window.scrollBy(0,200)');
    });

    it('Lesson 7 - JavaScript Executor Pt. 2', async (): Promise<void> => {
        await driver.get('https://www.automationtesting.co.uk/contactForm.html');

        await driver.findElement(By.css('input[name="first_name"]')).sendKeys('James');
        await driver.findElement(By.css('input[name="last_name"]')).sendKeys('Smith');
        await driver.findElement(By.css('input[name="email"]')).sendKeys('james@test.com');
        await driver.findElement(By.css('textarea')).sendKeys('This is a sample comment');

        await sleep(3000);

        const resetButton = await driver.findElement(By.css('[type="reset"]'));
        const submitButton = await driver.findElement(By.css('[type="submit"]'));
        await driver.executeScript('arguments[0].click(); arguments[1].click(); ', resetButton, submitButton);
    });
});
