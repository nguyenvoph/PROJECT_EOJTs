package com.example.demo.repository;

import com.example.demo.entity.Business;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Student;
import org.springframework.cache.annotation.CachePut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IOjt_EnrollmentRepository extends JpaRepository<Ojt_Enrollment, Integer> {

    Ojt_Enrollment getOjt_EnrollmentByBusiness_Email(String email);

    Ojt_Enrollment getOjt_EnrollmentByStudentEmail(String email);

    List<Ojt_Enrollment> getOjt_EnrollmentsByBusiness_Email(String email);

    Ojt_Enrollment getOjt_EnrollmentById(int id);

    Ojt_Enrollment getOjt_EnrollmentByBusiness_EmailAndSemesterIdAndStudentIsNull(String email,int id);

    Ojt_Enrollment getOjt_EnrollmentByStudentEmailAndSemesterId(String email,int id);

    @Query(value = "select o from Ojt_Enrollment o where  o.student is not null and o.semester.id=?1")
    List<Ojt_Enrollment> getOjt_EnrollmentsBySemesterIdAndStudentEmailNotNull(int id);

    @Query(value = "select o from Ojt_Enrollment o where  o.student is null and o.semester.id=?1 and o.business is not null")
    List<Ojt_Enrollment> getOjt_EnrollmentsBySemesterIdAndBusinessEmailIsNotNull(int id);

    @Query(value = "select o from Ojt_Enrollment o where  o.student is not null and o.semester.id=?1 and o.business.email=?2")
    List<Ojt_Enrollment> getOjt_EnrollmentsBySemesterIdAndBusinessNotNullAndStudentNotNull(int id,String email);

    @Query(value = "select count (o.student) from Ojt_Enrollment o where o.business.email=?1 and o.semester.id=?2 and o.student is not null")
    int countOjt_EnrollmentsByBusinessEmailAndSemesterIdAndStudentEmailNotNull(String email,int id);

    Ojt_Enrollment findOjt_EnrollmentByStudentEmailAndBusinessIsNull(String email);

    @Query(value = "select top 1* from Ojt_Enrollment o where o.student_email=?1 ORDER BY id DESC", nativeQuery = true)
    Ojt_Enrollment findLastEnrollmentByStudentEmail(String student_email);

//    @Query(value = "select o from Ojt_Enrollment o where  o.business is not null and o.semester.id=?1 and o.student.email=?2")
//    Ojt_Enrollment getOjt_EnrollmentBySemesterIdAndStudentEmailAndBusinessNotNull(int id, String email);
}
