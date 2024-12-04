import {lazy} from "react";
import {Navigate} from "react-router-dom";
import Starter from "../views/Starter";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Project = lazy(() => import("../pages/project/ProjectList"));
const ProjectDeletedList = lazy(() => import("../pages/project/ProjectDeletedList"));
const ProjectRegister = lazy(() => import("../pages/project/ProjectRegister"))
const ProjectRead = lazy(() => import("../pages/project/ProjectRead"));
const ProjectModify = lazy(() => import("../pages/project/ProjectModify"));
const ProjectMember = lazy(() => import("../pages/project/ProjectMember"));
const ProjectCalendar = lazy(() => import("../pages/project/ProjectCalendar"));
const ProjectMyList = lazy(() => import("../pages/project/ProjectMyList"));
const ProjectIssueList = lazy(() => import("../pages/project/ProjectIssueList"));
const ProjectIssueDetailList = lazy(() => import("../pages/project/ProjectIssueDetailList"));
const ProjectIssueRegister = lazy(() => import("../pages/project/ProjectIssueRegister"));
const ProjectIssueRead = lazy(() => import("../pages/project/ProjectIssueRead"));
const ProjectIssueModify = lazy(() => import("../pages/project/ProjectIssueModify"));
const ProjectIssueMyList = lazy(() => import("../pages/project/ProjectIssueMyList"));
const ProjectIssueNullList = lazy(() => import("../pages/project/ProjectIssueNullList"));
const ProjectMemberList = lazy(() => import("../pages/project/ProjectMemberList"));
const ProjectEventMyList = lazy(() => import("../pages/project/ProjectEventMyList"));

const ProjectPartnerRegister = lazy(() => import("../pages/project/ProjectPartnerRegister"));
const ProjectPartnerUpdate = lazy(() => import("../pages/project/ProjectPartnerUpdate"));

const PartnersList = lazy(() => import("../pages/partners/PartnersList"));
const PartnerRead = lazy(() => import("../pages/partners/PartnerRead"));
const PartnersModify = lazy(() => import("../pages/partners/PartnersModify"));
const PartnersRegister = lazy(() => import("../pages/partners/PartnersRegister"));

const DocumentRequestList = lazy(() => import("../pages/document/DocumentRequestList"));
const DocumentRejectedList = lazy(() => import("../pages/document/DocumentRejectedList"));
const DocumentApprovedList = lazy(() => import("../pages/document/DocumentApprovedList"));
const DocumentApproverList = lazy(() => import("../pages/document/DocumentApproverList"));
const DocumentWriterList = lazy(() => import("../pages/document/DocumentWriterList"));
const DocumentRegister = lazy(() => import("../pages/document/DocumentRegister"));
const DocumentRead = lazy(() => import("../pages/document/DocumentRead"));

const MemberLogin = lazy(() => import("../pages/members/LoginPage.js"))
const MemberRegister = lazy(()=> import("../pages/members/RegisterPage.js"))
const MemberModify = lazy(()=> import("../pages/members/ModifyPage.js"))
const OrganizationPage = lazy(() => import("../pages/personnel/Organization/OrganizationPage.js"))
const ApplicationPage = lazy(() => import("../pages/personnel/Organization/AplicataionPage.js"))
const VacationApplicationPage = lazy(() => import("../pages/personnel/Vacation/VacationApplicationPage.js"))
const VacationAcceptionPage = lazy(() => import("../pages/personnel/Vacation/VacationAcceptionPage.js"))

const Licenselist = lazy(() => import("../pages/distribution/LicenseAssetList"));
const LicenseInfoRegister = lazy(() => import("../pages/distribution/LicenseInfoAdd"));
const LicenseAssetAdd = lazy(() => import("../pages/distribution/LicenseAssetAdd"));
const LicenseInfoList = lazy(() => import("../components/distrbution/LicenseInfoListComponent"));
const LicenseAssetView = lazy(() => import("../pages/distribution/LicenseAssetView"));
const LicenseAssetReContract = lazy(()=>import("../pages/distribution/LicenseAssetReContract"));
const FileList = lazy(()=>import("../pages/distribution/FileList"));
const AccountList = lazy(()=>import("../pages/distribution/AccountList"));
const AccountAdd = lazy(()=>import("../pages/distribution/AccountAdd"));
const AccountRead = lazy(()=>import("../pages/distribution/AccountRead"));
const About =  lazy(()=>import("../pages/About"));
const ChatRoom = lazy(() => import("../pages/chatRoom/ChatRoom"));

/*****Routes******/

const ThemeRoutes = [
    {
        path: "/",
        element: <FullLayout/>,
        children: [
            {path: "/project", exact: true, element: <Project/>},
            {path: "/project/add", exact: true, element: <ProjectRegister/>},
            {path: "/project/:pno", exact: true, element: <ProjectRead/>},
            {path: "/project/modify/:pno", exact: true, element: <ProjectModify/>},
            {path: "/pmember/:pno", exact: true, element: <ProjectMember/>},
            {path: "/project/deleted", exact: true, element: <ProjectDeletedList/>},
            {path: "/project/list/:mno", exact: true, element: <ProjectMyList/>},
            {path: "/project/issue", exact: true, element: <ProjectIssueList/>},
            {path: "/project/issue/:pno", exact: true, element: <ProjectIssueDetailList/>},
            {path: "/project/issue/add/:pno", exact: true, element: <ProjectIssueRegister/>},
            {path: "/project/issue/read/:ino", exact: true, element: <ProjectIssueRead/>},
            {path: "/project/issue/modify/:ino", exact: true, element: <ProjectIssueModify/>},
            {path: "/project/issue/mylist/:mno", exact: true, element: <ProjectIssueMyList/>},
            {path: "/project/issue/nullList/:pno", exact: true, element: <ProjectIssueNullList/>},
            {path: "/project/event/:mno", exact: true, element: <ProjectEventMyList/>},

            {path: "/project/partner/:pno", exact: true, element: <ProjectPartnerRegister/>},
            {path: "/project/partner/update/:pno", exact: true, element: <ProjectPartnerUpdate/>},

            {path: "/document/requested/list", exact: true, element: <DocumentRequestList/>},
            {path: "/document/rejected/list", exact: true, element: <DocumentRejectedList/>},
            {path: "/document/approved/list", exact: true, element: <DocumentApprovedList/>},
            {path: "/document/approver/list/:mno", exact: true, element: <DocumentApproverList/>},
            {path: "/document/writer/list/:writer", exact: true, element: <DocumentWriterList/>},
            {path: "/document/add", exact: true, element: <DocumentRegister/>},
            {path: "/document/:dno", exact: true, element: <DocumentRead/>},

            {path: "/partners", exact: true, element: <PartnersList/>},
            {path: "/partners/:cno", exact: true, element: <PartnerRead/>},
            {path: "/partners/modify/:cno", exact: true, element: <PartnersModify/>},
            {path: "/partners/register", exact: true, element: <PartnersRegister/>},

            { path:"/application", element: <ApplicationPage/>},
            { path:"/login", element: <MemberLogin/>},
            // { path:"/register", element: <MemberRegister/>},
            { path:"/modify", element: <MemberModify/>},
            { path: "/starter", exact: true, element: <Starter /> },
            { path: "/org", element: <OrganizationPage /> },
            { path: "/vac-app", element: <VacationApplicationPage /> },
            { path: "/vac-acc", element: <VacationAcceptionPage /> },


            {path: "/dist/licenses", exact: true, element: <Licenselist/>},
            {path: "/dist/licenses/request", exact: true, element: <LicenseAssetAdd/>},
            {path: "/dist/licenses/register", exact: true, element: <LicenseInfoRegister/>},
            {path: "/dist/licenses/list", exact: true, element: <LicenseInfoList/>},
            {path: "/dist/licenses/:ano", exact: true, element: <LicenseAssetView/>},
            { path: "/dist/licenses/recontract", exact: true, element:<LicenseAssetReContract/>},
            { path: "/dist/accountlist", exact: true, element:<AccountList/>},
            { path: "/dist/account/request", exact: true, element:<AccountAdd/>},
            { path: "/dist/account/:siNum", exact: true, element:<AccountRead/>},
            {path: "/dist/filelist", exact: true, element:<FileList/>},
            { path: "/about", exact: true, element:<About/>},
            {path: "/", element: <Navigate to="/login"/>},
        ],
    },
    {path: "/chatroom/:pno", exact: true, element: <ChatRoom/>},
    {path: "/calendar/:pno", exact: true, element: <ProjectCalendar/>},
    {path: "/project/member/:pno", exact: true, element: <ProjectMemberList/>},
    {path: "/partners/register/blank", exact: true, element: <PartnersRegister/>},
];

export default ThemeRoutes;
