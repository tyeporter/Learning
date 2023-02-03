package com.tyeporter.weatherapiexample.Service;

import com.tyeporter.weatherapiexample.Model.WeatherResults;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherServiceImpl implements WeatherService {

	@Value("${api_key}")
    private String api_key;

    @Override
    public WeatherResults getWeather(String forCity) {
    	String url = "https://api.openweathermap.org/data/2.5/weather?q=" + forCity + "&appid=" + api_key;
    	RestTemplate template = new RestTemplate();
    	return template.getForObject(url, WeatherResults.class);
    }

}