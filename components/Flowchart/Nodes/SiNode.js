import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

const SiNode = memo(({ data }) => {
  return (
    <>
      <Handle
        type="target"
        position="left"
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <span style={{ borderRadius: '50%', color: '#ffffff', backgroundColor:  '#1f49c7', padding: 10}}>{data?.title}</span>
      <Handle
        type="source"
        position="right"
        id="a"
      />
    </>
  );
});

export default SiNode;