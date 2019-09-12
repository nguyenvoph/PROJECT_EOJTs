package com.example.demo.entity;

import com.fasterxml.jackson.annotation.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

//@JsonInclude(JsonInclude.Include.NON_NULL)
//@JsonIgnoreProperties(ignoreUnknown = true, value = {"authorities", "hibernateLazyInitializer", "handler"})
@JsonIgnoreProperties(value = {"authorities"})

@Entity
@Table(name = "Users")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property  = "email")

public class Users implements Serializable {

    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password")
    private String password;


    @ManyToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(
            name = "userRole",
            joinColumns = {
                    @JoinColumn(name = "userEmail")},
            inverseJoinColumns = {
                    @JoinColumn(name = "roleId")}
    )
//    @JsonManagedReference
    private List<Role> roles;

    @Column(name = "isActive")
    private boolean isActive;

    @Column(name = "resetToken")
    private String resetToken;

    @Column(name = "resetTime")
    private String resetTime;

    public Users() {
    }

    public Users(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public String getResetTime() {
        return resetTime;
    }

    public void setResetTime(String resetTime) {
        this.resetTime = resetTime;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getDescription()));
        }
       // System.out.println("authorities" + authorities);
        return authorities;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
