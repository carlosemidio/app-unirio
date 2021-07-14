import React from 'react';
import { Container } from '@material-ui/core';

import styles from "./styles.module.scss";

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <Container className={styles.headerContainer}>
                <img src="/vercel.svg" alt="" /><h2>Accountability Evaluation Diagram</h2>
            </Container>
        </header>
    );
}

export default Header;