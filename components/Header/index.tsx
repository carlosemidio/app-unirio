import React from 'react';
import { Container } from '@material-ui/core';

import styles from "./styles.module.scss";
import Image from 'next/image';
import logoPic from '/public/logo.png'

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <Container className={styles.headerContainer}>
                <Image src={logoPic} alt="Logo" height={70} width={250} /> <h2>Accountability Evaluation Diagram</h2>
            </Container>
        </header>
    );
}

export default Header;