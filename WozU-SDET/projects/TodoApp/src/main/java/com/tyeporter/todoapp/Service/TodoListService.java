package com.tyeporter.todoapp.Service;

import java.util.Optional;
import java.util.UUID;

import com.tyeporter.todoapp.Model.TodoList;

import org.json.simple.JSONObject;

public interface TodoListService {

	public Optional<TodoList> getTodoListById(UUID id);
	public Optional<TodoList> getTodoListByTitle(String title);
	public Iterable<TodoList> getAllTodoList();
	public JSONObject deleteAllTodoLists();
	public JSONObject deleteTodoListById(UUID id);
	public JSONObject deleteTodoListByTitle(String title);
	public JSONObject updateTodoListById(UUID id, TodoList todoList);
	public JSONObject updateTodoListByTitle(String title, TodoList todoList);
	public JSONObject createTodoList(TodoList todoList);

}