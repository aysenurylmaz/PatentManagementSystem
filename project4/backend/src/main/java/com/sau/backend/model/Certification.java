package com.sau.backend.model;

import com.sau.backend.dtos.CertificationDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="issue_date")
    private LocalDate issueDate;

    @Column(name="duration_in_year")
    private Integer durationInYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private Author author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patent_id")
    private Patent patent;

    // DTO'dan Entity'ye dönüştüren yapıcı metot (Constructor)
    public Certification(CertificationDTO dto) {
        this.id = dto.getId();
        this.issueDate = dto.getIssueDate();
        this.durationInYear = dto.getDurationInYear();
        this.author = null;
        this.patent = null;
    }
    public CertificationDTO viewAsCertificationDTO() {
        return CertificationDTO.builder()
                .id(this.id)
                .issueDate(this.issueDate)
                .durationInYear(this.durationInYear)
                .build();
    }
}
