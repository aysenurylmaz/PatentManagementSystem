package com.sau.backend.repository;

import com.sau.backend.model.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CertificationRepository extends JpaRepository<Certification, Integer> {

    Certification findByAuthorIdAndPatentId(Integer authorId, Integer patentId);
    boolean existsByAuthorIdAndPatentId(Integer authorId, Integer patentId);
    // Hocanın beklediği virgülle ayrılmış String döndüren SQL sorgusu
    @Query(value = "SELECT CONCAT_WS(',', c.id, a.id, a.name, a.address, p.id, p.title, p.description, c.issue_date, c.duration_in_year) " +
            "FROM certification c " +
            "JOIN author a ON c.author_id = a.id " +
            "JOIN patents p ON c.patent_id = p.id "+
            "ORDER BY c.id ASC", nativeQuery = true)
    List<String> getAllWithJoins();
    List<Certification> findByAuthorId(Integer authorId);

    @Query("SELECT c FROM Certification c JOIN FETCH c.author JOIN FETCH c.patent WHERE c.id = :id")
    Optional<Certification> findByIdWithJoins(@Param("id") Integer id);
}