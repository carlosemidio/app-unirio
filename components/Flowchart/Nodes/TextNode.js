import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

import Image from 'next/image';

const TextNode = (({ data }) => {
  return (
    <>
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
      <div style={{ color: '#000000', padding: 10, backgroundColor: '#FFFFFF', fontStyle: 'italic'}}>
        {/*Cara tenho certeza que isso aqui é gambiarra, desculpa. Não consegui arrumar de outro jeito. A ideia é dar um espaço entre a imagem e o texto*/}
        <Image
          width={20}
          height={20}
          src="/text-icon.png" />
        <p>{data?.title}</p>
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
    </>
  );
});

export default memo(TextNode);