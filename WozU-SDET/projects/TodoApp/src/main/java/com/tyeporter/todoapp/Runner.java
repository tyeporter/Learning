package com.tyeporter.todoapp;

import java.util.Optional;

import com.tyeporter.todoapp.Model.Task;
import com.tyeporter.todoapp.Model.TodoList;
import com.tyeporter.todoapp.Repo.TaskRepo;
import com.tyeporter.todoapp.Repo.TodoListRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class Runner implements CommandLineRunner {

	@Autowired
	TaskRepo taskRepo;

	@Autowired
	TodoListRepo todoListRepo;

	@Override
	public void run(String... args) throws Exception {
		if (taskRepo.count() == 0 && todoListRepo.count() == 0) {
			TodoList todoList = new TodoList("Chores");

			todoListRepo.save(todoList);

			Optional<TodoList> fetchedList = todoListRepo.findByTitle(todoList.getTitle());

			Task task = new Task(fetchedList.get(), "Clean room");
			taskRepo.save(task);
		}
	}

}