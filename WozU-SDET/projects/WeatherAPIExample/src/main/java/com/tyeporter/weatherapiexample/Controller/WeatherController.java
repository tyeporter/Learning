package com.tyeporter.weatherapiexample.Controller;

import com.tyeporter.weatherapiexample.Model.WeatherResults;
import com.tyeporter.weatherapiexample.Service.WeatherServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class WeatherController {

	@Autowired
	WeatherServiceImpl service;

	@GetMapping("/weather/{city}")
	public WeatherResults getWeather(@PathVariable String city) {
		return service.getWeather(city);
	}

}