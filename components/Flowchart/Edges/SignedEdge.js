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
    stroke: 'gray',
    strokeWidth: 3
  },
  data,
  markerEndId,
}) {
  const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const markerEnd = getMarkerEnd('arrow', 'edge-marker-default');

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <text>
        <textPath href={`#${id}`} style={{ fontSize: '32px', backgroundColor: 'red' }} startOffset="50%" textAnchor="bottom">{(data?.signal != '0') ? data?.signal : ''}</textPath>
      </text>
    </>
  );
}