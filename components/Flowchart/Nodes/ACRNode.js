import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';

export default memo(({ data }) => {
  return (
    <>
      <Handle
        type="target"
        position="left"
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <div style={{ border: '1px solid #000000', backgroundColor: '#5f91ec', padding: 10 }}>
        <strong>{data.title}</strong>
      </div>
      <Handle
        type="source"
        position="right"
        id="a"
      />
    </>
  );
});