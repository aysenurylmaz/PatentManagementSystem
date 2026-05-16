package com.sau.backend.repository;

import com.sau.backend.model.Patent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatentRepository extends JpaRepository<Patent, Integer> {
    List<Patent> findAllByOrderByIdAsc();
}