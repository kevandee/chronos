import React, { useState }  from "react";
import { Modal, TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import styles from './ModalWindowEvent.module.scss';

const colors = ['#54A3FF', '#FFF172', '#FF7373', '#7EFF84', '#FF89FA', '#A864FF'];

const ModalWindowEvent = ({open, handleClose}) => {
    const [age, setAge] = useState('');
    const [cardColor, setCardColor] = useState('#54A3FF');    

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return(
        <Modal open={open} onClose={handleClose}>
            <Box className={styles.container}>
                <form>
                    <div className={styles.text}>
                        <TextField label={'Add title'} className={styles.textfield}/>
                        <TextField 
                            label={'Add description'}
                            className={styles.textfield}
                            multiline
                            rows={6} 
                        />
                        <FormControl fullWidth>
                            <InputLabel id="type">Event type</InputLabel>
                            <Select
                                labelId="type"
                                id="typr"
                                value={age}
                                label="Event type"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>Event</MenuItem>
                                <MenuItem value={20}>Meeting</MenuItem>
                                <MenuItem value={30}>Reminder</MenuItem>
                            </Select>
                        </FormControl>
                        <div className={styles.colors}>
                            {colors.map((el, index) => {
                                <div className={styles.inputColor}>
                                    <input type='radio' name='cardColor' checked={el === cardColor} />
                                </div>
                            })}
                        </div>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

export default ModalWindowEvent;