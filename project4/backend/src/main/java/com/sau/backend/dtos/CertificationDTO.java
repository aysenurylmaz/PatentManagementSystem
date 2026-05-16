package com.sau.backend.dtos;

import com.sau.backend.model.Author;
import com.sau.backend.model.Patent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificationDTO {
    private Integer id;

    // Hocanın tarzı: DTO yerine doğrudan Model sınıflarını koymak
    private Author author;
    private Patent patent;

    private LocalDate issueDate;
    private Integer durationInYear;

    public String getAuthorName() {
        return author != null ? author.getName() : "";
    }

    public String getPatentTitle() {
        return patent != null ? patent.getTitle() : "";
    }
}