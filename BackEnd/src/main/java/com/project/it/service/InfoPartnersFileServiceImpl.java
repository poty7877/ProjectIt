package com.project.it.service;

import com.project.it.Repository.InfoPartnersFileRepository;
import com.project.it.Repository.InfoPartnersRepository;
import com.project.it.domain.InfoPartners;
import com.project.it.domain.InfoPartnersFile;
import com.project.it.dto.InfoPartnersDTO;
import com.project.it.dto.InfoPartnersFileDTO;
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
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class InfoPartnersFileServiceImpl implements InfoPartnersFileService {

    private final InfoPartnersFileRepository infoPartnersFileRepository;
    @Value("${infoPartnerFileDirectory}")
    private String uploadDir; // 업로드 경로

    private final InfoPartnersRepository infoPartnersRepository;

    @Override
    // 파일과 cno 고객사 번호 받음 (사업자등록증 위함)
    public Long register(MultipartFile file, Long cno) throws IOException {
        // 고객사 정보 가져오기
        InfoPartners infoPartners = infoPartnersRepository.findById(cno).orElseThrow();

        // 원본 파일이름
        String oldFileName = file.getOriginalFilename();

        // 서버에 저장될 파일이름 (랜덤으로 생성)
        String fileName = UUID.randomUUID().toString() + "_" + oldFileName;

        // 파일 저장될 경로
        Path filePath = Paths.get(uploadDir + File.separator + fileName).toAbsolutePath().normalize();
        // 경로 없을시 폴더 생성
        Files.createDirectories(filePath.getParent());

        // 파일 복사
        Files.copy(file.getInputStream(), filePath);

        // 파일 정보 저장
        InfoPartnersFile infoPartnersFile = InfoPartnersFile.builder()
                .oldFileName(oldFileName)
                .fileName(fileName)
                .filePath(filePath.toString())
                .infoPartners(infoPartners)
                .build();
        infoPartnersFileRepository.save(infoPartnersFile);
        return infoPartnersFile.getFno();
    }

    @Override
    // cno 고객사 번호로 파일 리스트 가져옴
    public List<InfoPartnersFileDTO> getList(Long cno) {
        List<InfoPartnersFile> infoPartnersFiles = infoPartnersFileRepository.findAllByInfoPartnersCno(cno);

        List<InfoPartnersFileDTO> infoPartnersFileDTOs = new ArrayList<>();
        infoPartnersFiles.forEach(infoPartnersFile -> {
            InfoPartnersFileDTO infoPartnersFileDTO = entityToDTO(infoPartnersFile);
            infoPartnersFileDTOs.add(infoPartnersFileDTO);
        });
        return infoPartnersFileDTOs;
    }


    @Override
    public Long delete(Long fno) {
        // 먼저 데이터베이스에서 파일 정보를 조회
        Optional<InfoPartnersFile> fileOptional = infoPartnersFileRepository.findById(fno);

        if (fileOptional.isPresent()) {
            InfoPartnersFile file = fileOptional.get();

            // 파일 경로를 가져옴
            String filePath = file.getFilePath(); // 파일 경로를 저장한 필드

            // 파일 시스템에서 실제 파일을 삭제
            try {
                Path path = Paths.get(filePath);  // 파일 경로를 Path로 변환
                Files.delete(path);  // 파일 삭제

                // 파일 삭제가 완료되면 데이터베이스에서 해당 파일 삭제
                infoPartnersFileRepository.deleteById(fno);
                return fno;
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("파일 삭제에 실패했습니다.");
            }
        } else {
            throw new RuntimeException("파일을 찾을 수 없습니다.");
        }
    }


    public InfoPartnersFileDTO entityToDTO(InfoPartnersFile infoPartnersFile) {
        return InfoPartnersFileDTO.builder()
                .oldFileName(infoPartnersFile.getOldFileName())
                .fileName(infoPartnersFile.getFileName())
                .fno(infoPartnersFile.getFno())
                .cno(infoPartnersFile.getInfoPartners().getCno())
                .build();

    }
}
