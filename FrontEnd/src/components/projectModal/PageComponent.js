import React from 'react';
import { Button, Row, Col } from 'reactstrap';

const PageComponent = ({ serverData, movePage }) => {
    return (
        <Row className="m-6 justify-content-center">
            {serverData?.prev ? (
                <Col xs="2" className="text-center">
                    <Button
                        className="font-weight-bold"
                        onClick={() => movePage({ page: serverData.prevPage })}
                    >
                        Prev
                    </Button>
                </Col>
            ) : null}
            {serverData?.pageNumList?.map(pageNum => (
                <Col xs="1" key={pageNum} className="text-center">
                    <Button
                        className={`w-100 rounded shadow ${serverData.current === pageNum ? 'bg-secondary' : 'bg-primary text-white'}`}
                        onClick={() => movePage({ page: pageNum })}
                    >
                        {pageNum}
                    </Button>
                </Col>
            ))}

            {serverData?.next ? (
                <Col xs="2" className="text-center">
                    <Button
                        className="font-weight-bold"
                        onClick={() => movePage({ page: serverData.nextPage })}
                    >
                        Next
                    </Button>
                </Col>
            ) : null}
        </Row>
    );
};

export default PageComponent;
