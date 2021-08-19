import React, { memo } from 'react';

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
        onClick={event => alert("test click")}
        style={{
          border: '1px solid #000000',
          backgroundColor: backgroundColors[data?.item?.criterio_accountability],
          padding: 10 }}>
        <strong>{data.title}</strong>
      </div>
      <Handle
        type="source"
        position="bottom"
      />
    </>
  );
});

export default memo(ACRNode);