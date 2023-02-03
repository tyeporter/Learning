package Section05;

import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class L10_Assertion_pt2 {

	public static void main(String[] args) throws InterruptedException {
		System.setProperty("webdriver.gecko.driver", "/Users/tyeporter/Documents/GeckoDriver/geckodriver");

        WebDriver driver = new FirefoxDriver();

        driver.manage().window().maximize();

        driver.get("https://www.automationtesting.co.uk");

        driver.findElement(By.linkText("TEST STORE")).click();
        driver.findElement(By.cssSelector("img[alt='Hummingbird printed t-shirt']")).click();
        driver.findElement(By.cssSelector(".add-to-cart.btn.btn-primary")).click();

        Thread.sleep(3000);

        String actual = driver.findElement(By.cssSelector(".product-total > .value")).getText();
        Assert.assertEquals("$26.12", actual);
    }
}
