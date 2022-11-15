import React, { useState }  from "react";
import { Modal, TextField, Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { useForm } from "react-hook-form";

import styles from './ModalWindowEvent.module.scss';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const colors = ['#54A3FF', '#FFF172', '#FF7373', '#7EFF84', '#FF89FA', '#A864FF'];

const ModalWindowEvent = ({open, handleClose, time}) => {
    const [age, setAge] = useState('');
    // const [cardColor, setCardColor] = useState('#54A3FF');
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    }

    const getTime = (date) => {
        const dateObj = new Date(date);
        let hour = dateObj.getHours();
        let minute = dateObj.getMinutes();
        if(minute < 10) {
            minute += '0';
        }

        return `${hour}:${minute}`
    }

    return(
        <Modal open={open} onClose={handleClose}>
            <Box className={styles.container}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField label={'Add title'} className={styles.textfield} {...register('title')} required />
                    <TextField 
                        label={'Add description'}
                        className={styles.textfield}
                        multiline
                        rows={6}
                        {...register('description')}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="type">Event type</InputLabel>
                        <Select
                            labelId="type"
                            id="type"
                            value={age}
                            label="Event type"
                            {...register('event', { onChange: (e) => {setAge(e.target.value);}})}
                            required
                        >
                            <MenuItem value={10}>Event</MenuItem>
                            <MenuItem value={20}>Meeting</MenuItem>
                            <MenuItem value={30}>Reminder</MenuItem>
                        </Select>
                    </FormControl>
                    <div className={styles.colors}>
                        {colors.map((el, index) => (
                            <div className={styles.inputColor} key={index} style={{ backgroundColor: el }}>
                                <input type='radio' name='cardColor' value={el} {...register('color')} required/>
                            </div>
                        ))}
                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.timeSlot}>
                            <AccessTimeIcon />
                            {time && 
                                <span>{getTime(time.startStr)} - {getTime(time.endStr)}</span>
                            }
                        </div>
                        <Button variant='contained' className={styles.saveBtn} type='submit'>Save</Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

export default ModalWindowEvent;