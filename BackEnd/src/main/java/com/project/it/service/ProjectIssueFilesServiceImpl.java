package com.project.it.service;

import com.project.it.Repository.ProjectIssueFileRepository;
import com.project.it.Repository.ProjectIssueRepository;
import com.project.it.domain.ProjectIssue;
import com.project.it.domain.ProjectIssueFiles;
import com.project.it.dto.ProjectIssueFilesDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class ProjectIssueFilesServiceImpl implements ProjectIssueFilesService {

    private final ProjectIssueFileRepository projectIssueFileRepository;
    @Value("${issueFileDirectory}")
    private String uploadDir;

    private final ProjectIssueRepository projectIssueRepository;

    @Override
    public Long register(MultipartFile file, Long ino) throws IOException {
        // projectIssueService 이용해서 issue 객체 찾아옴.
        ProjectIssue projectIssue = projectIssueRepository.findById(ino).orElseThrow();

        // 원본 파일명
        String oldFileName = file.getOriginalFilename();

        // 저장할 파일명
        String fileName = UUID.randomUUID().toString() + "_" + oldFileName;

        // 파일 저장 경로 설정
        Path filePath = Paths.get(uploadDir + File.separator + fileName).toAbsolutePath().normalize();
        Files.createDirectories(filePath.getParent());

        // 파일 저장
        Files.copy(file.getInputStream(), filePath);

        // 파일 정보 저장
        ProjectIssueFiles projectIssueFiles = ProjectIssueFiles.builder()
                .oldFileName(oldFileName)
                .fileName(fileName)
                .filePath(filePath.toString())
                .projectIssue(projectIssue)
                .build();
        projectIssueFileRepository.save(projectIssueFiles);
        projectIssue.changeIsFiles(true);
        projectIssueRepository.save(projectIssue);
        return projectIssueFiles.getFno();
    }

    @Override
    // ino로 파일 리스트 불러옴
    public List<ProjectIssueFilesDTO> getList(Long ino) {
        List<ProjectIssueFiles> projectIssues = projectIssueFileRepository.findAllByProjectIssueIno(ino);

        List<ProjectIssueFilesDTO> projectIssueFilesDTOs = new ArrayList<>();
        projectIssues.forEach(projectIssueFiles -> {
            ProjectIssueFilesDTO projectIssueFilesDTO = entityToDto(projectIssueFiles);
            projectIssueFilesDTOs.add(projectIssueFilesDTO);
        });
        return projectIssueFilesDTOs;
    }

    @Override
    // fno 파일 번호로 파일 삭제
    public Long delete(Long fno) {
        projectIssueFileRepository.deleteById(fno);
        return fno;
    }


    public ProjectIssueFilesDTO entityToDto(ProjectIssueFiles projectIssueFiles) {
        return ProjectIssueFilesDTO.builder()
                .oldFileName(projectIssueFiles.getOldFileName())
                .fileName(projectIssueFiles.getFileName())
                .filePath(projectIssueFiles.getFilePath())
                .fno(projectIssueFiles.getFno())
                .ino(projectIssueFiles.getProjectIssue().getIno())
                .build();
    }
}
