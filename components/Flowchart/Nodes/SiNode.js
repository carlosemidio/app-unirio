import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

const SiNode = (({ data }) => {
  return (
    <>
      <Handle
        type="target"
        position="top"
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <span style={{ borderRadius: '50%', color: '#ffffff', backgroundColor:  '#1f49c7', padding: 10}}>{data?.title}</span>
      <Handle
        type="source"
        position="bottom"
        id="a"
      />
    </>
  );
});

export default memo(SiNode);