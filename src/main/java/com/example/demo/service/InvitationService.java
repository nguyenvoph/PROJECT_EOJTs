package com.example.demo.service;

import com.example.demo.entity.Invitation;
import com.example.demo.entity.Semester;
import com.example.demo.repository.IInvitationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class InvitationService implements IInvitationService {
    @Autowired
    IInvitationRepository IInvitationRepository;

    @Autowired
    ISemesterService semesterService;

    @Override
    public List<Invitation> getListInvitationByStudentEmail(String email) {
        Semester semester = semesterService.getSemesterCurrent();

        List<Invitation> invitationList =
                IInvitationRepository.findInvitationByStudentEmailOrderByTimeCreatedDesc(email);
        List<Invitation> invitationListCurrentSemester = new ArrayList<>();
        for (int i = 0; i < invitationList.size(); i++) {
            Invitation invitation = invitationList.get(i);
            if (invitation.getSemester().getId() == semester.getId()) {
                invitationListCurrentSemester.add(invitation);
            }
        }
        return invitationListCurrentSemester;
    }

    @Override
    public List<Invitation> getListInvitationByBusinessEmail(String email) {
        return IInvitationRepository.findInvitationByBusinessEmailOrderByTimeCreatedDesc(email);
    }

    @Override
    public Invitation getInvitationById(int id) {
        Invitation invitation = IInvitationRepository.findInvitationById(id);
        invitation.setRead(true);

        IInvitationRepository.save(invitation);
        return invitation;
    }

    @Override
    public void createInvitation(Invitation invitation) {
        Semester semester = semesterService.getSemesterCurrent();

        Date date = new Date(Calendar.getInstance().getTime().getTime());
        invitation.setSemester(semester);
        invitation.setTimeCreated(date);
        IInvitationRepository.save(invitation);
    }

    //check semester //ok
    @Override
    public Invitation getInvitationByBusinessEmailAndStudentEmail(String businessEmail, String studentEmail) {
        Semester semester = semesterService.getSemesterCurrent();

        Invitation invitation = IInvitationRepository.findInvitationByBusinessEmailAndStudentEmailAndSemester(businessEmail, studentEmail, semester);
        if (invitation != null) {
            return invitation;
        }
        return null;
    }

    @Override
    public boolean updateStateOfInvitation(int id) {
        Invitation invitation = IInvitationRepository.findInvitationById(id);
        if (invitation != null) {
            invitation.setState(true);
            IInvitationRepository.save(invitation);
            return true;
        }
        return false;
    }
}
