package com.sau.backend.controller;

import com.sau.backend.dtos.AuthorDTO;
import com.sau.backend.model.Author;
import com.sau.backend.service.AuthorService;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/author")
public class AuthorController {
    private final static Logger logger = LoggerFactory.getLogger(AuthorController.class);
    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping(value = "", produces = "application/json")
    public ResponseEntity<List<AuthorDTO>> getAllAuthors() {
        return new ResponseEntity<>(authorService.getAllAuthors(), HttpStatus.OK);
    }

    @GetMapping(value = "/get/{id}", produces = "application/json")
    public ResponseEntity<AuthorDTO> getAuthor(@PathVariable Integer id) {
        if (id == null || id <= 0) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        logger.info("Get author by id {}", id);
        return new ResponseEntity<>(authorService.getAuthorById(id), HttpStatus.OK);
    }

    @PostMapping(value = "/add", consumes = "application/json", produces = "application/json")
    public ResponseEntity<AuthorDTO> addAuthor(@RequestBody Author author) {
        if (author == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(authorService.createAuthor(author), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AuthorDTO> updateAuthor(@PathVariable Integer id, @RequestBody Author author) {
        if ((id == null || id <= 0 || author == null) || (!id.equals(author.getId()))) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(authorService.updateAuthor(id, author), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<AuthorDTO> deleteAuthor(@PathVariable Integer id) {
        if (id == null || id <= 0) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        authorService.deleteAuthor(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/upload/{id}")
    public ResponseEntity<AuthorDTO> uploadImage(@PathVariable Integer id, @RequestParam("file") MultipartFile file) {
        try {
            return new ResponseEntity<>(authorService.uploadImage(id, file), HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadImage(@PathVariable Integer id) {
        try {
            byte[] image = authorService.downloadImage(id);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(image);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<byte[]> viewImage(@PathVariable Integer id) {
        try {
            byte[] image = authorService.downloadImage(id);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .header("Content-Disposition", "inline; filename=\"author_" + id + ".jpg\"")
                    .body(image);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/image/{id}")
    public ResponseEntity<AuthorDTO> deleteImage(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(authorService.deleteImage(id));
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/pdf")
    public String generatePdf() throws FileNotFoundException, JRException {
        // 1. Fetch all authors from the service
        List<AuthorDTO> authors = authorService.getAllAuthors();

        // 2. Dynamic Path
        String projectDir = System.getProperty("user.dir");
        String path = projectDir + File.separator + "project4" + File.separator + "outputs";


        // Safety check: Create the directory if it doesn't exist
        File directory = new File(path);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 3. DataSource and JRXML Loading
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(authors);
        File file = ResourceUtils.getFile("classpath:authors_report.jrxml");

        // 4. Compile and Export
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, null, dataSource);

        String fileName = "\\authors_report.pdf";
        JasperExportManager.exportReportToPdfFile(jasperPrint, path + fileName);

        return "Author PDF report successfully created in the outputs folder!";
    }
}
