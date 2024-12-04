package com.project.it.util;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component //Bean으로 사용
@Log4j2
@RequiredArgsConstructor
public class CustomFileUtil { //파일 입출력 담당(p.185)
    @Value("${org.zerock.upload.path}")
    private String uploadPath;
    
    @PostConstruct //의존성 주입이 완료된 후에 실행되어야 하는 method, 호출되지 않아도 실행
    public void init(){
        //저장폴더 생성
        File tempFolder = new File(uploadPath);
        if(tempFolder.exists()==false){
            tempFolder.mkdirs();
        }
        uploadPath = tempFolder.getAbsolutePath();
        log.info("--------------업로드 경로 : "+uploadPath);
    }
    //파일저장
    public List<String> saveFiles(List<MultipartFile> files) throws RuntimeException{
        if(files == null || files.size() ==0){
            return List.of();
        }

        List<String> uploadNames = new ArrayList<>();
        for(MultipartFile multipartFile:files){
            String savedName = UUID.randomUUID().toString()+"_"+multipartFile.getOriginalFilename(); //저장명 = uuid_filename
            Path savePath = Paths.get(uploadPath, savedName);
            try {
                Files.copy(multipartFile.getInputStream(),savePath); //저장
                //이미지 여부 확인
                String contentType = multipartFile.getContentType();
                if(contentType != null && contentType.startsWith("image")){
                    Path thumbnailPath = Paths.get(uploadPath, "s_"+savedName);
                    Thumbnails.of(savePath.toFile()).size(200,200).toFile(thumbnailPath.toFile());
                }
                uploadNames.add(savedName); //이름배열 추가
            }catch (IOException e){
                throw  new RuntimeException(e.getMessage());
            }
        } //end for()
        return uploadNames;
    }
    
    //파일 불러오기
    public ResponseEntity<Resource> getFile(String fileName){
        Resource resource = new FileSystemResource(uploadPath+File.separator+fileName);
        if(!resource.isReadable()){
            resource =new FileSystemResource(uploadPath+File.separator+"default.jpeg");
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

    //파일 삭제
    public void deleteFiles(List<String> fileNames){
        if(fileNames == null || fileNames.size()==0){
            return;
        }
        fileNames.forEach(fileName ->{
            //섬네일 있는지 확인하고 삭제
            String thumbnailFileName = "s_"+fileName;
            Path thumbnailPath = Paths.get(uploadPath, thumbnailFileName); //섬네일 경로
            Path filePath = Paths.get(uploadPath, fileName); //원본파일 경로

            try {
                Files.deleteIfExists(filePath);
                Files.deleteIfExists(thumbnailPath);
            }catch (IOException e){
                throw new RuntimeException(e.getMessage());
            }
        });
    }
}
