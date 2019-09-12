package com.example.demo.service;

import com.example.demo.entity.Role;
import com.example.demo.repository.IRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService implements IRoleService{
    @Autowired
    IRoleRepository IRoleRepository;

    @Override
    public Role findRoleById(int id) {
        Role role = IRoleRepository.findRoleById(id);
        if (role != null) {
            return role;
        }
        return null;
    }
}
