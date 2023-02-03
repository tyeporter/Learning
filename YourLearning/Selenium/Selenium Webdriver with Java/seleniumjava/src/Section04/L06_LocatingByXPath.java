package Section04;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class L06_LocatingByXPath {

	public static void main(String[] args) {
		System.setProperty("webdriver.gecko.driver", "/Users/tyeporter/Documents/GeckoDriver/geckodriver");

        WebDriver driver = new FirefoxDriver();

        driver.manage().window().maximize();

        driver.get("https://www.automationtesting.co.uk/buttons.html");

        /* Locating by XPath */

        // driver.findElement(By.xpath("/html/body/div/div[1]/div/div[1]/div[1]/button")).click();
        driver.findElement(By.xpath("//button[@id=\"btn_one\"]")).click();
	}

}
