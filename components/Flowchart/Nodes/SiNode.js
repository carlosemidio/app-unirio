import React, { memo, useState } from 'react';

import { Handle } from 'react-flow-renderer';

const SiNode = (({ data }) => {

  const [oldPosition, setOldPosition] = useState([0, 0]);

  return (
    <div
      onMouseDown={
        async event => {
          await setOldPosition([event.clientX, event.clientY]);
        }
      }
      onClick={event => {
        if ((oldPosition[0] == event.clientX) && (oldPosition[1] == event.clientY)) {
          alert("Button clicked!");
        }
      }}>
      <Handle
        type="target"
        position="left"
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <span 
        style={{
          borderRadius: '50%',
          color: '#ffffff',
          backgroundColor:  '#1f49c7',
          padding: 10}}>{data?.title}</span>
      <Handle
        type="source"
        position="right"
      />
    </div>
  );
});

export default memo(SiNode);