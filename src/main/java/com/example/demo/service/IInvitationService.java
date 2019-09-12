package com.example.demo.service;

import com.example.demo.entity.Invitation;

import java.util.List;

public interface IInvitationService {

    List<Invitation> getListInvitationByStudentEmail(String email);

    List<Invitation> getListInvitationByBusinessEmail(String email);

    Invitation getInvitationById(int id);

    void createInvitation(Invitation invitation);

    Invitation getInvitationByBusinessEmailAndStudentEmail(String businessEmail, String studentEmail);

    boolean updateStateOfInvitation(int id);
}
