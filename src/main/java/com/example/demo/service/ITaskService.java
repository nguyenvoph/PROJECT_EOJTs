package com.example.demo.service;

import com.example.demo.config.Status;
import com.example.demo.entity.Business;
import com.example.demo.entity.Supervisor;
import com.example.demo.entity.Task;

import java.util.List;

public interface ITaskService {

    void createTaskForStudent(Task task);

    List<Task> findTaskBySupervisorEmail(String email);

    List<Task> findTaskByStudentEmail(String email);

    Task findTaskById(int id);

    boolean updateTask(Task task);

    boolean deleteTask(int id);

    boolean updateStatusTask(int id, int typeStatusTask,String comment);

    List<Task> findTaskDoneByStudentEmail(String email);

    float getPercentTaskDoneOfStudent(String email);

    List<Task> findTasksOfStudentByStatus(String email, Status status);

    List<Task> findTasksOfBusinessAndSemester(Business business);
}
