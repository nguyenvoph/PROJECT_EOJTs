package com.example.demo.repository;

import com.example.demo.config.ReportName;
import com.example.demo.entity.Evaluation;
import com.example.demo.entity.Ojt_Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IEvaluationRepository extends JpaRepository<Evaluation, Integer> {

    List<Evaluation> findEvaluationsBySupervisorEmail(String email);

    @Query(value = "select e from Evaluation e where e.ojt_enrollment=?1")
    List<Evaluation> findEvaluationsByOjt_enrollment(Ojt_Enrollment ojt_enrollment);

    @Query(value = "select count(e.id) from Evaluation e where e.ojt_enrollment=?1")
    int countEvaluationByOjt_enrollment(Ojt_Enrollment ojt_enrollmentOfStudent);

    Evaluation findById(int id);

    @Query(value = "select e from Evaluation e where e.ojt_enrollment.semester.id=?1")
    List<Evaluation> findEvaluationsByOjt_enrollmentSemesterId(int id);


    List<Evaluation> findEvaluationsByTitle(ReportName title);

}
