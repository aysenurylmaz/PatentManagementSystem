package com.sau.backend.model;

import com.sau.backend.dtos.PatentDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "PATENTS") // Tablo ismini açıkça belirtmek hocanın isimlendirme tarzına uyar
public class Patent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID") // Hocanın yaptığı gibi kolon ismini büyük harfle sabitleyelim
    private Integer id;

    @Column(name = "TITLE", length = 32) // Veritabanı tarafında TITLE olarak görünmesi profesyoneldir
    private String title;

    @Column(name = "DESCRIPTION", length = 64)
    private String description;

    // İlişki tanımlaması iskeletin için önemli, aynen kalmalı
    @OneToMany(mappedBy = "patent", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Certification> certifications;

    // DTO'dan Entity'ye dönüştüren yapıcı metot
    public Patent(PatentDTO patentDTO) {
        this.id = patentDTO.getId();
        this.title = patentDTO.getTitle();
        this.description = patentDTO.getDescription();
    }

    // Entity'den DTO'ya dönüştüren metot
    public PatentDTO viewAsPatentDTO() {
        // Hatırlarsan az önce profesyonel çözüm için Builder eklemiştik
        // Eğer PatentDTO'ya @Builder eklediysen burayı şu şekilde yazman daha şık olur:
        return PatentDTO.builder()
                .id(this.id)
                .title(this.title)
                .description(this.description)
                .build();
    }
}