import React, { useState } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
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

const onLoad = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};

const edgeTypes = {
  custom: CustomEdge,
};

const nodeTypes = {
  SiNode: SiNode,
  ActorNode: ActorNode,
  ACGNode: ACGNode,
  ACENode: ACENode,
  ACRNode: ACRNode,
  VRNode: VRNode,
  TextNode: TextNode,
};


const OverviewFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      snapToGrid={true}
      snapGrid={[15, 15]}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
    >
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === 'input') return '#0041d0';
          if (n.type === 'output') return '#ff0072';
          if (n.type === 'default') return '#1a192b';

          return '#eee';
        }}
        nodeColor={(n) => {
          if (n.style?.background) return n.style.background;

          return '#fff';
        }}
        nodeBorderRadius={2}
      />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default OverviewFlow;