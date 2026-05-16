package com.sau.backend.service;

import com.sau.backend.dtos.AuthorDTO;
import com.sau.backend.exception.ErrorMessages;
import com.sau.backend.exception.ResourceAlreadyExistsException;
import com.sau.backend.exception.ResourceNotFoundException;
import com.sau.backend.model.Author;
import com.sau.backend.repository.AuthorRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
    private final String uploadDir = "outputs/images/";

    public AuthorServiceImpl(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public AuthorDTO getAuthorById(Integer id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.ERROR_AUTHOR_NOT_FOUND + ": " + id)).viewAsAuthorDTO();
    }

    public List<AuthorDTO> getAllAuthors() {
        return authorRepository.findAllByOrderByIdAsc().stream().map(Author::viewAsAuthorDTO).toList();
    }

    public AuthorDTO createAuthor(Author author) {
        if (author.getId() != null && authorRepository.findById(author.getId()).isPresent()) {
            throw new ResourceAlreadyExistsException(ErrorMessages.ERROR_AUTHOR_ALREADY_EXIST + ": " + author.getId());
        }
        Author savedAuthor = authorRepository.save(author);
        System.out.println("LOG INFO: New Author Added - ID: " + savedAuthor.getId());
        return savedAuthor.viewAsAuthorDTO();
    }

    public AuthorDTO updateAuthor(Integer id, Author author) {
        authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.ERROR_AUTHOR_NOT_FOUND + ": " + id));
        author.setId(id);
        Author updatedAuthor = authorRepository.save(author);
        System.out.println("LOG INFO: Author Updated - ID: " + updatedAuthor.getId());
        return updatedAuthor.viewAsAuthorDTO();
    }

    public void deleteAuthor(Integer id) {
        authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.ERROR_AUTHOR_NOT_FOUND + ": " + id));
        authorRepository.deleteById(id);
        System.out.println("LOG INFO: Author Deleted - ID: " + id);
    }

    public AuthorDTO uploadImage(Integer id, MultipartFile file) throws IOException {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.ERROR_AUTHOR_NOT_FOUND + ": " + id));

        Files.createDirectories(Paths.get(uploadDir));
        String fileName = "author_" + id + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.write(filePath, file.getBytes());

        author.setImagePath(filePath.toString());
        authorRepository.save(author);
        System.out.println("LOG INFO: Image uploaded for Author ID: " + id);
        return author.viewAsAuthorDTO();
    }

    public byte[] downloadImage(Integer id) throws IOException {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.ERROR_AUTHOR_NOT_FOUND + ": " + id));

        if (author.getImagePath() == null) {
            throw new ResourceNotFoundException("No image found for author: " + id);
        }

        Path filePath = Paths.get(author.getImagePath());
        return Files.readAllBytes(filePath);
    }
    public AuthorDTO deleteImage(Integer id) throws IOException {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.ERROR_AUTHOR_NOT_FOUND + ": " + id));

        if (author.getImagePath() != null) {
            Files.deleteIfExists(Paths.get(author.getImagePath()));
            author.setImagePath(null);
            authorRepository.save(author);
        }
        return author.viewAsAuthorDTO();
    }
}
