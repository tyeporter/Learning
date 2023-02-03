package com.tyeporter.todoapp.Service;

import java.util.Optional;
import java.util.UUID;

import com.tyeporter.todoapp.Model.Task;

import org.json.simple.JSONObject;

public interface TaskService {

	public Optional<Task> getTaskById(UUID id);
	public Iterable<Task> getAllTask();
	public JSONObject deleteAllTasks();
	public JSONObject deleteTaskById(UUID id);
	public JSONObject updateTaskById(UUID id, Task task);
	public JSONObject createTask(Task task);

}