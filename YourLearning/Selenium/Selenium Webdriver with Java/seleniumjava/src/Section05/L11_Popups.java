package Section05;

import java.util.Iterator;
import java.util.Set;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;;

public class L11_Popups {

    public static void main(String[] args) throws InterruptedException {
		System.setProperty("webdriver.chrome.driver", "/Users/tyeporter/Documents/ChromeDriver/chromedriver");

        WebDriver driver = new ChromeDriver();

        driver.manage().window().maximize();

        driver.get("https://www.automationtesting.co.uk/popups.html");

        driver.findElement(By.cssSelector("[onclick='popup\\(\\)']")).click();

        String MainWindow = driver.getWindowHandle();
        Set<String> handles = driver.getWindowHandles();
        Iterator<String> iterator = handles.iterator();

        while (iterator.hasNext()) {
            String child = iterator.next();

            if (!MainWindow.equalsIgnoreCase(child)) {
                driver.switchTo().window(child);
                Thread.sleep(5000);
                driver.close();
            }
        }

        driver.switchTo().window(MainWindow);
    }
}
