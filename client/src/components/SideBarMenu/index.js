import React from "react";
import { Typography, Button } from "@mui/material";

import styles from './SideBarMenu.module.scss';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const SideBarMenu = () => {
    return (
        <section className={styles.sidebar_container}>
            <div className={styles.logo_container}>
                <Typography variant='h1' className={styles.logo}>
                    weekly.
                </Typography>
            </div>
            <div className={styles.calendars_container}>
                <div className={styles.title}>
                    <CalendarMonthIcon />
                    <span>Calendars</span>
                </div>
                <div className={styles.calendars_list}>
                    <table>
                        <tr>
                            <td>
                                <input type="radio" id="General" name="calendar" value="General" checked/>
                                <label for="General">General</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="radio" id="Calendar1" name="calendar" value="Calendar1"/>
                                <label for="Calendar1">Calendar1</label>
                            </td>
                        </tr>
                    </table>
                    <Button>Add new</Button>
                </div>
            </div> 
        </section>
    );
}

export default SideBarMenu;