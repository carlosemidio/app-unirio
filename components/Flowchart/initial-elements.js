import React from 'react';

export default [
  {
    id: '1',
    type: 'SiNode',
    data: {
        system: {
            title: "SOFIA",
        }
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    type: 'SiNode',
    data: {
        system: {
            title: "QADAD",
        }
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    type: 'ActorNode',
    data: {
        actor: {
            name: "Aluno",
        }
    },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    position: { x: 250, y: 200 },
    type: 'ActorNode',
    data: {
        actor: {
            name: "Professor",
        }
    },
  },
  {
    id: '5',
    type: 'ACGNode',
    data: {
      text: 'A organização investe em informação documentada.',
    },
    position: { x: 250, y: 325 },
  },
  {
    id: '6',
    type: 'ACENode',
    data: {
      text: 'Adotar estratégia(s) para explicitar o entendimento de seu ambiente de negócio.',
    },
    position: { x: 100, y: 480 },
  },
  {
    id: '7',
    type: 'ACRNode',
    data: { text: 'A organização estabelece os processos necessários para gestão e sua aplicação.' },
    position: { x: 400, y: 450 },
  },
  { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
  { id: 'e1-3', source: '1', target: '3' },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    label: 'animated edge',
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    arrowHeadType: 'arrowclosed',
    label: 'edge with arrow head',
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    label: 'smooth step edge',
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    type: 'custom',
    data: { text: 'custom edge' },
    style: { stroke: '#f6ab6c' },
    // label: 'a step edge',
    animated: false,
    labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
  },
];