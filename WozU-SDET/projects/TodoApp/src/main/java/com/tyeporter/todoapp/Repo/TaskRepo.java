package com.tyeporter.todoapp.Repo;

import java.util.UUID;

import com.tyeporter.todoapp.Model.Task;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepo extends CrudRepository<Task, UUID> {}