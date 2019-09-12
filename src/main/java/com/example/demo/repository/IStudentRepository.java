package com.example.demo.repository;

import com.example.demo.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.persistence.Entity;
import java.util.List;

@Repository
public interface IStudentRepository extends JpaRepository<Student, String> {
    Student findByEmail(String email);

    List<Student> findStudentByOption1OrOption2(String option1, String option2);


    List<Student> findStudentsByAcceptedOption1TrueAndAcceptedOption2False();

    List<Student> findStudentsByAcceptedOption2TrueAndAcceptedOption1False();

    List<Student> findStudentsByAcceptedOption1TrueAndAcceptedOption2True();

    List<Student> findStudentsByAcceptedOption1FalseAndAcceptedOption2False();

    List<Student> findStudentsBySupervisorEmail(String email);
}
