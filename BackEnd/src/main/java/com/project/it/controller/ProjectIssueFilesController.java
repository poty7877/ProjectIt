package com.project.it.controller;

import com.project.it.domain.ProjectIssue;
import com.project.it.dto.ProjectIssueDTO;
import com.project.it.dto.ProjectIssueFilesDTO;
import com.project.it.service.ProjectIssueFilesService;
import com.project.it.service.ProjectIssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/project/files")
public class ProjectIssueFilesController {

    @Autowired
    private ProjectIssueFilesService projectIssueFilesService;

    @Value("${issueFileDirectory}")
    private String uploadDir; // 파일이 저장된 디렉토리 경로

    @PostMapping("/")
    // 파일과 ino로 이슈등록시 파일등록
    public ResponseEntity<String> register(MultipartFile file, Long ino) throws IOException {
        System.out.println("==" + file + ino);
        projectIssueFilesService.register(file, ino);
        return ResponseEntity.ok("SUCCESS");
    }

    // ino를 이용해 파일리스트 출력
    @GetMapping("/{ino}")
    public List<ProjectIssueFilesDTO> getList(@PathVariable Long ino) {
        return projectIssueFilesService.getList(ino);
    }

    // fno 파일번호로 파일 삭제
    @DeleteMapping("/{fno}")
    public ResponseEntity<String> delete(@PathVariable Long fno) {
        projectIssueFilesService.delete(fno);
        return ResponseEntity.ok("SUCCESS");
    }

    // 파일 조회 엔드포인트
    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName){

        // 파일 시스템에 존재하는 파일을 읽기 위한 리소스
        Resource resource = new FileSystemResource(uploadDir+File.separator+fileName);

        // 파일이 존재하지않거나, 읽을수없는경우 기본이미지를 반환함
        if(!resource.isReadable()){
            resource =new FileSystemResource(uploadDir+File.separator+"default.jpeg");
        }
        HttpHeaders headers = new HttpHeaders();

        try {
            headers.add("Content-Type", Files.probeContentType(resource.getFile().toPath()));
            //HTTP 헤더 메시지 생성(.getFile() 필수)
        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.ok().headers(headers).body(resource);
    }
}


