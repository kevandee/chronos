import React from "react";
import axios from "../../redux/axios";
import { Container } from "@mui/material";

import SideBarMenu from "../../components/SideBarMenu/index";
import TasksCalendar from "../../components/TasksCalendar";
import {
  fetchCalendars,
  setCurrentCalendar,
} from "../../redux/slices/calendarSlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Main = () => {
  const dispatch = useDispatch();
  const { calendars } = useSelector((state) => state.calendars);
  const { userInfo } = useSelector((state) => state.auth);
  // const isCalendarsLoading = calendars.status === 'loading';
  // console.log("main", calendars);
  const getGeolocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      await axios.post("/api/users/location", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  useEffect(() => {
    dispatch(fetchCalendars());
    getGeolocation();
  }, []);

  useEffect(() => {
    if (calendars.items && calendars.items.length && userInfo) {
      dispatch(
        setCurrentCalendar(
          calendars.items.find(
            (calendar) => calendar.id == userInfo.default_calendar_id
          )
        )
      );
    }
  }, [calendars.status, userInfo]);

  return (
    <main>
      <Container
        maxWidth="xl"
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 4fr 2fr",
          gap: "20px",
        }}
      >
        <SideBarMenu />
        <TasksCalendar />
      </Container>
    </main>
  );
};

export default Main;
