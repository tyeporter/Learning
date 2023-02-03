package com.tyeporter.todoapp.Service;

import java.util.Optional;
import java.util.UUID;

import com.tyeporter.todoapp.Model.TodoList;
import com.tyeporter.todoapp.Repo.TodoListRepo;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class TodoListServiceImpl implements TodoListService {

	final TodoListRepo repo;

	public TodoListServiceImpl(TodoListRepo repo) {
		this.repo = repo;
	}

	@Override
	public Optional<TodoList> getTodoListById(UUID id) {
		return repo.findById(id);
	}

	@Override
	public Optional<TodoList> getTodoListByTitle(String title) {
		return repo.findByTitle(title);
	}

	@Override
	public Iterable<TodoList> getAllTodoList() {
		return repo.findAll();
	}

	@Override
	public JSONObject deleteAllTodoLists() {
		repo.deleteAll();

		JSONObject response = new JSONObject();
		response.put("message", "Deleted all todo lists");
		return response;
	}

	@Override
	public JSONObject deleteTodoListById(UUID id) {
		repo.deleteById(id);

		JSONObject response = new JSONObject();
		response.put("message", "Deleted todo list");
		return response;
	}

	@Override
	public JSONObject deleteTodoListByTitle(String title) {
		repo.deleteByTitle(title);

		JSONObject response = new JSONObject();
		response.put("message", "Deleted todo list");
		return response;
	}

	@Override
	public JSONObject updateTodoListById(UUID id, TodoList newTodoList) {
		Optional<TodoList> todoList = repo.findById(id);
		todoList.map(updatedTodoList -> {
			updatedTodoList.setTitle(newTodoList.getTitle());
			updatedTodoList.setTasks(newTodoList.getTasks());
			return updatedTodoList;
		});

		JSONObject response = new JSONObject();
		response.put("message", "Updated todo list");
		return response;
	}

	@Override
	public JSONObject updateTodoListByTitle(String title, TodoList newTodoList) {
		Optional<TodoList> todoList = repo.findByTitle(title);
		todoList.map(updatedTodoList -> {
			updatedTodoList.setTitle(newTodoList.getTitle());
			updatedTodoList.setTasks(newTodoList.getTasks());
			return updatedTodoList;
		});

		JSONObject response = new JSONObject();
		response.put("message", "Updated todo list");
		return response;
	}

	@Override
	public JSONObject createTodoList(TodoList todoList){
		repo.save(todoList);

		JSONObject response = new JSONObject();
		response.put("message", "Created todo list");
		return response;
	}

}