import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "../../redux/axios";

import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

import styles from "./TasksCalendar.module.scss";

import ModalWindowEvent from "../ModalWindowEvent/index";
import { useOpenModal } from "../../hooks/useOpenModal";
import { useSelector } from "react-redux";

import { selectCurrentCalendar } from "../../redux/slices/calendarSlice";

const TasksCalendar = () => {
  const [selectInfo, setSelectInfo] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [weekday, setWeekday] = useState("");
  const [holidays, setHolidays] = useState("");

  const [eventsData, setEventsData] = useState();
  const [isLoadingEvents, setLoadingEvents] = useState(true);

  const modalInfoEvent = useOpenModal(false);
  const currentCalendar = useSelector(selectCurrentCalendar);

  const calendarRef = React.createRef();

  useEffect(() => {
    setWeekday(
      `${new Date().toLocaleString("en-us", {
        weekday: "long",
      })}, ${new Date().getDate()}`
    );
    getHoliday();
  }, []);
  useEffect(() => {
    if (currentCalendar?.id) {
      console.log("isLoadingEvents 1");
      setLoadingEvents(true);
      axios
        .get(`api/calendars/${currentCalendar.id}/events`)
        .then((res) => {
          setEventsData(res.data);
          setLoadingEvents(false);
        })
        .catch((err) => {
          console.error(err);
          alert("Error");
        });
    }
  }, [currentCalendar]);

  useEffect(() => {
    if (!isLoadingEvents) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.removeAllEvents();

      eventsData.forEach((event) => {
        calendarApi.addEvent({
          id: event.id,
          title: event.title,
          description: event.description,
          start: event.start_at,
          end: event.end_at,
          backgroundColor: event.color,
          event: event.type,
        });
      });
    }
  }, [isLoadingEvents]);

  const getHoliday = async () => {
    try {
      const res = await axios.get(`/api/users/holiday`);

      if (res.data) {
        setHolidays(res.data.name);
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

  const resizeHandle = async (selectInfo) => {
    await axios.patch(`/api/events/${selectInfo.event.id}`, {
      end_at: selectInfo.event.endStr,
    });
  };

  const moveHandle = async (selectInfo) => {
    // нужно захендлить ситуацию, когда чел пытается передвинуть ивент в прошлое)

    await axios.patch(`/api/events/${selectInfo.event.id}`, {
      start_at: selectInfo.event.startStr,
      end_at: selectInfo.event.endStr,
    });
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
        eventResize={resizeHandle}
        eventDrop={moveHandle}
        ref={calendarRef}
      />
    </section>
  );
};

export default TasksCalendar;
