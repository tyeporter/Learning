package com.tyeporter.mysqldeploymentdemo.Service;

import com.tyeporter.mysqldeploymentdemo.Model.Dog;
import com.tyeporter.mysqldeploymentdemo.Repo.DogRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DogServiceImpl implements DogService {

	@Autowired
	DogRepo repository;

	@Override
	public Dog getDogFromAPI() {
		RestTemplate template = new RestTemplate();
		return template.getForObject("https://dog.ceo/api/breeds/image/random", Dog.class);
	}

	@Override
	public void postDogFromAPI(Dog dog) {
		repository.save(dog);
	}

	@Override
	public Iterable<Dog> getAllDogs() {
		return repository.findAll();
	}

}