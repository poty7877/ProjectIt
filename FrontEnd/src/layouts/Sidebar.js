import {Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Nav, NavItem} from "reactstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import user1 from "../assets/images/users/user4.jpg";
import probg from "../assets/images/bg/download.jpg";
import PageInfo from "./PageInfo";
import React, {useEffect, useState} from "react";
import {getCookie} from "../util/cookieUtil";
import {statusRead} from "../api/memberApi";

const Sidebar = () => {

    const [open, setOpen] = React.useState("");

    const [loginMember, setLoginMember] = useState({});

    const toggleAccordion = (id) => {
        setOpen(open === id ? "" : id);
    };

    const showMobilemenu = () => {
        document.getElementById("sidebarArea").classList.toggle("showSidebar");
    };

    let location = useLocation();
    const {menu2, menu3, menu4, menu5, menu6} = PageInfo();

    // 권한 확인
    const token = getCookie("member");
    const isAuthorized = token?.mno; // 권한 조건

    useEffect(() => {
        if (token?.mno) {
            statusRead(token?.mno).then(data => {
                setLoginMember(data)
            })
        }
    }, [token?.mno])


    return (
        <div>
            <div className="d-flex align-items-center"></div>
            <div className="profilebg" style={{background: `url(${probg}) no-repeat`}}>
                <div className="p-3 d-flex">
                    <img src={user1} alt="user" width="50" className="rounded-circle"/>
                    <Button
                        color="white"
                        className="ms-auto text-white d-lg-none"
                        onClick={() => showMobilemenu()}
                    >
                        <i className="bi bi-x"></i>
                    </Button>
                </div>
                <div className="bg-dark text-white p-2 opacity-75">{loginMember?.name}</div>
            </div>

            <div className="p-3 mt-2">
                {/* 권한 체크 */}
                {isAuthorized ? (
                    <Nav vertical className="sidebarNav">
                        <Accordion open={open} toggle={toggleAccordion}>
                            {/* Menu 2 */}
                            <AccordionItem>
                                <AccordionHeader targetId="2">
                                    <i className={menu2.topMenu.icon}></i>
                                    <span className="ms-3 d-inline-block">{menu2.topMenu.title}</span>
                                </AccordionHeader>
                                <AccordionBody accordionId="2">
                                    <NavItem>
                                        <Link
                                            to={menu2.topMenu.href}
                                            className={`nav-link py-2 ${location.pathname === menu2.topMenu.href ? "active" : ""}`}
                                            style={{
                                                padding: "8px 20px",
                                                borderRadius: "5px",
                                                textDecoration: "none",
                                                color: location.pathname === menu2.topMenu.href ? "#fff" : "#6c757d",
                                                backgroundColor: location.pathname === menu2.topMenu.href ? "#007bff" : "transparent"
                                            }}
                                        >
                                            {menu2.topMenu.title}
                                        </Link>
                                    </NavItem>
                                    {menu2.subMenus.map((sub) => (
                                        <ul className="offset-1" key={sub.href}>
                                            <NavItem>
                                                <Link
                                                    to={sub.href}
                                                    className={`nav-link py-2 ${location.pathname === sub.href ? "active" : ""}`}
                                                    style={{
                                                        padding: "8px 20px",
                                                        borderRadius: "5px",
                                                        textDecoration: "none",
                                                        color: location.pathname === sub.href ? "#fff" : "#6c757d",
                                                        backgroundColor: location.pathname === sub.href ? "#007bff" : "transparent"
                                                    }}
                                                >
                                                    {sub.title}
                                                </Link>
                                            </NavItem>
                                        </ul>
                                    ))}
                                </AccordionBody>
                            </AccordionItem>

                            {/* Menu 3 */}
                            <AccordionItem>
                                <AccordionHeader targetId="3">
                                    <i className={menu3.topMenu.icon}></i>
                                    <span className="ms-3 d-inline-block">{menu3.topMenu.title}</span>
                                </AccordionHeader>
                                <AccordionBody accordionId="3">
                                    <NavItem>
                                        <Link
                                            to={menu3.topMenu.href}
                                            className={`nav-link py-2 ${location.pathname === menu3.topMenu.href ? "active" : ""}`}
                                            style={{
                                                padding: "8px 20px",
                                                borderRadius: "5px",
                                                textDecoration: "none",
                                                color: location.pathname === menu3.topMenu.href ? "#fff" : "#6c757d",
                                                backgroundColor: location.pathname === menu3.topMenu.href ? "#007bff" : "transparent"
                                            }}
                                        >
                                            {menu3.topMenu.title}
                                        </Link>
                                    </NavItem>
                                    {menu3.subMenus.map((sub) => (
                                        <ul className="offset-1" key={sub.href}>
                                            <NavItem>
                                                <Link
                                                    to={sub.href}
                                                    className={`nav-link py-2 ${location.pathname === sub.href ? "active" : ""}`}
                                                    style={{
                                                        padding: "8px 20px",
                                                        borderRadius: "5px",
                                                        textDecoration: "none",
                                                        color: location.pathname === sub.href ? "#fff" : "#6c757d",
                                                        backgroundColor: location.pathname === sub.href ? "#007bff" : "transparent"
                                                    }}
                                                >
                                                    {sub.title}
                                                </Link>
                                            </NavItem>
                                        </ul>
                                    ))}
                                </AccordionBody>
                            </AccordionItem>

                            {/* Menu 4 */}
                            <AccordionItem>
                                <AccordionHeader targetId="4">
                                    <i className={menu4.topMenu.icon}></i>
                                    <span className="ms-3 d-inline-block">{menu4.topMenu.title}</span>
                                </AccordionHeader>
                                <AccordionBody accordionId="4">
                                    <NavItem>
                                        <Link
                                            to={menu4.topMenu.href}
                                            className={`nav-link py-2 ${location.pathname === menu4.topMenu.href ? "active" : ""}`}
                                            style={{
                                                padding: "8px 20px",
                                                borderRadius: "5px",
                                                textDecoration: "none",
                                                color: location.pathname === menu4.topMenu.href ? "#fff" : "#6c757d",
                                                backgroundColor: location.pathname === menu4.topMenu.href ? "#007bff" : "transparent"
                                            }}
                                        >
                                            {menu4.topMenu.title}
                                        </Link>
                                    </NavItem>
                                    {menu4.subMenus.map((sub) => (
                                        <ul className="offset-1" key={sub.href}>
                                            <NavItem>
                                                <Link
                                                    to={sub.href}
                                                    className={`nav-link py-2 ${location.pathname === sub.href ? "active" : ""}`}
                                                    style={{
                                                        padding: "8px 20px",
                                                        borderRadius: "5px",
                                                        textDecoration: "none",
                                                        color: location.pathname === sub.href ? "#fff" : "#6c757d",
                                                        backgroundColor: location.pathname === sub.href ? "#007bff" : "transparent"
                                                    }}
                                                >
                                                    {sub.title}
                                                </Link>
                                            </NavItem>
                                        </ul>
                                    ))}
                                </AccordionBody>
                            </AccordionItem>

                        {/* Menu 5 */}
                        <AccordionItem>
                            <AccordionHeader targetId="5">
                                <i className={menu5.topMenu.icon}></i>
                                <span className="ms-3 d-inline-block">{menu5.topMenu.title}</span>
                            </AccordionHeader>
                            <AccordionBody accordionId="5">
                                <NavItem>
                                    <Link
                                        to={menu5.topMenu.href}
                                        className={`nav-link py-2 ${location.pathname === menu5.topMenu.href ? "active" : ""}`}
                                        style={{
                                            padding: "8px 20px",
                                            borderRadius: "5px",
                                            textDecoration: "none",
                                            color: location.pathname === menu5.topMenu.href ? "#fff" : "#6c757d",
                                            backgroundColor: location.pathname === menu5.topMenu.href ? "#007bff" : "transparent"
                                        }}
                                    >
                                        {menu5.topMenu.title}
                                    </Link>
                                </NavItem>
                                {menu5.subMenus.map((sub) => (
                                    <ul className="offset-1" key={sub.href}>
                                        <NavItem>
                                            <Link
                                                to={sub.href}
                                                className={`nav-link py-2 ${location.pathname === sub.href ? "active" : ""}`}
                                                style={{
                                                    padding: "8px 20px",
                                                    borderRadius: "5px",
                                                    textDecoration: "none",
                                                    color: location.pathname === sub.href ? "#fff" : "#6c757d",
                                                    backgroundColor: location.pathname === sub.href ? "#007bff" : "transparent"
                                                }}
                                            >
                                                {sub.title}
                                            </Link>
                                        </NavItem>
                                    </ul>
                                ))}
                            </AccordionBody>
                        </AccordionItem>
                    </Accordion>
                        {/* About*/}
                        <NavItem className="sidenav-bg" key={menu6.topMenu.id}>
                            <Link
                                to={menu6.topMenu.href}
                                className={
                                    location.pathname === menu6.topMenu.href
                                        ? "active nav-link py-3"
                                        : "nav-link text-secondary py-3"}>
                                <i className={menu6.topMenu.icon}></i>
                                <span className="ms-3 d-inline-block">{menu6.topMenu.title}</span>
                            </Link>
                        </NavItem>

                        {/* Payment Button */}
                        <Button
                            color="danger"
                            tag="a"
                            target="_blank"
                            className="mt-3"
                            href="https://wrappixel.com/templates/materialpro-react-admin/?ref=33"
                        >
                            결제
                        </Button>
                    </Nav>
                ) : (
                    // 접근 제한 메시지
                    <div className="text-center mt-5">
                        <h4>접근 권한이 없습니다.</h4>
                        <p>로그인 후 이용해 주세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
