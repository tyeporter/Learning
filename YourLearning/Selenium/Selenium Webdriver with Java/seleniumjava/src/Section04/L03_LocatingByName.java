package Section04;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class L03_LocatingByName {

	public static void main(String[] args) {
		System.setProperty("webdriver.gecko.driver", "/Users/tyeporter/Documents/GeckoDriver/geckodriver");

        WebDriver driver = new FirefoxDriver();

        driver.manage().window().maximize();

        driver.get("https://www.automationtesting.co.uk/contactForm.html");

        /* Locating by ID */

        driver.findElement(By.name("first_name")).sendKeys("abcd");
	}

}
