import React, { memo, useState } from 'react';

import { Handle } from 'react-flow-renderer';

import Image from 'next/image';

const VRNode = (({ id, data }) => {
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
          data.handleViewItem({ 
            id: id,
            type: 'VRNode',
            data
          });
        }
      }}
    >
      <Handle
        type="target"
        position="right"
        id="t-1"
        style={{
          backgroundColor: 'red'
        }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <Handle
        type="target"
        position="bottom"
        id="t-2"
        style={{
          backgroundColor: 'red'
        }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      
      <div style={{ color: '#000000', backgroundColor: '#FFFFFF', padding: 10}}>
        <Image
          width={20}
          height={20}
          src="/Vn-icon.png"
          alt="Vertex Node image" />
        {data?.title}
      </div>
      <Handle
        type="source"
        position="left"
        id="s-1"
        style={{
          backgroundColor: 'green'
        }}
      />
      <Handle
        type="source"
        position="top"
        id="s-2"
        style={{
          backgroundColor: 'green'
        }}
      />
    </div>
  );
});

export default memo(VRNode);