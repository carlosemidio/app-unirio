import { Container } from '@material-ui/core';
import React from 'react';

import styles from "./styles.module.scss"

const Help: React.FC = () => {
    return <Container className={styles.container}>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias dolores culpa nobis commodi ducimus fugiat voluptatem laborum deserunt! Delectus vero est esse tempora explicabo dicta quae provident et, alias incidunt!</p>
    </Container>;
}

export default Help;