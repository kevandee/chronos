import React, { useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";

import styles from '../CalendarPicker/CalendarPicker.module.scss';

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Button } from "@mui/material";

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

const CalendarPicker = () => {

    const date = new Date();

    const defaultValue = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
    };

    const [selectedDay, setSelectedDay] = useState(defaultValue);

    const onChange = (e) => {
        setSelectedDay(e);
        console.log(`${e.year}-${e.month}-${e.day}`);

        // REQUEST TO GET EVENTS FROM CERTAIN DAY
    }

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
              <div className={styles.event} style={{ backgroundColor: '#E07A5F'}}>
                <span className={styles.taskTitle}>Task 1</span>
                <div className={styles.time}>
                    <AccessTimeIcon></AccessTimeIcon>
                    <span>12:30 - 14:15</span>
                </div>
              </div>
              <div className={styles.event} style={{ backgroundColor: 'rgba(228, 231, 36, 0.7)'}}>
                <span className={styles.taskTitle}>Task 2</span>
                <div className={styles.time}>
                    <AccessTimeIcon></AccessTimeIcon>
                    <span>12:30 - 14:15</span>
                </div>
              </div>
              <div className={styles.event} style={{ backgroundColor: 'rgba(52, 73, 94, 0.7)'}}>
                <span className={styles.taskTitle}>Task 3</span>
                <div className={styles.time}>
                    <AccessTimeIcon></AccessTimeIcon>
                    <span>12:30 - 14:15</span>
                </div>
              </div>
            </div>
            <Button variant='contained' className={styles.addBtn}>New Event</Button>
        </section>
    )
}

export default CalendarPicker;