import { useState } from "react";
import { Card, CardTitle, Col, Row, Table } from "reactstrap";
import useCustomLogin from "../../hooks/useCustomLogin";
import {getCookie} from "../../util/cookieUtil";
import {statusRead} from "../../api/memberApi";
import useCustomLink from "../../hooks/useCustomLink";

const initState = {
    email: '',
    pw: ''
};

const LoginComponent = () => {

    const [loginParam, setLoginParam] = useState({...initState});

    const { doLogin, moveToPath,} = useCustomLogin();
    const { moveToMain } = useCustomLink();

    const handleChange = (e) => {
        setLoginParam(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleClickLogin = (e) => {
        doLogin(loginParam) // 비동기 로그인 호출
            .then(data => {
                console.log("after unwrap.....");
                // Optional Chaining 사용하여 data와 error가 정의되어 있을 때만 접근
                if (data?.error) {
                    alert("이메일과 패스워드를 다시 확인하세요.");
                } else {
                    alert("로그인 성공");
                    const token = getCookie('member');
                    statusRead(token.mno).then(data => {
                        if(data.name){
                            moveToPath('/modify');
                        } else {
                            moveToMain();
                        }
                    })
                }
            })
            .catch(err => {
                alert("로그인 중 오류가 발생했습니다.");
                console.error(err);
            });
    };

    return (
        <Row>
            <Col lg="12">
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        로그인 페이지 입니다.
                    </CardTitle>
                    <Table striped align="center" size="100px"  style={{textAlign: "center", width:"80%"}}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>
                                <input
                                    type="text"
                                    name="email"
                                    value={loginParam.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                />
                            </th>
                        </tr>

                        <tr>
                            <th>Password</th>
                            <td>
                                <input
                                    type="password"
                                    name="pw"
                                    value={loginParam.pw}
                                    onChange={handleChange}
                                    placeholder="password"
                                />
                            </td>
                        </tr>

                        <tr>
                            <th colSpan={2}>
                                <button onClick={handleClickLogin}>로그인</button>
                            </th>
                        </tr>
                        </thead>
                    </Table>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginComponent;
