import React from 'react';
import { getBezierPath, getMarkerEnd } from 'react-flow-renderer';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {
    stroke: 'red',
    strokeWidth: 3
  },
  data,
}) {
  const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const markerEnd = getMarkerEnd('arrow', 'edge-marker-red');

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} />
      <text>
        {/* <textPath href={`#${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">SiEdge</textPath> */}
      </text>
    </>
  );
}