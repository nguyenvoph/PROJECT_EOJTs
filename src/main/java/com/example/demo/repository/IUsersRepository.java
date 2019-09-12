package com.example.demo.repository;

import com.example.demo.entity.Role;
import com.example.demo.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IUsersRepository extends JpaRepository<Users,String> {

    Users findUserByEmailAndPassword(String email, String password);

    @Query(value =   "SELECT a \n"
            + "       FROM Users a\n"
            + "       WHERE a.email=?1 and a.password=?2\n")
    Users findUserCustom(String email, String password);

    Users findUserByEmail(String email);

    List<Users> findUsersByRoles(List<Role> roles);
}
