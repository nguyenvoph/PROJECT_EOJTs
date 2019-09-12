package com.example.demo.repository;

import com.example.demo.entity.Invitation;
import com.example.demo.entity.Semester;
import com.example.demo.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IInvitationRepository extends JpaRepository<Invitation, Integer> {
   List<Invitation> findInvitationByStudentEmailOrderByTimeCreatedDesc(String email);

    List<Invitation> findInvitationByBusinessEmailOrderByTimeCreatedDesc(String email);

    Invitation findInvitationById(int id);

    Invitation findInvitationByBusinessEmailAndStudentEmailAndSemester(String businessEmail, String studentEmail, Semester semester);
}
