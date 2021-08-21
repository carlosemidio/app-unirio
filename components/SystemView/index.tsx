import React from 'react';
import SIUpdateForm from '../SIUpdateForm';

// import { Container } from './styles';

interface SystemProps {
  pk: string;
  projeto: string;
  nome: string;
}

interface IProps {
  system: SystemProps;
  handleUpdateSystem: (data: Object) => null;
}

const SystemView: React.FC<IProps> = ({ system, handleUpdateSystem }) => {
  console.log(system);
  return <SIUpdateForm systemId={system.pk} projeto={system.projeto} nome={system.nome} handleUpdateSystem={handleUpdateSystem} />
}

export default SystemView;