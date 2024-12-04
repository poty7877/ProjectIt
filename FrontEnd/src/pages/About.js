import { Row, Col, Card, CardBody, CardTitle, Button, Table } from "reactstrap";
import user1 from "../assets/images/users/user1.jpg";
import user4 from "../assets/images/users/user4.jpg";
import user5 from "../assets/images/users/user5.jpg";
import { Link } from "react-router-dom";


const tableData = [
    {
        avatar: user1,
        name: "김지선",
        gitHub: "https://github.com/jsKim-prog",
        project: "자원관리",
    },
    {
        avatar: user4,
        name: "조용재",
        gitHub: "https://github.com/hopepu",
        project: "인사관리",
    },
    {
        avatar: user5,
        name: "용상엽",
        gitHub: "https://github.com/poty7877",
        project: "생산관리",
    },

];

const About = () => {
    return (
        <Row>
            <Col>
                {/* --------------------------------------------------------------------------------*/}
                {/* Card-1*/}
                {/* --------------------------------------------------------------------------------*/}
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-bell me-2"> </i>
                        About Project IT
                    </CardTitle>
                    <CardBody className="p-4">
                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                <th>Team Lead</th>
                                <th>Project</th>

                                <th>gitHub</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.map((tdata, index) => (
                                <tr key={index} className="border-top">
                                    <td>
                                        <div className="d-flex align-items-center p-2">
                                            <img
                                                src={tdata.avatar}
                                                className="rounded-circle"
                                                alt="avatar"
                                                width="45"
                                                height="45"
                                            />
                                            <div className="ms-3">
                                                <h6 className="mb-0">{tdata.name}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{tdata.project}</td>
                                    <td><Link to={tdata.gitHub} target="_blank">{tdata.gitHub}</Link></td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default About;
