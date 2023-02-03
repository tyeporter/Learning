package com.tyeporter.todoapp.Controller;

import java.util.Optional;

import com.tyeporter.todoapp.Model.TodoList;
import com.tyeporter.todoapp.Service.TodoListService;

import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/todolist")
public class TodoListController {

	private final TodoListService service;

	public TodoListController(TodoListService service) {
		this.service = service;
	}

	@GetMapping("/{byTitle}")
	public Optional<TodoList> get(@PathVariable String byTitle) {
		return service.getTodoListByTitle(byTitle);
	}

	@GetMapping("/all")
	public Iterable<TodoList> getAll() {
		return service.getAllTodoList();
	}

	@PostMapping("/create")
	public JSONObject create(@RequestBody TodoList todoList) {
		return service.createTodoList(todoList);
	}

	@PutMapping("/{byTitle}/updated")
	public JSONObject update(@PathVariable String byTitle, @RequestBody TodoList todoList) {
		return service.updateTodoListByTitle(byTitle, todoList);
	}

	@DeleteMapping("/{byTitle}/delete")
	public JSONObject delete(@PathVariable String byTitle) {
		return service.deleteTodoListByTitle(byTitle);
	}

	@DeleteMapping("/purge")
	public JSONObject deleteAll() {
		return service.deleteAllTodoLists();
	}

}

