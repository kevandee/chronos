import React from "react";
import { Typography, Button, Link, Avatar } from "@mui/material";

import styles from './SideBarMenu.module.scss';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

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
                        <tbody>
                            <tr>
                                <td>
                                    <input type="radio" id="General" name="calendar" value="General" defaultChecked={true}/>
                                    <label htmlFor="General">General</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="radio" id="Calendar1" name="calendar" value="Calendar1"/>
                                    <label htmlFor="Calendar1">Calendar1</label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Button><AddIcon />Add new</Button>
                </div>
            </div> 
            <div className={styles.links}>
                <Link href='/account'><PersonIcon/>Account</Link>
                <Link href='/settings'><SettingsIcon/>Settings</Link>
            </div>
            <div className={styles.user}>
                <Avatar alt='User Name' src='img' sx={{width: '50px', height: '50px'}}></Avatar>
                <span>Yaroslav<br/>Doroshenko</span>
            </div>
        </section>
    );
}

export default SideBarMenu;