package com.example.demo.repository;

import com.example.demo.entity.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IBusinessRepository extends JpaRepository<Business, String> {

    Business findBusinessByEmail(String email);

    @Query(value = "select b from Business b where b.business_eng_name=?1")
    Business findBusinessByBusiness_eng_name(String name);
//    Business findBusinessByBusiness_eng_name(String business_eng_name);

    @Query(value = "select b from Business b order by b.rateAverage DESC")
    List<Business> findTop5OrderByRateAverageDesc();


}
