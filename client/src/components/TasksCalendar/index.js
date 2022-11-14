import React, { useState } from "react";

import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from '@fullcalendar/timegrid';

import styles from './TasksCalendar.module.scss';

import ModalWindowEvent from "../ModalWindowEvent/index";

const TasksCalendar = () => {
    const [selectInfo, setSelectInfo] = useState();
    const [isOpen, setIsOpen] = useState(false);

    const selectHandle = (selectInfo) => {
        console.log(selectInfo);
        setSelectInfo(selectInfo);
        setIsOpen(true);
    }

    return (
        <section className={styles.events_container}>
            <ModalWindowEvent 
                open={isOpen}            
            />
            <div className={styles.heading}>
                <span className={styles.date}>Tuesday, 8</span>
                <span className={styles.holiday}>Day of cultural and masters folk art</span>
            </div>
            <FullCalendar
                editable={true}
                selectable={true}
                allDaySlot={false}
                dayMaxEvents={true}
                headerToolbar={{
                    start: '',
                    end: ''
                }}
                plugins={[daygridPlugin, interactionPlugin, timeGridPlugin]}
                initialView="timeGridDay"
                slotDuration={'00:15'}
                slotLabelInterval={'01:00'}
                height={'90%'}
                slotLabelFormat={{
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: false
                }}
                select={selectHandle}
            />
        </section>
    );
}

export default TasksCalendar;