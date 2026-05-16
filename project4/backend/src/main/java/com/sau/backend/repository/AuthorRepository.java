package com.sau.backend.repository;

import com.sau.backend.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuthorRepository extends JpaRepository<Author, Integer> {
    List<Author> findAllByOrderByIdAsc();
}