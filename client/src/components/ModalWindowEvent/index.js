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
import axios from "../../redux/axios";

import styles from "./ModalWindowEvent.module.scss";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import { selectCurrentCalendar } from "../../redux/slices/calendarSlice";
import { useDispatch, useSelector } from "react-redux";

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
  const [color, setColor] = useState('#54A3FF');

  const { register, handleSubmit } = useForm();

  const currentCalendar = useSelector(selectCurrentCalendar);

  useEffect(() => {
    if (isEdit) {
      setTitle(selectInfo?.event?.title);
      setDescription(selectInfo?.event?._def.extendedProps.description);
      setEventType(selectInfo?.event?._def.extendedProps.event);
      setColor(selectInfo.event?.backgroundColor);
    } else {
      setTitle("");
      setDescription("");
      setColor("#54A3FF");
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
      const calendarApi = selectInfo.view.calendar;

      const resData = {
        title: data.title,
        description: data.description,
        start_at: selectInfo.startStr,
        end_at: selectInfo.endStr,
        color: data.color,
        type: data.event,
      };
      console.log("current calendar", currentCalendar);
      //Add here axios to db
      const res = await axios.post(
        `/api/calendars/${currentCalendar.id}/events`,
        resData
      );

      calendarApi.addEvent({
        id: res.data.id,
        title: data.title,
        description: data.description,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        backgroundColor: data.color,
        event: data.event,
      });

      // dispatch(setCurrentCalendar({...(currentCalendar), events: [...currentCalendar.events, res.data]}));
      handleClose();
      setEventType("");
    } catch (err) {
      console.log(err);
    }
  };

  const editEvent = async (data) => {
    try {
      setTitle(selectInfo?.event?.title);
      setEventType(selectInfo?.event?._def.extendedProps.event);

      const calendarApi = selectInfo.view.calendar;
      //Update db with axios
      const resData = {
        title: data.title === "" ? title : data.title,
        description: data.description === "" ? description : data.description,
        color: color,
        type: data.event === "" ? eventType : data.event,
      };

      await axios.patch(`/api/events/${selectInfo.event.id}`, resData);

      const currentEvent = calendarApi.getEventById(selectInfo.event.id);

      if (currentEvent) {
        console.log(currentEvent._def.title);
        currentEvent.setProp("title", resData.title);
        currentEvent.setExtendedProp("description", resData.description);
        currentEvent.setExtendedProp("eventType", resData.event);
        currentEvent.setProp("backgroundColor", resData.color);
      }

      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteEvent = async () => {
    try {
      //delete from db
      await axios.delete(`/api/events/${selectInfo.event.id}`);
      selectInfo.event.remove();
      setTitle("");
      setDescription("");

      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

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
              <MenuItem value={"task"}>Event</MenuItem>
              <MenuItem value={"meeting"}>Meeting</MenuItem>
              <MenuItem value={"reminder"}>Reminder</MenuItem>
            </Select>
          </FormControl>
          <div className={styles.colors}>
            {colors.map((el, index) => (
              <div
                className={styles.inputColor}
                key={index}
                selected={false}
                style={{ backgroundColor: el }}
                onClick={() => { setColor(el); }}
              >
                <input
                  type="radio"
                  name="cardColor"
                  value={el}
                  {...register("color")}
                  required
                  checked={el === color}
                />
              </div>
            ))}
          </div>
          <div className={styles.bottom}>
            <div className={styles.timeSlot}>
              <AccessTimeIcon />
              {selectInfo && (
                <span>
                  {getTime(
                    isEdit ? selectInfo.event.startStr : selectInfo.startStr
                  )}{" "}
                  -{" "}
                  {getTime(
                    isEdit ? selectInfo.event.endStr : selectInfo.endStr
                  )}
                </span>
              )}
            </div>
            {isEdit && (
              <IconButton onClick={deleteEvent}>
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

export default ModalWindowEvent;
