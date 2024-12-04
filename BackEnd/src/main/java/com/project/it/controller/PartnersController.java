package com.project.it.controller;

import com.project.it.dto.InfoPartnersDTO;
import com.project.it.dto.PageRequestDTO;
import com.project.it.dto.PageResponseDTO;
import com.project.it.service.InfoPartnersService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/api/partners")
@RestController
@RequiredArgsConstructor
@Log4j2
public class PartnersController {

    private final InfoPartnersService infoPartnersService;
    // 고객사 전체리스트 출력(페이징처리됨)
    @GetMapping("/list")
    public PageResponseDTO<InfoPartnersDTO> getList(PageRequestDTO pageRequestDTO) {
        return infoPartnersService.getList(pageRequestDTO);
    }
    // 고객사 등록
    @PostMapping("/")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody InfoPartnersDTO infoPartnersDTO) {
        Map<String,Object> response = new HashMap<>();
        Long cno = infoPartnersService.register(infoPartnersDTO);
        response.put("status", "SUCCESS");
        response.put("cno", cno);
        return ResponseEntity.ok().body(response);
    }
    // 고객사 수정
    @PutMapping("/{cno}")
    public ResponseEntity<String> update(@Valid @RequestBody InfoPartnersDTO infoPartnersDTO) {
        infoPartnersService.update(infoPartnersDTO);
        return ResponseEntity.ok("SUCCESS");
    }
    // 고객사 삭제
    @DeleteMapping("/{cno}")
    public ResponseEntity<String> delete(@PathVariable Long cno) {
        infoPartnersService.remove(cno);
        return ResponseEntity.ok("SUCCESS");
    }
    // 고객사 검색(회사 명, 전화번호)
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getOne(@RequestParam String name, @RequestParam String phone) {
        System.out.println("파트너dto확인 : " + name + phone);

        Map<String, Object> response = new HashMap<>();

        InfoPartnersDTO infoPartnersDTO = infoPartnersService.getOne(name, phone);
        if (infoPartnersDTO != null) {
            // 성공 시 DTO와 SUCCESS 메시지 반환
            response.put("status", "SUCCESS");
            response.put("data", infoPartnersDTO);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            // 데이터가 없을 경우 실패 처리
            response.put("status", "FAIL");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }
    }
    // cno Id를 이용해서 조회
    @GetMapping("/{cno}")
    public InfoPartnersDTO get(@PathVariable Long cno) {
        InfoPartnersDTO infoPartnersDTO = infoPartnersService.getOneByCno(cno);
        return infoPartnersDTO;
    }
    // 페이징처리되지 않은 순수 리스트
    @GetMapping("/listup")
    public List<InfoPartnersDTO> getList2() {
        return infoPartnersService.getList();
    }
}
