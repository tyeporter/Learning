package Section05;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class L08_RadioButtons {

	public static void main(String[] args) throws InterruptedException {
		System.setProperty("webdriver.gecko.driver", "/Users/tyeporter/Documents/GeckoDriver/geckodriver");

        WebDriver driver = new FirefoxDriver();

        driver.manage().window().maximize();

        driver.get("https://www.automationtesting.co.uk/dropdown.html");

        driver.findElement(By.cssSelector("[for='demo-priority-low']")).click();

        Thread.sleep(3000);

        driver.findElement(By.cssSelector("[for='demo-priority-normal']")).click();

        Thread.sleep(3000);

        driver.findElement(By.cssSelector("[for='demo-priority-high']")).click();
    }
}
