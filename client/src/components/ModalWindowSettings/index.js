import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
    Modal,
    TextField,
    Box,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Button,
    IconButton,
    Avatar,
    Radio,
    Popover
} from "@mui/material";

import styles from './ModalWindowSettings.module.scss';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { selectCurrentCalendar } from "../../redux/slices/calendarSlice";

const users = [
    {username: 'daripon'},
    {username: 'yarslvd'},
    {username: 'jshow'},
    {username: 'sanches'},
    {username: 'achaika'}
]

const ModalWindowSettings= ({ open, handleClose, isEdit }) => {
    const [title, setTitle] = useState("");
    const currentCalendar = useSelector(selectCurrentCalendar);
    const [anchorEl, setAnchorEl] = useState(null);
    
    const { register, handleSubmit, control } = useForm();

    useEffect(() => {
        setTitle(currentCalendar.title);
    }, [open]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMore = () => {
        setAnchorEl(null);
    };

    const handleRoleChange = (values) => {
        console.log(values);
    }
    
    const openMore = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className={styles.container}>
                <h1 className={styles.heading}>Calendar Settings</h1>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.mainForm}>
                    <TextField
                        label={"Add title"}
                        value={title}
                        className={styles.calendarTitle}
                        {...register("title", {
                        onChange: (e) => {
                            setTitle(e.target.value);
                        },
                        })}
                        required
                    />
                    <div className={styles.users}>
                        <div className={`${styles.userInfo} ${styles.yourInfo}`}>
                            <Avatar alt="Unknown User" />
                            <span>You</span>
                        </div>
                        {users.map((el, index) => {
                            return <div className={styles.user} key={index}>
                                <div className={styles.userInfo}>
                                    <Avatar alt="Unknown User" />
                                    <span>{el.username}</span>
                                </div>
                                <IconButton aria-label="More" onClick={handleClick}><MoreVertIcon/></IconButton>

                                <Popover
                                id={id}
                                open={openMore}
                                anchorEl={anchorEl}
                                onClose={handleCloseMore}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                style={{ boxShadow: '0' }}
                                className={styles.popOver}
                                >
                                    <FormControl>
                                        <Controller
                                        rules={{ required: true }}
                                        control={control}
                                        name="promoting2"
                                        render={({ field }) => {
                                            return(
                                                <RadioGroup
                                                aria-labelledby="radiobuttons-permissions"
                                                defaultValue="user"
                                                name="radio-buttons-group"
                                                sx={{ padding: '10px' }}
                                            >

                                                <FormControlLabel
                                                value="admin"
                                                control={<Radio size="small" />}
                                                label="Admin"
                                                onChange={(e) => console.log(e.target.defaultValue)}
                                                />
                                                <FormControlLabel value="user" control={<Radio size="small" />} label="User" />

                                                <Button variant="contained">Remove</Button>
                                            </RadioGroup>
                                            );
                                        }}
                                        />
                                    </FormControl>
                                </Popover>
                                {/* <FormControl>
                                <RadioGroup
                                    aria-labelledby="radiobuttons-permissions"
                                    defaultValue="user"
                                    name="radio-buttons-group"
                                    sx={{ display: 'flex', flexDirection: 'row' }}
                                >
                                    <FormControlLabel value="admin" control={<Radio size="small" />} label="Admin" className={styles.label}/>
                                    <FormControlLabel value="user" control={<Radio size="small" />} label="User" />
                                </RadioGroup>
                                </FormControl> */}
                            </div>
                        })}
                    </div>
                    <div className={styles.inviteUser}>
                        <TextField
                            label={"Invite User"}
                            className={styles.userInput}
                            {...register("user")}
                            required
                        />
                        <IconButton aria-label="Add user"><PersonAddAlt1Icon/></IconButton>
                    </div>
                    <div className={styles.buttons}>
                        <Button variant='outlined'>Delete Calendar</Button>
                        <Button variant='contained'>Save</Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

export default ModalWindowSettings;