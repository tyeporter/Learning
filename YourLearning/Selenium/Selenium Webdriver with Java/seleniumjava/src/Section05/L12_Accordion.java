package Section05;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;;

public class L12_Accordion {

    public static void main(String[] args) throws InterruptedException {
		System.setProperty("webdriver.chrome.driver", "/Users/tyeporter/Documents/ChromeDriver/chromedriver");

        WebDriver driver = new ChromeDriver();

        driver.manage().window().maximize();

        driver.get("https://www.automationtesting.co.uk/accordion.html");

        for (int i = 0; i < 5; i++) {
            driver.findElement(By.cssSelector(".accordion > div:nth-of-type(1)")).click();
            driver.findElement(By.cssSelector(".accordion > div:nth-of-type(1)")).click();
            Thread.sleep(1000);
            driver.findElement(By.cssSelector(".accordion > div:nth-of-type(3)")).click();
            driver.findElement(By.cssSelector(".accordion > div:nth-of-type(3)")).click();
            Thread.sleep(1000);
            driver.findElement(By.cssSelector(".accordion > div:nth-of-type(5)")).click();
            driver.findElement(By.cssSelector(".accordion > div:nth-of-type(5)")).click();
            Thread.sleep(1000);
        }
    }
}
