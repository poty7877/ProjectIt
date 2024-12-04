package com.project.it.controller;

import com.project.it.dto.InfoPartnersFileDTO;
import com.project.it.service.InfoPartnersFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/api/partners/file")
public class PartnersFileController {

    @Autowired
    private InfoPartnersFileService infoPartnersFileServiceService;
    //업로드 경로
    @Value("${infoPartnerFileDirectory}")
    private String uploadDir;
    // 사업자 파일 등록
    @PostMapping("/")
    public ResponseEntity<String> register(MultipartFile file, Long cno) throws IOException {
        infoPartnersFileServiceService.register(file, cno);
        return ResponseEntity.ok("SUCCESS");
    }
    // 사업자 등록 번호로 파일이름 리스트 가져옴
    @GetMapping("/{cno}")
    public List<InfoPartnersFileDTO> getList(@PathVariable Long cno){
        return infoPartnersFileServiceService.getList(cno);
    }
    // 파일 번호로 파일 삭제
    @DeleteMapping("/{fno}")
    public ResponseEntity<String> delete(@PathVariable Long fno){
        infoPartnersFileServiceService.delete(fno);
        return ResponseEntity.ok("SUCCESS");
    }
    // 위에서 가져온 파일이름으로 엔드 포인트 생성
    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName){
        // 파일 시스템에 존재하는 파일을 읽기 위한 리소스
        Resource resource = new FileSystemResource(uploadDir+ File.separator+fileName);

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
