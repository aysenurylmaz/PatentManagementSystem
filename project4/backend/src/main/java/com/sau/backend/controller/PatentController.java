package com.sau.backend.controller;

import com.sau.backend.dtos.PatentDTO;
import com.sau.backend.model.Patent;
import com.sau.backend.service.PatentService;
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
@RequestMapping("/patent")
public class PatentController {

    private final static Logger logger = LoggerFactory.getLogger(PatentController.class);
    private final PatentService patentService;

    public PatentController(PatentService patentService) {
        this.patentService = patentService;
    }

    // 1. TÜM PATENTLERİ GETİR (Hocanın iskeletiyle aynı format)
    @GetMapping(value = "", produces = "application/json")
    public ResponseEntity<List<PatentDTO>> getAllPatents() {
        return new ResponseEntity<>(patentService.getAllPatents(), HttpStatus.OK);
    }

    // 2. ID İLE TEKİL PATENT GETİR
    @GetMapping(value = "/get/{id}", produces = "application/json")
    public ResponseEntity<PatentDTO> getPatent(@PathVariable Integer id) {
        if (id == null || id <= 0) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        logger.info("Get patent by id {}", id);
        return new ResponseEntity<>(patentService.getPatentById(id), HttpStatus.OK);
    }

    // 3. PATENT EKLE
    @PostMapping(value = "/add", consumes = "application/json", produces = "application/json")
    public ResponseEntity<PatentDTO> addPatent(@RequestBody Patent patent) {
        if (patent == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(patentService.createPatent(patent), HttpStatus.CREATED);
    }

    // 4. PATENT GÜNCELLE
    @PutMapping("/update/{id}")
    public ResponseEntity<PatentDTO> updatePatent(@PathVariable Integer id, @RequestBody Patent patent) {
        if ((id == null || id <= 0 || patent == null) || (!id.equals(patent.getId())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(patentService.updatePatent(id, patent), HttpStatus.OK);
    }

    // 5. PATENT SİL
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<PatentDTO> deletePatent(@PathVariable Integer id) {
        if (id == null || id <= 0) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        patentService.deletePatent(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/pdf")
    public String generatePdf() throws FileNotFoundException, JRException {
        // 1. Fetch data
        List<PatentDTO> patents = patentService.getAllPatents();

        // 2. Dynamic Path & Timestamp (Dinamik Yol ve Zaman Damgası)
        String projectDir = System.getProperty("user.dir");
        String path = projectDir + File.separator + "project4" + File.separator + "outputs";
        // Safety check: Create the 'outputs' directory if it doesn't exist
        File directory = new File(path);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 3. DataSource and File Loading
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(patents);
        File file = ResourceUtils.getFile("classpath:patents_report.jrxml");

        // 4. Compile, Fill and Export
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, null, dataSource);

        // Save the PDF dynamically with the timestamp (Dosya ismine timestamp eklendi)
        String fileName = "\\patents_report.pdf";
        JasperExportManager.exportReportToPdfFile(jasperPrint, path + fileName);

        return "PDF report successfully created in the outputs folder!";
    }
}