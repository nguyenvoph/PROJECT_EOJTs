package com.example.demo.dto;

import com.example.demo.entity.Student;
import com.example.demo.entity.Task;

import java.io.Serializable;

public class TaskDTO implements Serializable {
    private Task task;
    private String emailStudent;
    private String nameStudent;

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public String getEmailStudent() {
        return emailStudent;
    }

    public void setEmailStudent(String emailStudent) {
        this.emailStudent = emailStudent;
    }

    public String getNameStudent() {
        return nameStudent;
    }

    public TaskDTO(Task task, String emailStudent, String nameStudent) {
        this.task = task;
        this.emailStudent = emailStudent;
        this.nameStudent = nameStudent;
    }

    public TaskDTO() {
    }

    public void setNameStudent(String nameStudent) {
        this.nameStudent = nameStudent;
    }
}
