import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';

const VRNode = (({ data }) => {
  return (
    <>
      <Handle
        type="target"
        position="top"
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      
      <span style={{ color: '#000000', padding: 10}}>
        {data?.title}
      </span>
      <Handle
        type="source"
        position="bottom"
      />
    </>
  );
});

export default memo(VRNode);