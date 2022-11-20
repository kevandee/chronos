import React, { useState, useEffect } from "react";
import {
  Modal,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";

import styles from "./ModalWindowEvent.module.scss";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from '@mui/icons-material/Delete';

const colors = [
  "#54A3FF",
  "#FFF172",
  "#FF7373",
  "#7EFF84",
  "#FF89FA",
  "#A864FF",
];

const ModalWindowEvent = ({ open, handleClose, selectInfo, isEdit }) => {
  const [eventType, setEventType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(0);

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (isEdit) {
      setTitle(selectInfo?.event?.title);
      setDescription(selectInfo?.event?._def.extendedProps.description);
      setEventType(selectInfo?.event?._def.extendedProps.event);
      setColor(selectInfo?.event?._def.backgroundColor);
    } else {
      setTitle("");
      setDescription("");
      setColor(0);
    }
  }, [selectInfo, isEdit]);

  const onSubmit = (data) => {
    if (!isEdit) {
      addEvent(data);
    } else {
      editEvent(data);
    }
  };

  const addEvent = async (data) => {
    try {
      setTitle("");
      setEventType("");
      setColor(0);
      
      const calendarApi = selectInfo.view.calendar;

      //Add here axios to db

      calendarApi.addEvent({
        id: 1,
        title: data.title,
        description: data.description,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        backgroundColor: data.color,
        event: data.event
      });

      handleClose();
      //reset({ title: "", event: "" });
      setEventType("");
    } catch (err) {
      console.log(err);
    }
  };

  const editEvent = async (data) => {
    try {
      setTitle(selectInfo?.event?.title);
      setEventType(selectInfo?.event?._def.extendedProps.event);
      //setColor(colors.indexOf(selectInfo?.event?._def.backgroundColor));

      const calendarApi = selectInfo.view.calendar;
      //Update db with axios

      const currentEvent = calendarApi.getEventById(selectInfo.event.id);

      if (currentEvent) {
        console.log(currentEvent._def.title);
        currentEvent.setProp("title", data.title === '' ? title : data.title);
        currentEvent.setExtendedProp("description", data.description === '' ? description : data.description);
        currentEvent.setExtendedProp("eventType", data.event === '' ? eventType : data.event);
        currentEvent.setProp("backgroundColor", data.color);
      }

      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteEvent = () => {
    try{
        //delete from db

        selectInfo.event.remove();
        setTitle('');
        setDescription('');

        handleClose();
    }
    catch(err) {
        console.log(err);
    }
  }

  const getTime = (date) => {
    const dateObj = new Date(date);
    let hour = dateObj.getHours();
    let minute = dateObj.getMinutes();
    if (minute < 10) {
      minute += "0";
    }
    return `${hour}:${minute}`;
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.container}>
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
          <TextField
            label={"Add description"}
            className={styles.textfield}
            multiline
            value={description}
            rows={6}
            {...register("description", {
              onChange: (e) => {
                setDescription(e.target.value);
              },
            })}
          />
          <FormControl fullWidth>
            <InputLabel id="type">Event type</InputLabel>
            <Select
              labelId="type"
              id="type"
              value={eventType}
              label="Event type"
              {...register("event", {
                onChange: (e) => {
                  setEventType(e.target.value);
                },
              })}
              required
            >
              <MenuItem value={10}>Event</MenuItem>
              <MenuItem value={20}>Meeting</MenuItem>
              <MenuItem value={30}>Reminder</MenuItem>
            </Select>
          </FormControl>
          <div className={styles.colors}>
            {colors.map((el, index) => (
              <div
                className={styles.inputColor}
                key={index}
                style={{ backgroundColor: el }}
              >
                <input
                  type="radio"
                  name="cardColor"
                  value={el}
                  {...register("color", {
                    onChange: (e) => {
                      setColor(colors.indexOf(e.target.value));
                    }
                  })}
                  required
                  defaultChecked={isEdit ? index === color : index === 0}
                />
              </div>
            ))}
          </div>
          <div className={styles.bottom}>
            <div className={styles.timeSlot}>
              <AccessTimeIcon />
              {selectInfo && (
                <span>
                  {getTime(isEdit ? selectInfo.event.startStr : selectInfo.startStr)} - {getTime(isEdit ? selectInfo.event.endStr : selectInfo.endStr)}
                </span>
              )}
            </div>
            {isEdit && (
                <IconButton onClick={deleteEvent}><DeleteIcon sx={{ color: '#ff674f'}}/></IconButton>
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

export default ModalWindowEvent;
