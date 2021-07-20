import { Container } from '@material-ui/core'
import {Save as SaveIcon, ArrowBack as ArrowBackIcon, Group as GroupIcon } from '@material-ui/icons'
import { FaEdit } from "react-icons/Fa"
import React from 'react'

import styles from "./styles.module.scss"

const Toobar = ({onSave, onRestore, onAdd}) => {
    return (
        <div className={styles.toobar}>
            <Container className={styles.toobarContainer}>
                <div className={styles.itemsLeft}>
                    <SaveIcon fontSize="large" onClick={onSave} />
                    <FaEdit fontSize={32} className={styles.editBTN} onClick={onRestore} />
                </div>
                <div className={styles.itemsRight}>
                    <button className={styles.siBTN} onClick={onAdd('SiNode', 'New SiNode')}>SI</button>
                    <GroupIcon fontSize="large" className={styles.iconBTN} onClick={onAdd('ActorNode', 'New ActorNode')} />
                    <button className={styles.rBTN} onClick={onAdd('VRNode', 'New VRNode')}>R</button>
                    <span className={styles.aBTN} onClick={onAdd('TextNode', 'New TextNode')}>A</span>
                    <ArrowBackIcon fontSize="large" className={styles.iconBTN} /> 
                    <button className={styles.criteriaBTN}>Acountability Criteria</button>
                </div>
            </Container>
        </div>
  );
}

export default Toobar;