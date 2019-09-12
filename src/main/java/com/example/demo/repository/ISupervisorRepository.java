package com.example.demo.repository;

import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Supervisor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ISupervisorRepository extends JpaRepository<Supervisor,String> {

    @Query(value = "select s from Supervisor s where s.business.email=?1 and s.isActive='true'")
    List<Supervisor> findSupervisorsByBusinessEmailAndActiveIsTrue(String email);

    @Query(value = "select s from Supervisor s where s.business.email=?1")
    List<Supervisor> findSupervisorsByBusinessEmail(String email);

    Supervisor findByEmail(String email);

    @Query(value = "select s from Supervisor s where s.email=?1 and s.business.email=?2")
    Supervisor findSupervisorByEmailAndBusinessEmail(String email,String businessEmail);
}
