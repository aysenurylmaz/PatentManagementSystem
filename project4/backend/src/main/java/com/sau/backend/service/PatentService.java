package com.sau.backend.service;

import com.sau.backend.dtos.PatentDTO;
import com.sau.backend.model.Patent;

import java.util.List;

public interface PatentService {
    List<PatentDTO> getAllPatents();
    PatentDTO getPatentById(Integer id);
    PatentDTO createPatent(Patent patent);
    PatentDTO updatePatent(Integer id, Patent patent);
    void deletePatent(Integer id);
}