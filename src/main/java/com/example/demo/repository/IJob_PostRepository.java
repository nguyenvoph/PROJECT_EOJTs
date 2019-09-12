package com.example.demo.repository;

import com.example.demo.entity.Job_Post;
import com.example.demo.entity.Ojt_Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IJob_PostRepository extends JpaRepository<Job_Post,Integer> {
    Job_Post findJob_PostById(int id);

    @Query(value = "select j from Job_Post j order by timePost desc")
    List<Job_Post> findJob_PostsOrderByTimePostDesc();

    @Query(value = "select j from Job_Post j where j.ojt_enrollment=?1")
    List<Job_Post> findJob_PostByOjt_enrollment(Ojt_Enrollment ojt_enrollment);
}
