// ResultModal.js
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function ResultModal({ isOpen, content, callbackFn }) {
    return (
        <Modal isOpen={isOpen} toggle={callbackFn}>
            <ModalHeader toggle={callbackFn}>알림</ModalHeader>
            <ModalBody>
                {content}
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={callbackFn}>
                    닫기
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default ResultModal;
