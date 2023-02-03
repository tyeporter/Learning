package com.tyeporter.todoapp.Service;

import java.util.UUID;

import java.util.Optional;

import com.tyeporter.todoapp.Model.Task;
import com.tyeporter.todoapp.Repo.TaskRepo;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceImpl implements TaskService {

	final TaskRepo repo;

	public TaskServiceImpl(TaskRepo repo) {
		this.repo = repo;
	}

	@Override
	public Optional<Task> getTaskById(UUID id) {
		return repo.findById(id);
	}

	@Override
	public Iterable<Task> getAllTask() {
		return repo.findAll();
	}

	@Override
	public JSONObject deleteAllTasks() {
		repo.deleteAll();

		JSONObject response = new JSONObject();
		response.put("message", "Deleted all tasks");
		return response;
	}

	@Override
	public JSONObject deleteTaskById(UUID id) {
		repo.deleteById(id);

		JSONObject response = new JSONObject();
		response.put("message", "Deleted task");
		return response;
	}

	@Override
	public JSONObject updateTaskById(UUID id, Task newTask) {
		Optional<Task> task = repo.findById(id);
		task.map(updatedTask -> {
			updatedTask.setDescription(newTask.getDescription());
			updatedTask.setIsComplete(newTask.getIsComplete());
			updatedTask.setTodoList(newTask.getTodoList());
			return updatedTask;
		});

		JSONObject response = new JSONObject();
		response.put("message", "Updated task");
		return response;
	}

	@Override
	public JSONObject createTask(Task task){
		repo.save(task);

		JSONObject response = new JSONObject();
		response.put("message", "Created task");
		return response;
	}
	
}