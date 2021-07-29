import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

const TextNode = (({ data }) => {
  return (
    <>
      <Handle
        type="target"
        position="left"
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      
      <span style={{ color: '#000000', padding: 10}}>
        {data?.title}
      </span>
      <Handle
        type="source"
        position="right"
        id="a"
      />
    </>
  );
});

export default memo(TextNode);