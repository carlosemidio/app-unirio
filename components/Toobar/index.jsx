import React from 'react';
import { Container } from '@material-ui/core';
import {Save as SaveIcon, ArrowBack as ArrowBackIcon, Group as GroupIcon } from '@material-ui/icons';
import { FaEdit } from 'react-icons/fa';
import Image from 'next/image';

import styles from "./styles.module.scss"

const Toobar = ({ onSave, onRestore, handleOpenImpactsChange, projectId }) => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className={styles.toobar}>
            <Container className={styles.toobarContainer}>
                <div className={styles.itemsLeft}>
                    <SaveIcon 
                        fontSize="large" 
                        onClick={onSave}
                        titleAccess="Save flowchart"
                        className={styles.itemsLeftBTN} />
                    <FaEdit 
                        fontSize={32}
                        title="Restore flowchart"
                        className={styles.itemsLeftBTN} 
                        onClick={onRestore} />
                    <Image
                        width={24}
                        height={24}
                        className={styles.itemsLeftBTN}
                        onClick={handleOpenImpactsChange}
                        title="Change time impacts"
                        src="/time-impacts.jpeg" />
                    
                    <Image
                        width={24}
                        height={24}
                        className={styles.itemsLeftBTN}
                        title="Generate report"
                        onClick={async () => {
                            if (process.browser) {
                                await onSave();
                                window.open(`http://67.205.182.13/relatorio/${projectId}/`, '_blank')
                            }}
                        }
                        src="/report.jpeg" />
                </div>
                <div className={styles.itemsRight}>
                    <button 
                        className={styles.siBTN}
                        title="System node"
                        onDragStart={(event) => onDragStart(event, 'SiNode')} 
                        draggable>IS</button>
                    <div 
                        onDragStart={(event) => onDragStart(event, 'ActorNode')} 
                        draggable>
                        <GroupIcon 
                            fontSize="large" 
                            titleAccess="Actor node"
                            className={styles.iconBTN}/>
                    </div>
                    <button 
                        className={styles.rBTN} 
                        title="Vertice node"
                        onDragStart={(event) => onDragStart(event, 'VRNode')} 
                        draggable>R</button>
                    <span 
                        className={styles.aBTN}
                        title="Text node" 
                        onDragStart={(event) => onDragStart(event, 'TextNode')} 
                        draggable>A</span>
                    <button 
                        className={styles.criteriaBTN}
                        title="Acountability Criteria node" 
                        onDragStart={(event) => onDragStart(event, 'ACRNode')} 
                        draggable>Acountability Criteria</button>
                </div>
            </Container>
        </div>
  );
}

export default Toobar;