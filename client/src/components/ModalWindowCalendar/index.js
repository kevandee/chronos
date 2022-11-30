import React, { useState } from "react";
import { Modal, TextField, Box, Button, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "../../redux/axios";

import styles from "./ModalWindowCalendar.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { setCalendars } from "../../redux/slices/calendarSlice";
import { useDispatch, useSelector } from "react-redux";

const ModalWindowCalendar = ({ open, handleClose, isEdit }) => {
  const [title, setTitle] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const calendars = useSelector((state) => state.calendars.calendars);

  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    addCalendar(data);
  };

  const addCalendar = async (data) => {
    try {
      setTitle("");

      const resData = {
        title: data.title,
        members: [{ id: userInfo?.id }],
      };
      console.log("new calendar", resData);

      const res = await axios.post(`/api/calendars/`, resData);

      dispatch(setCalendars([...calendars.items, res.data]));

      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.container}>
        <h1 className={styles.heading}>New Calendar</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label={"Add title"}
            value={title}
            className={styles.textfield}
            {...register("title", {
              onChange: (e) => {
                setTitle(e.target.value);
              },
            })}
            required
          />

          <div className={styles.bottom}>
            {isEdit && (
              <IconButton>
                <DeleteIcon sx={{ color: "#ff674f" }} />
              </IconButton>
            )}
            <Button
              variant="contained"
              className={styles.saveBtn}
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalWindowCalendar;
