package com.project.it.service;

import com.project.it.dto.ProjectIssueFilesDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProjectIssueFilesService {

    // C
    Long register(MultipartFile file, Long ino) throws IOException;

    // R
    List<ProjectIssueFilesDTO> getList(Long ino);

    // D
    Long delete(Long fno);

}
