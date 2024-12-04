import React from "react";
import { Modal, ModalBody } from "reactstrap";

const FetchingModal = ({ isOpen }) => {
    return (
        <Modal isOpen={isOpen} centered backdrop="static" fade={false}>
            <ModalBody className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <div className="text-4xl font-weight-bold text-warning">
                    Loading...
                </div>
            </ModalBody>
        </Modal>
    );
};

export default FetchingModal;
