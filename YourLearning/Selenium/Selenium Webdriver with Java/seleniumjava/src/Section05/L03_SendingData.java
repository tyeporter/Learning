package Section05;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class L03_SendingData {

	public static void main(String[] args) {
		System.setProperty("webdriver.gecko.driver", "/Users/tyeporter/Documents/GeckoDriver/geckodriver");

        WebDriver driver = new FirefoxDriver();

        driver.manage().window().maximize();

        driver.get("https://www.automationtesting.co.uk/contactForm.html");

        driver.findElement(By.cssSelector("input[name='first_name'")).sendKeys("John");
        driver.findElement(By.cssSelector("input[name='last_name'")).sendKeys("Curry");
        driver.findElement(By.cssSelector("input[name='email'")).sendKeys("jcurr@example.com");
        driver.findElement(By.cssSelector("textarea[name='message'")).sendKeys("This is a message!");
    }

}
