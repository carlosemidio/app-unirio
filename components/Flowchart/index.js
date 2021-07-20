import React, { useState, useCallback } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
  useZoomPanHelper,
  MiniMap,
  Controls,
  Background,
} from 'react-flow-renderer';
import initialElements from './initial-elements';
import CustomEdge from './CustomEdge';
import SiNode from './Nodes/SINode';
import ActorNode from './Nodes/ActorNode';
import ACGNode from './Nodes/ACGNode';
import ACENode from './Nodes/ACENode';
import ACRNode from './Nodes/ACRNode';
import TextNode from './Nodes/TextNode';
import VRNode from './Nodes/VRNode';
import Toobar from '../Toobar'

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

const getNodeId = () => `flownode_${+new Date()}`;

const SaveRestore = () => {
    const [rfInstance, setRfInstance] = useState(null);
    const [elements, setElements] = useState([]);
    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));
    const onConnect = (params) => setElements((els) => addEdge(params, els));

    const { transform } = useZoomPanHelper();

    const onSave = useCallback(() => {
        alert('Flow saved');

        if (rfInstance) {
            const flow = rfInstance.toObject();
            localforage.setItem(flowKey, flow);
        }
    }, [rfInstance]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const flow = await localforage.getItem(flowKey);

            if (flow) {
                const [x = 0, y = 0] = flow.position;
                setElements(flow.elements || []);
                transform({ x, y, zoom: flow.zoom || 0 });
            }
        };

        restoreFlow();
    }, [setElements, transform]);

    const onAdd = useCallback((type, title) => () => {
        const newNode = {
            id: getNodeId(),
            type: type,
            data: { title: title },
            position: {
                x: Math.random() * window.innerWidth - 100,
                y: Math.random() * window.innerHeight,
            },
        };
        setElements((els) => els.concat(newNode));
    }, [setElements]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                onConnect={onConnect}
                onLoad={setRfInstance}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
                snapToGrid={true}
                snapGrid={[15, 15]}
            >
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
            <Toobar onSave={onSave} onRestore={onRestore} onAdd={onAdd} />
        </div>
    );
};

export default SaveRestore;