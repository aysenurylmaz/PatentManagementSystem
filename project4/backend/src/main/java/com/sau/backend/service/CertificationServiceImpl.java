package com.sau.backend.service;

import com.sau.backend.dtos.CertificationDTO;
import com.sau.backend.exception.ErrorMessages;
import com.sau.backend.exception.ResourceAlreadyExistsException;
import com.sau.backend.exception.ResourceNotFoundException;
import com.sau.backend.model.Author;
import com.sau.backend.model.Certification;
import com.sau.backend.model.Patent;
import com.sau.backend.repository.AuthorRepository;
import com.sau.backend.repository.CertificationRepository;
import com.sau.backend.repository.PatentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class CertificationServiceImpl implements CertificationService {

    private final CertificationRepository certificationRepository;
    private final AuthorRepository authorRepository;
    private final PatentRepository patentRepository;

    public CertificationServiceImpl(CertificationRepository certificationRepository, AuthorRepository authorRepository, PatentRepository patentRepository) {
        this.certificationRepository = certificationRepository;
        this.authorRepository = authorRepository;
        this.patentRepository = patentRepository;
    }

    @Override
    public CertificationDTO getCertificationById(Integer id) {
        Certification c = certificationRepository.findByIdWithJoins(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.ERROR_CERTIFICATION_NOT_FOUND + ": " + id));

        // Ana DTO
        CertificationDTO certificationDTO = CertificationDTO.builder()
                .id(c.getId())
                .issueDate(c.getIssueDate())
                .durationInYear(c.getDurationInYear())
                .build();

        // Yazar DTO'sunu oluşturup içine atıyoruz
        if (c.getAuthor() != null) {
            certificationDTO.setAuthor(c.getAuthor());
        }

        // Patent DTO'sunu oluşturup içine atıyoruz
        if (c.getPatent() != null) {
            certificationDTO.setPatent(c.getPatent());
        }

        return certificationDTO;
    }

    @Override
    public List<CertificationDTO> getAllCertifications() {
        return certificationRepository.findAll().stream().map(Certification::viewAsCertificationDTO).toList();
    }

    @Override
    public CertificationDTO createCertification(Certification certification) {
        if (certification.getId() != null && certificationRepository.findById(certification.getId()).isPresent()) {
            throw new ResourceAlreadyExistsException(ErrorMessages.ERROR_CERTIFICATION_ALREADY_EXIST + ": " + certification.getId());
        }

        if (certification.getAuthor() != null && certification.getPatent() != null) {
            boolean alreadyExists = certificationRepository.existsByAuthorIdAndPatentId(
                    certification.getAuthor().getId(),
                    certification.getPatent().getId()
            );
            if (alreadyExists) {
                throw new ResourceAlreadyExistsException(
                        "This author already has certification for this patent."
                );
            }
        }

        Certification savedCert = certificationRepository.save(certification);
        System.out.println("LOG INFO: New Certificate Added - ID: " + savedCert.getId());

        return savedCert.viewAsCertificationDTO();
    }

    @Override
    public CertificationDTO updateCertification(Integer id, Certification certification) {
        certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.ERROR_CERTIFICATION_NOT_FOUND + ": " + id));

        if (certification.getAuthor() != null && certification.getPatent() != null) {
            Certification existing = certificationRepository
                    .findByAuthorIdAndPatentId(
                            certification.getAuthor().getId(),
                            certification.getPatent().getId()
                    );
            if (existing != null && !existing.getId().equals(id)) {
                throw new ResourceAlreadyExistsException(
                        "This author already has certification for this patent."
                );
            }
        }

        certification.setId(id);
        Certification updatedCert = certificationRepository.save(certification);
        System.out.println("LOG INFO: Certificate Updated - ID: " + updatedCert.getId());

        return updatedCert.viewAsCertificationDTO();
    }
    @Override
    public void deleteCertification(Integer id) {
        certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.ERROR_CERTIFICATION_NOT_FOUND + ": " + id));

        certificationRepository.deleteById(id);
        System.out.println("LOG INFO: Certificate Deleted - ID: " + id);
    }

    // İŞTE HOCANIN İSTEDİĞİ JOIN METODU BURADA
    @Override
    public List<CertificationDTO> getCertificationsWithJoins() {
        // 1. Veritabanından virgüllü stringleri çek
        List<String> certJoins = certificationRepository.getAllWithJoins();
        List<CertificationDTO> list = new ArrayList<>();

        // 2. Stringleri parçala ve DTO'lara doldur
        for(String cj : certJoins) {
            CertificationDTO cdto = new CertificationDTO();
            List<String> elem = Arrays.asList(cj.split(","));

            cdto.setId(Integer.parseInt(elem.get(0)));

            // Yazar (Author) DTO'sunu oluştur (İndeks 1, 2 ve 3)
            Author author = new Author();
            author.setId(Integer.parseInt(elem.get(1)));
            author.setName(elem.get(2));
            author.setAddress(elem.get(3)); // Kodundan gelen adres detayı
            cdto.setAuthor(author);

            // Patent DTO'sunu oluştur (İndeks 4, 5 ve 6)
            Patent patent = new Patent();
            patent.setId(Integer.parseInt(elem.get(4)));
            patent.setTitle(elem.get(5));
            patent.setDescription(elem.get(6));
            cdto.setPatent(patent);

            // Tarih ve Yıl bilgilerini al (İndeks 7 ve 8)
            cdto.setIssueDate(LocalDate.parse(elem.get(7)));
            cdto.setDurationInYear(Integer.parseInt(elem.get(8)));

            list.add(cdto);
        }
        return list;
    }
}