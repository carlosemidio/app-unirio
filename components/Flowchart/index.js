import React, { useState, useEffect, useCallback, useRef } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ReactFlow, {
  removeElements,
  addEdge,
  useZoomPanHelper,
  MiniMap,
  Controls,
  Background,
} from 'react-flow-renderer';
import CustomEdge from './CustomEdge';
import SiNode from './Nodes/SiNode';
import ActorNode from './Nodes/ActorNode';
import ACRNode from './Nodes/ACRNode';
import TextNode from './Nodes/TextNode';
import VRNode from './Nodes/VRNode';
import SIForm from '../SIForm';
import ActorForm from '../ActorForm';
import VRForm from '../VRForm';
import TextForm from '../TextForm';
import ACRForm from '../ACRForm';
import Toobar from '../Toobar';

import localforage from 'localforage';

import styles from "./styles.module.scss";

localforage.config({
  name: 'react-flow-docs',
  storeName: 'flows',
});

const nodeTypes = {
    SiNode: SiNode,
    ActorNode: ActorNode,
    ACRNode: ACRNode,
    VRNode: VRNode,
    TextNode: TextNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

const flowKey = 'app-unirio';

let id = 0;
const getId = () => `node_${id++}`;
let data = [];
let currentNode = null;

const SaveRestore = ({project}) => {
    const reactFlowWrapper = useRef(null);
    const [rfInstance, setRfInstance] = useState(null);
    const [elements, setElements] = useState([]);
    const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
    const onConnect = (params) => setElements((els) => addEdge(params, els));

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal( true );
    }
    
    const handleCloseModal = () => {
        setOpenModal( false );
    }

    const handleNewSystem = (sistema) => {
        currentNode.data = { 
            title: `${sistema.nome}`,
            item: sistema
        };

        setElements((es) => es.concat(currentNode));
        handleCloseModal();
    }

    const handleNewActor = (ator) => {
        currentNode.data = { 
            title: `${ator.nome}`,
            item: ator
        };

        setElements((es) => es.concat(currentNode));
        handleCloseModal();
    }

    const handleNewVR = (vr) => {
        currentNode.data = { 
            title: `${vr.descricao}`,
            item: vr
        };

        setElements((es) => es.concat(currentNode));
        handleCloseModal();
    }

    const handleNewText = (text) => {
        currentNode.data = { 
            title: `${text}`,
        };

        setElements((es) => es.concat(currentNode));
        handleCloseModal();
    }

    const handleNewCriteria = (criteria) => {
        currentNode.data = { 
            title: `${criteria.indicador}`,
            item: criteria
        };

        setElements((es) => es.concat(currentNode));
        handleCloseModal();
    }

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (event) => {
        event.preventDefault();

        setOpenModal(true);

        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
        const position = rfInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });
        
        currentNode = {
            id: getId(),
            type,
            position,
        };
    };

    const { transform } = useZoomPanHelper();

    const onSave = useCallback(() => {
        alert('Flow saved');

        if (rfInstance) {
            const flow = rfInstance.toObject();
            localforage.setItem(flowKey, flow);
            localforage.setItem('nodesId', id);
        }
    }, [rfInstance]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const flow = await localforage.getItem(flowKey);
            id = await localforage.getItem('nodesId');

            if (flow) {
                const [x = 0, y = 0] = flow.position;
                setElements(flow.elements || []);
                transform({ x, y, zoom: flow.zoom || 0 });
            }
        };

        restoreFlow();
    }, [setElements, transform]);

    function switchForm() {
        const type = currentNode?.type;

        switch(type) {
            case 'SiNode':
                return (
                    <SIForm projeto={project.pk} options={ project.sistemas.map(system => {
                        return {name: system?.nome, value: system.id};
                    }) } handleNewSystem={handleNewSystem} />
                );
            case 'ActorNode':
                return (
                    <ActorForm projeto={project.pk} options={project.atores.map(system => {
                        return {name: system?.nome, value: system.id};
                    })} handleNewActor={handleNewActor} />
                );
            case 'VRNode':
                return (
                    <VRForm projeto={project.pk} options={project.tarefas.map(tarefa => {
                        return {name: tarefa?.nome, value: tarefa.id};
                    })} handleNewVR={handleNewVR} />
                );
            case 'TextNode':
                return (
                    <TextForm handleNewText={handleNewText} />
                );
            case 'ACRNode':
                return (
                    <ACRForm handleNewCriteria={handleNewCriteria} />
                );
            default:
                return <></>;
        }
    }

    return (
        <div style={{ width: '100%', height: '100%' }} ref={reactFlowWrapper}>
            <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                onConnect={onConnect}
                onLoad={setRfInstance}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
                snapToGrid={true}
                snapGrid={[15, 15]}
                onDrop={onDrop}
                onDragOver={onDragOver}
            >
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
            <Toobar onSave={onSave} onRestore={onRestore} />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={styles.modal}
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <>
                    <Fade in={openModal}>
                        { switchForm() }
                    </Fade>
                </>
            </Modal>
        </div>
    );
};

export default SaveRestore;