package com.example.demo.repository;

import com.example.demo.config.Status;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITaskRepository extends JpaRepository<Task, Integer> {

    List<Task> findTasksBySupervisorEmail(String email);

    @Query(value = "select t from Task t where t.ojt_enrollment=?1")
    List<Task> findTasksByOjt_enrollment(Ojt_Enrollment ojt_enrollmentOfStudent);

    Task findById(int id);

    @Modifying
    @Query("delete from Task t where t.id= ?1")
    void deleteById(int id);

//    @Query(value = "select t from Task t where t.ojt_enrollment=?1 and t.state='true'")
//    List<Task> findTasksByOjt_enrollmentAndStateIsTrue(Ojt_Enrollment ojt_enrollmentOfStudent);

    @Query(value = "select t from Task t where t.ojt_enrollment=?1 and t.status='DONE'")
    List<Task> findTasksByOjt_enrollmentAndStatusIsDone(Ojt_Enrollment ojt_enrollment);

    @Query(value = "select t from Task t where t.ojt_enrollment=?1 and t.status=?2")
    List<Task> findTasksByOjt_enrollmentAndStatus(Ojt_Enrollment ojt_enrollment, Status status);
}
