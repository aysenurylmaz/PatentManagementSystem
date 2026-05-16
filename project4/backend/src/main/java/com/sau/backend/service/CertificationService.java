package com.sau.backend.service;

import com.sau.backend.dtos.CertificationDTO;
import com.sau.backend.model.Certification;

import java.util.List;

public interface CertificationService {
    List<CertificationDTO> getAllCertifications();
    CertificationDTO getCertificationById(Integer id);
    CertificationDTO createCertification(Certification certification);
    CertificationDTO updateCertification(Integer id, Certification certification);
    void deleteCertification(Integer id);

    // Hocanın istediği Join metodu buraya eklendi
    List<CertificationDTO> getCertificationsWithJoins();
}