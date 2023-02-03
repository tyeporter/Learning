package Section05;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class L05_IsEnabled {

	public static void main(String[] args) {
		System.setProperty("webdriver.gecko.driver", "/Users/tyeporter/Documents/GeckoDriver/geckodriver");

        WebDriver driver = new FirefoxDriver();

        driver.manage().window().maximize();

        driver.get("https://www.automationtesting.co.uk/buttons.html");

        System.out.println(
            driver.findElement(By.cssSelector("button#btn_four")).isEnabled()
        );

        System.out.println(
            driver.findElement(By.cssSelector("button#btn_three")).isEnabled()
        );
    }
}
