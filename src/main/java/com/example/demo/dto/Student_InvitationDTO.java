package com.example.demo.dto;

import com.example.demo.entity.Invitation;
import com.example.demo.entity.Student;

import java.io.Serializable;
import java.util.List;

public class Student_InvitationDTO implements Serializable {
    private Student student;
    private List<Invitation> invitations;

    public Student_InvitationDTO() {
    }

    public Student_InvitationDTO(Student student, List<Invitation> invitations) {
        this.student = student;
        this.invitations = invitations;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public List<Invitation> getInvitations() {
        return invitations;
    }

    public void setInvitations(List<Invitation> invitations) {
        this.invitations = invitations;
    }
}
