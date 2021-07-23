import React, { useState, useCallback, useRef } from 'react';
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
import ACGNode from './Nodes/ACGNode';
import ACENode from './Nodes/ACENode';
import ACRNode from './Nodes/ACRNode';
import TextNode from './Nodes/TextNode';
import VRNode from './Nodes/VRNode';
import SIForm from '../SIForm';
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
    ACGNode: ACGNode,
    ACENode: ACENode,
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

const SaveRestore = () => {
    const reactFlowWrapper = useRef(null);
    const [rfInstance, setRfInstance] = useState(null);
    const [elements, setElements] = useState([]);
    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));
    const onConnect = (params) => setElements((els) => addEdge(params, els));

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal( true );
    }
    
    const handleCloseModal = () => {
        setOpenModal( false );
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
        const newNode = {
            id: getId(),
            type,
            position,
            data: { title: `${type}` },
        };

        setElements((es) => es.concat(newNode));
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
                        <SIForm/>
                    </Fade>
                </>
            </Modal>
        </div>
    );
};

export default SaveRestore;