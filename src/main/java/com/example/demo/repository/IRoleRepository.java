package com.example.demo.repository;

import com.example.demo.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IRoleRepository extends JpaRepository<Role,Integer> {

    @Query(value = "SELECT r \n"
            + "       FROM Role r\n"
            + "       WHERE r.id=?1")
    public Role findRoleById(int id);
}
