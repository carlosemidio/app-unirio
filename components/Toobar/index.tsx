import { Container } from '@material-ui/core'
import {Save as SaveIcon, ArrowBack as ArrowBackIcon, Group as GroupIcon } from '@material-ui/icons'
import { FaEdit } from "react-icons/Fa"
import React from 'react'

import styles from "./styles.module.scss"

const Toobar: React.FC = () => {
    return (
        <div className={styles.toobar}>
            <Container className={styles.toobarContainer}>
                <div className={styles.itemsLeft}>
                    <SaveIcon fontSize="large" />
                    <FaEdit fontSize={32} className={styles.editBTN} />
                </div>
                <div className={styles.itemsRight}>
                    <button className={styles.siBTN}>SI</button>
                    <GroupIcon fontSize="large" className={styles.iconBTN} />
                    <button className={styles.rBTN}>R</button>
                    <span className={styles.aBTN}>A</span>
                    <ArrowBackIcon fontSize="large" className={styles.iconBTN} /> 
                    <button className={styles.criteriaBTN}>Acountability Criteria</button>
                </div>
            </Container>
        </div>
  );
}

export default Toobar;