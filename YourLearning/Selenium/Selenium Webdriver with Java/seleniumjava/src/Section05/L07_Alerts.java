package Section05;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class L07_Alerts {

	public static void main(String[] args) throws InterruptedException {
		System.setProperty("webdriver.gecko.driver", "/Users/tyeporter/Documents/GeckoDriver/geckodriver");

        WebDriver driver = new FirefoxDriver();

        driver.manage().window().maximize();

        driver.get("https://www.automationtesting.co.uk/popups.html");

        driver.findElement(By.cssSelector("[onclick='alertTrigger\\(\\)']")).click();

        Thread.sleep(3000);

        driver.switchTo().alert().accept();
    }
}
