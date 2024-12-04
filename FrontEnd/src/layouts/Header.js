import React, { useEffect, useState } from "react";
import { Navbar, Collapse, Nav, NavbarBrand, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import Logo from "./Logo";
import { ReactComponent as LogoWhite } from "../assets/images/logos/materialprowhite.svg";
import user1 from "../assets/images/users/user4.jpg";
import { getCookie, removeCookie } from "../util/cookieUtil"; // 쿠키 유틸리티 함수

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(null); // 초기값을 null로 설정
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // 쿠키에서 accessToken 읽기
  useEffect(() => {
    const token = getCookie('member'); // 쿠키에서 'member' 토큰 가져오기
    console.log("Token from cookie: ", token);
    if (token) {
      setAccessToken(token); // 토큰이 존재하면 상태 업데이트
    } else {
      setAccessToken(null); // 토큰이 없으면 상태 null로 설정
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 드롭다운 토글
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  // 사이드바 토글
  const toggleSidebar = () => setIsOpen(!isOpen);

  // 나의 정보 수정 페이지로 이동
  const handleClickModify = () => navigate("/modify");
  const handleClickLogin = () => navigate("/login");
  // 모바일 메뉴 토글
  const showMobileMenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  // 로그아웃 처리
  const handleLogout = () => {
    removeCookie('member'); // 쿠키에서 'member' 삭제
    setAccessToken(null); // 상태를 null로 업데이트
    navigate("/login"); // 로그인 페이지로 리디렉션
  };

  // 로그인 후 accessToken을 쿠키에 저장하고 상태 업데이트
  const handleLoginSuccess = (token) => {
    const cookies = new Cookies();
    cookies.set('member', token, { path: '/' }); // 쿠키에 member 값을 설정
    setAccessToken(token); // 상태 업데이트
    navigate('/'); // 홈으로 리디렉션
  };

  // 로그인 여부 계산
  const isLogin = accessToken !== null;

  return (
      <Navbar color="primary" dark expand="md" className="fix-header">
        <div className="d-flex align-items-center">
          <div className="d-lg-block d-none me-5 pe-3">
            <Logo />
          </div>
          <NavbarBrand href="/">
            <LogoWhite className="d-lg-none" />
          </NavbarBrand>
          <Button color="primary" className="d-lg-none" onClick={showMobileMenu}>
            <i className="bi bi-list"></i>
          </Button>
        </div>

        <div className="hstack gap-2">
          <Button color="primary" size="sm" className="d-sm-block d-md-none" onClick={toggleSidebar}>
            {isOpen ? <i className="bi bi-x"></i> : <i className="bi bi-three-dots-vertical"></i>}
          </Button>
        </div>

        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto" navbar></Nav>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle color="transparent">
              <img src={user1} alt="profile" className="rounded-circle" width="30" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Info</DropdownItem>
              {isLogin ? (
                  <>
                    <DropdownItem onClick={handleClickModify}>나의 정보 확인하기</DropdownItem>
                    <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
                  </>
              ) : (
                  <>
                    {/* 로그인 및 회원가입 관련 메뉴를 추가할 수 있음 */}
                    <DropdownItem onClick={handleClickLogin}>로그인하기</DropdownItem>
                  </>
              )}
            </DropdownMenu>
          </Dropdown>
        </Collapse>
      </Navbar>
  );
};

export default Header;
