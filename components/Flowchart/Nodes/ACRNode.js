import React, { memo } from 'react';
import { useState } from 'react';

import { Handle } from 'react-flow-renderer';

const backgroundColors = {
  'Engajamento': '#ffd633',
  'Gerenciamento': '#f28d8d',
  'Regulação': '#5f91ec'
};

const ACRNode = (({ data }) => {
  return (
    <>
      <div 
        style={{
          border: '1px solid #000000',
          backgroundColor: backgroundColors[data?.item?.criterio_accountability],
          padding: 10 }}>
        <strong>{data.title}</strong>
      </div>
      <Handle
        type="source"
        position="bottom"
        id="s-1"
        style={{
          backgroundColor: 'green'
        }}
      />
      <Handle
        type="source"
        position="left"
        id="s-2"
        style={{
          backgroundColor: 'green'
        }}
      />
    </>
  );
});

export default memo(ACRNode);