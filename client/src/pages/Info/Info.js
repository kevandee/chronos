import React from 'react';
import { Box, Container, Button, Link } from '@mui/material'

import Header from '../../components/Header/Header';
import Schedule from '../../assets/images/IllustrationSchedule.png';

import styles from './Info.module.scss';

const Info = () => {
    return (
        <main>
            <Header />
            <Container maxWidth='xl'>
                <section style={{ position: 'relative' }} className={styles.section1}>
                    <Box className={styles.text_container}>
                        <h1 className={styles.main_text}>Professional<br/>scheduling made easy</h1>
                        <span className={styles.description}>Weekly is the fastest and easiest way to schedule anything — from meetings to the next great collaboration.</span>
                        <Box className={styles.buttons_box}>
                            <Button href='/signup' variant="contained" className={styles.signup_btn}>Try it free</Button>
                        </Box>
                    </Box>
                    <img src={Schedule} alt='background illustrtation'className={styles.Illustarion}/>
                </section>

                <section style={{ position: 'relative' }} className={styles.section2}>
                    <img alt='background illustrtation'className={styles.Illustarion}/>
                    <Box className={styles.text_container}>
                        <h1 className={styles.heading}>who are we?</h1>
                        <span className={styles.description}>A public platform building the<br/>definitive collection of coding<br/>questions & answers</span>
                        <Link href="/questions" className={styles.link}>search content</Link>
                    </Box>
                </section>
            </Container>
        </main>
    );
}

export default Info;