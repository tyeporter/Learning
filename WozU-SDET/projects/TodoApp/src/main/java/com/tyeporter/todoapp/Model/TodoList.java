package com.tyeporter.todoapp.Model;

import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import java.util.Set;

@Entity
@Table(name = "todo_lists")
public class TodoList {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID id;
	private String title;
	@OneToMany(mappedBy = "todoList", fetch = FetchType.LAZY)
	private Set<Task> tasks;

	public TodoList() {}

	public TodoList(String title) {
		this.title = title;
	}

	public UUID getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public Set<Task> getTasks() {
		return tasks;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setTasks(Set<Task> tasks) {
		this.tasks = tasks;
	}

	@Override
	public String toString() {
		return "TodoList { id = " + this.id + ", title = " + this.title + ", tasks = " + this.tasks + " }";  
	}

}