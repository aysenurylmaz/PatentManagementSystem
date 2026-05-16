package com.sau.backend.service;

import com.sau.backend.dtos.AuthorDTO;
import com.sau.backend.model.Author;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AuthorService {
    List<AuthorDTO> getAllAuthors();
    AuthorDTO getAuthorById(Integer id);
    AuthorDTO createAuthor(Author author);
    AuthorDTO updateAuthor(Integer id, Author author);
    void deleteAuthor(Integer id);
    AuthorDTO uploadImage(Integer id, MultipartFile file) throws IOException;
    byte[] downloadImage(Integer id) throws IOException;
    AuthorDTO deleteImage(Integer id) throws IOException;
}
