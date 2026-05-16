package com.sau.backend.controller;

import com.sau.backend.dtos.CertificationDTO;
import com.sau.backend.model.Certification;
import com.sau.backend.repository.CertificationRepository;
import com.sau.backend.service.CertificationService;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/certification")
public class CertificationController {

    private final static Logger logger = LoggerFactory.getLogger(CertificationController.class);
    private final CertificationService certificationService;
    private final CertificationRepository certificationRepository;

    public CertificationController(CertificationService certificationService, CertificationRepository certificationRepository) {
        this.certificationService = certificationService;
        this.certificationRepository = certificationRepository;
    }

    @GetMapping(value = "", produces = "application/json")
    public ResponseEntity<List<CertificationDTO>> getAllCertifications() {
        return new ResponseEntity<>(certificationService.getAllCertifications(), HttpStatus.OK);
    }

    //  JOIN ENDPOINT'İ BURADA!
    @GetMapping(value="/join", produces = "application/json")
    public ResponseEntity<List<CertificationDTO>> getCertificationJoins(){
        List<CertificationDTO> certifications = certificationService.getCertificationsWithJoins();
        return new ResponseEntity<>(certifications, HttpStatus.OK);
    }

    @GetMapping(value = "/get/{id}", produces = "application/json")
    public ResponseEntity<CertificationDTO> getCertification(@PathVariable Integer id) {
        if (id == null || id <= 0) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        logger.info("Get certification by id {}", id);
        return new ResponseEntity<>(certificationService.getCertificationById(id), HttpStatus.OK);
    }

    @PostMapping(value = "/add", consumes = "application/json", produces = "application/json")
    public ResponseEntity<CertificationDTO> addCertification(@RequestBody Certification certification) {
        if (certification == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(certificationService.createCertification(certification), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CertificationDTO> updateCertification(@PathVariable Integer id, @RequestBody Certification certification) {
        if ((id == null || id <= 0 || certification == null) || (!id.equals(certification.getId()))) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(certificationService.updateCertification(id, certification), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<CertificationDTO> deleteCertification(@PathVariable Integer id) {
        if (id == null || id <= 0) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        certificationService.deleteCertification(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/pdf")
    public String generatePdf() throws FileNotFoundException, JRException {

        List<CertificationDTO> certifications = certificationService.getCertificationsWithJoins();

        String projectDir = System.getProperty("user.dir");
        String path = projectDir + File.separator + "project4" + File.separator + "outputs";
        File directory = new File(path);
        if (!directory.exists()) { directory.mkdirs(); }

        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(certifications);
        File file = ResourceUtils.getFile("classpath:certifications_report.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, null, dataSource);
        JasperExportManager.exportReportToPdfFile(jasperPrint, path + "\\certifications_report.pdf");
        return "Certification PDF report successfully created in the outputs folder!";
    }
    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<Certification>> getCertificationsByAuthorId(@PathVariable Integer authorId) {
        return ResponseEntity.ok(certificationRepository.findByAuthorId(authorId));
    }
}

