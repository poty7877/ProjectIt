package com.project.it.service;

import com.project.it.dto.ProjectPartnerDTO;

public interface ProjectPartnerService {

    // C
    Long register(ProjectPartnerDTO projectPartnerDTO);

    // R
    ProjectPartnerDTO get(Long pno);

    // U
    Long update(ProjectPartnerDTO projectPartnerDTO);

}
