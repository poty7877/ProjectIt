

//menu data
//menu1
import {getCookie} from "../util/cookieUtil";


//menu2
const menu2_topMenu = {
  title: "프로젝트 관리",
  href: "/project",
  icon: "bi bi-card-text",
  role: ""
}

const menu2_sub1 = {
  title: "이슈 관리",
  href: "/project/issue",
  role: ""
}

const token = getCookie("member");
console.log(token)
const menu2_sub2 = {
  title: "내 일정",
  href: `/project/event/${token?.mno}`,
  role: ""
}

//menu3
const menu3_topMenu = {
  title: "인사관리",
  href: "/org",
  icon: "bi bi-people",
  role: ""
}

const menu3_sub1 = {
  title: "사원관리",
  href: "/org",
  role: ""
}

const menu3_sub2 = {
  title: "입사지원서 관리",
  href: "/application",
  role: ""
}

//menu4
const menu4_topMenu = {
  title: "자원관리",
  href: "/buttons",
  icon: "bi bi-hdd-stack",
  role: ""
}
const menu4_sub1 = {
  title: "자원사용신청(문서함)",
  href: "/document/requested/list",
  role: ""
}

const menu4_sub2 = {
  title: "하드웨어 관리(구현중)",
  href: "/",
  role: ""
}
const menu4_sub3 = {
  title: "라이선스 관리",
  href: "/dist/licenses",
  role: ""
}

const menu4_sub4 = {
  title: "고객사 관리",
  href: "/partners",
  role: ""
}


//menu5
const menu5_topMenu = {
  title: "자원리스트",
  href: "/",
  icon: "bi bi-card-text",
  role: "",
  id: "5_0"
}

const menu5_sub1 = {
  title: "파일리스트",
  href: "/dist/filelist",
  role: "",
  id: "5_1"
}

const menu5_sub2 = {
  title: "계정리스트",
  href: "/dist/accountlist",
  role: "",
  id: "5_2"
}

const menu6_topMenu = {
  title: "About",
  href: "/about",
  icon: "bi bi-people",
  role: "",
  id: "6_0"
}



export const PageInfo = () => {



  const menu2 = {
    topMenu: menu2_topMenu,
    subMenus: [menu2_sub1, menu2_sub2]
  }

  const menu3 = {
    topMenu: menu3_topMenu,
    subMenus: [menu3_sub1, menu3_sub2]
  }

  const menu4 = {
    topMenu: menu4_topMenu,
    subMenus: [menu4_sub1, menu4_sub2, menu4_sub3, menu4_sub4]
  }

  const menu5 = {
    topMenu: menu5_topMenu,
    subMenus: [menu5_sub1, menu5_sub2]
  }

  const menu6 = {
    topMenu: menu6_topMenu,
    subMenus: ""
  }
  return { menu2, menu3, menu4, menu5,menu6  };



}

export default PageInfo;