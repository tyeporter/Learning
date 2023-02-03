package com.tyeporter.mysqldeploymentdemo.Service;

import com.tyeporter.mysqldeploymentdemo.Model.Dog;

public interface DogService {

	public Dog getDogFromAPI();
	public void postDogFromAPI(Dog dog);
	public Iterable<Dog> getAllDogs();

}