package com.tyeporter.mysqldeploymentdemo.Controller;

import com.tyeporter.mysqldeploymentdemo.Model.Dog;
import com.tyeporter.mysqldeploymentdemo.Service.DogServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DogController {

	@Autowired
	DogServiceImpl service;

	@GetMapping("/dogs")
	public Iterable<Dog> getDogs() {
		return service.getAllDogs();
	} 

	@PostMapping("/create")
	public String createDog() {
		Dog dog = service.getDogFromAPI();
		service.postDogFromAPI(dog);
		return "Dog fetched and created!";
	}

}