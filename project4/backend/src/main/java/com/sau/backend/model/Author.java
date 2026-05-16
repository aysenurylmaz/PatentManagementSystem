package com.sau.backend.model;

import com.sau.backend.dtos.AuthorDTO;
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
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 16)
    private String name;

    @Column(length = 32)
    private String address;

    @Column(length = 256)
    private String imagePath;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Certification> certifications;

    public Author(AuthorDTO authorDTO) {
        this.id = authorDTO.getId();
        this.name = authorDTO.getName();
        this.address = authorDTO.getAddress();
        this.imagePath = authorDTO.getImagePath();
    }

    public AuthorDTO viewAsAuthorDTO() {
        return new AuthorDTO(id, name, address, imagePath);
    }
}
