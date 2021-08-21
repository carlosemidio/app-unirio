import React from 'react';

// import { Container } from './styles';

interface SystemProps {
    autor: string;
}

interface IProps {
    system: SystemProps;
  }

const SystemView: React.FC<IProps> = ({ system }) => {
  return <div>
      <h1>Autor: { system?.autor }</h1>
  </div>;
}

export default SystemView;