package com.project.it.service;

import com.project.it.Repository.ProjectMemberRepository;
import com.project.it.Repository.ProjectRepository;
import com.project.it.domain.Project;
import com.project.it.domain.ProjectMember;
import com.project.it.dto.ChatRoomsDTO;
import com.project.it.dto.ChatUserDTO;
import com.project.it.dto.ProjectDTO;
import com.project.it.dto.ProjectMemberDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class ProjectMemberServiceImpl implements ProjectMemberService{


    private final ProjectRepository projectRepository;

    private final ProjectMemberRepository projectMemberRepository;

    private final ChatUsersService chatUsersService;

    private final ChatRoomsService chatRoomsService;

    @Transactional
    @Override
    public List<Long> register(List<ProjectMemberDTO> projectMemberDTOs) {

        // 새로운 엔티티 리스트 생성
        List<ProjectMember> projectMembers = new ArrayList<>();
        List<ChatUserDTO> chatUserDTOs = new ArrayList<>();

        // 프로젝트 번호를 통해 채팅방 정보 가져오기
        ChatRoomsDTO chatRoomsDTO = chatRoomsService.get(projectMemberDTOs.get(0).getPno());
        System.out.println("진짜로?" + chatRoomsDTO);

        Long crno = chatRoomsDTO.getCrno();

        // 받아온 리스트에 있는 DTO들을 Entity로 변환 후 생성한 리스트에 추가
        for (ProjectMemberDTO memberDTO : projectMemberDTOs) {
            ProjectMember projectMember = dtoToEntity(memberDTO); // DTO를 엔티티로 변환
            projectMembers.add(projectMember);
        }

        // 프로젝트 멤버들 DB에 저장
        projectMemberRepository.saveAll(projectMembers); // 리스트로 한 번에 저장

        for (ProjectMember member : projectMembers) {
            ChatUserDTO chatUserDTO = ChatUserDTO.builder()
                    .mno(member.getPmno())
                    .crno(crno)
                    .build();
            chatUserDTOs.add(chatUserDTO);
        }


        // 채팅 사용자들 DB에 등록
        chatUsersService.register(chatUserDTOs);

        // 등록된 프로젝트 멤버들의 pmno 값을 반환
        return projectMembers.stream()
                .map(ProjectMember::getPmno) // 각 엔티티에서 pmno를 추출
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectMemberDTO> getList(Long projectId) {
        // 프로젝트의 id, 즉 pno를 이용해서 참여중인 인원을 불러올 예정
        // 인원수가 그리 많지 않기때문에 페이징 처리는 하지 않음.
        List<ProjectMemberDTO> projectMemberDTOs = new ArrayList<>();
        // Pno를 이용해서 참여중인 멤버리스트를 불러옴
        List<ProjectMember> projectMembers = projectMemberRepository.findByProjectId(projectId);
        // 받아온 엔티티리스트를 DTO리스트로 변경후 추가
        for(ProjectMember projectMember : projectMembers){
            ProjectMemberDTO projectMemberDTO = entityToDTO(projectMember);
            projectMemberDTOs.add(projectMemberDTO);
        }
        // 리스트 리턴
        return projectMemberDTOs;
    }

    @Override
    // pno, mno 를 이용해서 삭제하는 메서드
    public void delete(Long pno, Long mno) {
        projectMemberRepository.deleteByPnoWithMno(pno, mno);
    }

    @Override
    // mno와 pno를 이용해서 ProjectMember 객체를 찾아오는 메서드
    public ProjectMemberDTO getOne(Long mno, Long pno) {
        ProjectMember projectMember = projectMemberRepository.findByMnoAndProject_Pno(mno, pno);
        ProjectMemberDTO projectMemberDTO = entityToDTO(projectMember);
        return projectMemberDTO;
    }


    // DTO를 엔티티로 변경해주는 메서드
    public ProjectMember dtoToEntity(ProjectMemberDTO projectMemberDTO) {
        
        // DTO의 프로젝트 번호를 이용해서 프로젝트를 불러옴
        Optional<Project> result = projectRepository.findById(projectMemberDTO.getPno());
        Project project = result.orElseThrow();

        return ProjectMember.builder()
                .mno(projectMemberDTO.getMno())
                .name(projectMemberDTO.getName())
                .memberRole(projectMemberDTO.getMemberRole())
                .team(projectMemberDTO.getTeam())
                .project(project)
                .build();
    }

    @Override
    // 엔티티를 DTO로 변경해주는메서드
    public ProjectMemberDTO entityToDTO(ProjectMember projectMember) {
        ProjectMemberDTO projectMemberDTO;

        // 프로젝트 이슈 때문에 만듦
        // 프로젝트 이슈에서 공통사항으로 등록시 null 이 들어옴
        if(projectMember == null) {
            projectMemberDTO = ProjectMemberDTO.builder()
                    .mno(0L)
                    .name("공통사항")
                    .build();
        } else {
            projectMemberDTO = ProjectMemberDTO.builder()
                    .mno(projectMember.getMno())
                    .name(projectMember.getName())
                    .memberRole(projectMember.getMemberRole())
                    .team(projectMember.getTeam())
                    .pno(projectMember.getProject().getPno())
                    .build();
        }
        return projectMemberDTO;

    }

}
