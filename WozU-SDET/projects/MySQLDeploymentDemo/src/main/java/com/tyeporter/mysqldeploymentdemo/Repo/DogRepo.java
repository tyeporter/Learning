package com.tyeporter.mysqldeploymentdemo.Repo;

import com.tyeporter.mysqldeploymentdemo.Model.Dog;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DogRepo extends CrudRepository<Dog, Long> {
}