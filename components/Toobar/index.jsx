import { Container } from '@material-ui/core'
import {Save as SaveIcon, ArrowBack as ArrowBackIcon, Group as GroupIcon } from '@material-ui/icons'
import { FaEdit } from 'react-icons/fa'
import React from 'react'

import styles from "./styles.module.scss"

const Toobar = ({onSave, onRestore}) => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className={styles.toobar}>
            <Container className={styles.toobarContainer}>
                <div className={styles.itemsLeft}>
                    <SaveIcon fontSize="large" onClick={onSave} />
                    <FaEdit fontSize={32} className={styles.editBTN} onClick={onRestore} />
                </div>
                <div className={styles.itemsRight}>
                    <button className={styles.siBTN} onDragStart={(event) => onDragStart(event, 'SiNode')} draggable>SI</button>
                    <div onDragStart={(event) => onDragStart(event, 'ActorNode')} draggable>
                        <GroupIcon fontSize="large" className={styles.iconBTN}/>
                    </div>
                    <button className={styles.rBTN} onDragStart={(event) => onDragStart(event, 'VRNode')} draggable>R</button>
                    <span className={styles.aBTN} onDragStart={(event) => onDragStart(event, 'TextNode')} draggable>A</span>
                    <button className={styles.criteriaBTN} onDragStart={(event) => onDragStart(event, 'ACRNode')} draggable>Acountability Criteria</button>
                </div>
            </Container>
        </div>
  );
}

export default Toobar;