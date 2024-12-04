package com.project.it.service;

import com.project.it.domain.InfoPartnersFile;
import com.project.it.dto.InfoPartnersFileDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface InfoPartnersFileService {

    // C 파일 등록
    Long register(MultipartFile file, Long cno) throws IOException;

    // R // 파일 리스트 가져옴
    List<InfoPartnersFileDTO> getList(Long cno);

    // D 삭제
    Long delete(Long fno);

}
