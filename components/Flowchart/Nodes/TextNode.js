import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

const TextNode = (({ data }) => {
  return (
    <>
      <Handle
        type="target"
        position="left"
        style={{
          backgroundColor: 'green'
        }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      
      <span style={{ color: '#000000', padding: 10, fontStyle: 'italic'}}>
        {data?.title}
      </span>
      <Handle
        type="source"
        position="right"
        style={{
          backgroundColor: 'red'
        }}
      />
    </>
  );
});

export default memo(TextNode);