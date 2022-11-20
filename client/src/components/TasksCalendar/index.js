import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
//import styled from "@emotion/styled";

import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

import styles from "./TasksCalendar.module.scss";

import ModalWindowEvent from "../ModalWindowEvent/index";
import { useOpenModal } from "../../hooks/useOpenModal";

const TasksCalendar = () => {
  const [selectInfo, setSelectInfo] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [weekday, setWeekday] = useState("");
  const [holidays, setHolidays] = useState("");

  const modalInfoEvent = useOpenModal(false);

  useEffect(() => {
    setWeekday(
      `${new Date().toLocaleString("en-us", {
        weekday: "long",
      })}, ${new Date().getDate()}`
    );
    getHoliday();
  }, []);

  const getHoliday = async () => {
    try {
      const api_key = "0d9204c93586457bbfd20b22c0631788";
      let country = "UA";
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      const res = await axios.get(`https://holidays.abstractapi.com/v1/?api_key=${api_key}&country=${country}&year=${year}&month=${month + 1}&day=${day}`);

      if(res.data[0]) {
        setHolidays(res.data[0].name);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const selectHandle = (selectInfo) => {
    setIsEdit(false);
    setSelectInfo(selectInfo);
    modalInfoEvent.handleOpen();
  };

  const editHandle = (selectInfo) => {
    setIsEdit(true);
    setSelectInfo(selectInfo);
    console.log(selectInfo);
    modalInfoEvent.handleOpen();
  };

  return (
    <section className={styles.events_container}>
      <ModalWindowEvent
        open={modalInfoEvent.isOpen}
        handleClose={modalInfoEvent.handleClose}
        selectInfo={selectInfo}
        isEdit={isEdit}
      />
      <div className={styles.heading}>
        <span className={styles.date}>{weekday}</span>
        {holidays && <span className={styles.holiday}>{holidays}</span>}
      </div>
      {/* <StyleWrapper> */}
      <FullCalendar
        editable={true}
        selectable={true}
        allDaySlot={false}
        dayMaxEvents={true}
        nowIndicator={true}
        slotEventOverlap={false}
        headerToolbar={{
          start: "",
          end: "",
        }}
        plugins={[daygridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="timeGridDay"
        slotDuration={"00:15"}
        slotLabelInterval={"01:00"}
        height={"90%"}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }}
        scrollTime={moment().subtract("200", "minutes").format("HH:mm:ss")}
        select={selectHandle}
        eventClick={editHandle}
      />
      {/* </StyleWrapper> */}
    </section>
  );
};

export default TasksCalendar;
