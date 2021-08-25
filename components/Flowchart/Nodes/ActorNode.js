import React, { memo, useState } from 'react';

import { Handle } from 'react-flow-renderer';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';

const ActorNode = (({ id, data }) => {
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
            type: 'ActorNode',
            data
          });
        }
      }}
    >
      <Handle
        type="target"
        position="left"
        style={{
          backgroundColor: 'green'
        }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      
      <span style={{ color: '#000000', padding: 10}}>
        <AccessibilityNewIcon />
        {data?.title}
      </span>
      <Handle
        type="source"
        position="right"
        style={{
          backgroundColor: 'red'
        }}
      />
    </div>
  );
});

export default memo(ActorNode);