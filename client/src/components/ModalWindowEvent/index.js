import React from "react";
import { Modal, TextField, Box } from '@mui/material';

import styles from './ModalWindowEvent.module.scss';

const ModalWindowEvent = ({open}) => {
    return(
        <Modal open={open}>
            <Box  className={styles.container}>
                <TextField label={'Adicionar título'} fullWidth />
            </Box>
        </Modal>
    );
}

export default ModalWindowEvent;