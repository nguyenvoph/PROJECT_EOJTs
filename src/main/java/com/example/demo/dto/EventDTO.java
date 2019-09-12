package com.example.demo.dto;

import com.example.demo.entity.Event;
import com.example.demo.entity.Student;

import java.io.Serializable;
import java.util.List;

public class EventDTO implements Serializable {
    private Event event;
    private List<Student> studentList;
    private boolean isStudentSent;

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public List<Student> getStudentList() {
        return studentList;
    }

    public void setStudentList(List<Student> studentList) {
        this.studentList = studentList;
    }

    public boolean isStudentSent() {
        return isStudentSent;
    }

    public void setStudentSent(boolean studentSent) {
        isStudentSent = studentSent;
    }

    public EventDTO() {
    }
}
