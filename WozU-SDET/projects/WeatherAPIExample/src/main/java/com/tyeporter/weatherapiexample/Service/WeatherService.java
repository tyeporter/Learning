package com.tyeporter.weatherapiexample.Service;

import com.tyeporter.weatherapiexample.Model.WeatherResults;

public interface WeatherService {

	public WeatherResults getWeather(String forCity);
	
}