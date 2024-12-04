package com.project.it.service;

import com.project.it.Repository.InfoPartnersRepository;
import com.project.it.Repository.ProjectPartnerRepository;
import com.project.it.Repository.ProjectRepository;
import com.project.it.domain.InfoPartners;
import com.project.it.domain.Project;
import com.project.it.domain.ProjectPartner;
import com.project.it.dto.InfoPartnersDTO;
import com.project.it.dto.ProjectDTO;
import com.project.it.dto.ProjectPartnerDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class ProjectPartnerServiceImpl implements ProjectPartnerService {

    private final ProjectPartnerRepository projectPartnerRepository;

    private final ProjectService projectService;

    private final InfoPartnersService infoPartnersService;

    @Override
    // project와 연결된 고객사 정보 등록, (담당자 추가)
    public Long register(ProjectPartnerDTO projectPartnerDTO) {
        ProjectPartner projectPartner = dtoToEntity(projectPartnerDTO);
        projectPartnerRepository.save(projectPartner);
        return projectPartner.getPpno();
    }

    @Override
    // pno 프로젝트 번호로 고객사 정보 가져옴
    public ProjectPartnerDTO get(Long pno) {
        ProjectPartner projectPartner = projectPartnerRepository.findByProjectPno(pno);
        ProjectPartnerDTO projectPartnerDTO = entityToDto(projectPartner);
        log.info(projectPartnerDTO);
        return projectPartnerDTO;
    }

    @Override
    // 고객사 정보 수정
    public Long update(ProjectPartnerDTO projectPartnerDTO) {
        ProjectPartner projectPartner = dtoToEntity(projectPartnerDTO);
        projectPartnerRepository.save(projectPartner);
        return projectPartner.getPpno();
    }

    public ProjectPartner dtoToEntity(ProjectPartnerDTO projectPartnerDTO) {

        InfoPartners infoPartners = infoPartnersService.dtoToEntity(projectPartnerDTO.getInfoPartnersDTO());

        Project project = projectService.dtoToEntity(projectPartnerDTO.getProjectDTO());

        ProjectPartner projectPartner = ProjectPartner.builder()
                .email(projectPartnerDTO.getEmail())
                .phone(projectPartnerDTO.getPhone())
                .ppno(projectPartnerDTO.getPpno())
                .phone(projectPartnerDTO.getPhone())
                .name(projectPartnerDTO.getName())
                .request(projectPartnerDTO.getRequest())
                .infoPartners(infoPartners)
                .project(project)
                .build();
        log.info(projectPartner);
        return projectPartner;
    }

    public ProjectPartnerDTO entityToDto(ProjectPartner projectPartner) {
        InfoPartnersDTO infoPartnersDTO = infoPartnersService.entityToDto(projectPartner.getInfoPartners());
        ProjectDTO projectDTO = projectService.entityToDTO(projectPartner.getProject());

        ProjectPartnerDTO projectPartnerDTO = ProjectPartnerDTO.builder()
                .email(projectPartner.getEmail())
                .phone(projectPartner.getPhone())
                .ppno(projectPartner.getPpno())
                .phone(projectPartner.getPhone())
                .name(projectPartner.getName())
                .request(projectPartner.getRequest())
                .infoPartnersDTO(infoPartnersDTO)
                .projectDTO(projectDTO)
                .build();
        log.info(projectPartnerDTO);
        return projectPartnerDTO;
    }
}
