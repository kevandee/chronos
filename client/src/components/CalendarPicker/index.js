import React, { useEffect, useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";

import styles from '../CalendarPicker/CalendarPicker.module.scss';

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Button } from "@mui/material";
import { selectCurrentCalendar, setCurrentCalendar } from "../../redux/slices/calendarSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../redux/axios";

const myCustomLocale = {
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
      
    weekDays: [
        {
        name: 'Monday',
        short: 'M',
        },
        {
        name: 'Tuesday',
        short: 'T',
        },
        {
        name: 'Wednesday',
        short: 'W',
        },
        {
        name: 'Thursday',
        short: 'T',
        },
        {
        name: 'Friday',
        short: 'F',
        },
        {
        name: 'Saturday',
        short: 'S',
        isWeekend: true,
        },
        {
        name: 'Sunday', 
        short: 'S',
        isWeekend: true,
        },
    ],
    
    weekStartingIndex: 6,
    
    getToday(gregorainTodayObject) {
        return gregorainTodayObject;
    },
    
    toNativeDate(date) {
        return new Date(date.year, date.month - 1, date.day);
    },
    
    getMonthLength(date) {
        return new Date(date.year, date.month, 0).getDate();
    },
    
    transformDigit(digit) {
        return digit;
    },
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

const CalendarPicker = () => {
    const dispatch = useDispatch();
    const currentCalendar = useSelector(selectCurrentCalendar);
    const date = new Date();
    
    const [closeEvents, setCloseEvents] = useState([]);

    const defaultValue = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
    };

    const [selectedDay, setSelectedDay] = useState(defaultValue);

    const onChange = async (e) => {
        setSelectedDay(e);
        const date = new Date(Date.parse(`${e.year}-${e.month}-${e.day}`));

        // REQUEST TO GET EVENTS FROM CERTAIN DAY
        let res = await axios.get(`/api/calendars/${currentCalendar.id}/events?date=${date.toISOString()}`).catch((err) => {
            console.error(err);
            alert("Error");
          });;
        console.log(res.data);
        dispatch(setCurrentCalendar({...(currentCalendar), events: res.data, day: date}));
    }

    useEffect(() => {
        if (currentCalendar.id) {
            const date = new Date();
            axios.get(`/api/calendars/${currentCalendar.id}/events?date=${date.toISOString()}&limit=5`)
            .then((res) => {
                setCloseEvents(res.data);
            })
            .catch((err) => {
                console.error(err);
                alert("Error");
            });
        }
    }, [currentCalendar.id, currentCalendar.events]);

    return(
        <section className={styles.calendarPicker}>
            <Calendar
            value={selectedDay}
            onChange={onChange}
            locale={myCustomLocale}
            colorPrimary="#E07A5F"
            calendarClassName={styles.customCalendar}
            customDaysClassName={[
                // here we add some CSS classes
                { year: 2022, month: 11, day: 4, className: styles.purpleDay },
              ]}
            />

            <div className={styles.closeEvents}>
                {closeEvents.map(event => 
                <div key={"key -" + event.id} className={styles.event} style={{ backgroundColor: event.color}}>
                    <span className={styles.taskTitle}>{event.title}</span>
                    <div className={styles.time}>
                        <AccessTimeIcon></AccessTimeIcon>
                        <span>{getTime(event.start_at)} - {getTime(event.end_at)}</span>
                    </div>
                </div>
                )}
            </div>
            <Button variant='contained' className={styles.addBtn}>New Event</Button>
        </section>
    )
}

export default CalendarPicker;