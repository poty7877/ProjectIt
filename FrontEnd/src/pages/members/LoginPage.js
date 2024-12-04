import LoginComponent from "../../components/member/LoginComponent";

const LoginPage = () => {
    return (
        <div className=" text-3xl">
            <div>
                <h1>이 페이지는 취업용 프로젝트 입니다.</h1>
                <h4>개발 목표 : IT 기업의 업무효율성 향상을 위한 ERP 시스템</h4>
                <h6>TEST ID : cyj@company.com </h6>
                <h6>TEST PW : test</h6>
            </div>
            <div>
                <LoginComponent/>
            </div>
        </div>
    );
};

export default LoginPage;