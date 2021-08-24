import React from 'react';
import { FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import SIUpdateForm from '../SIUpdateForm';
import { useState } from 'react';
import ConditionForm from '../ConditionForm';
import ObligationForm from '../ObligationForm';
import SanctionForm from '../SanctionForm';
import ResponsabilityForm from '../ResponsabilityForm';

import styles from "./styles.module.scss";

interface ConditionProps {
  pk: string;
  descricao: string;
  sistema: string;
}

interface ObligationProps {
  pk: string;
  descricao: string;
  sistema: string;
}

interface SanctionProps {
  pk: string;
  descricao: string;
  sistema: string;
}

interface ResponsabilityProps {
  pk: string;
  descricao: string;
  sistema: string;
}

interface SystemProps {
  pk: string;
  projeto: string;
  nome: string;
  condicoes: Array<ConditionProps>;
  obrigacoes: Array<ObligationProps>;
  sancoes: Array<SanctionProps>;
  responsabilidades: Array<ResponsabilityProps>;
}

interface IProps {
  _system: SystemProps;
  handleUpdateSystem: (data: Object) => void;
  handleCloseView: () => void;
}

const SystemView: React.FC<IProps> = ({ _system, handleUpdateSystem, handleCloseView }) => {
  const [item, setItem] = useState(0);
  const [system, setSystem] = useState(_system);

  const handleNewCondition = (condition: ConditionProps) => {
    let auxSystem = {...system};
    auxSystem.condicoes.push(condition);
    setSystem(auxSystem);
  }

  const handleNewObligation = (obligation: ObligationProps) => {
    let auxSystem = {...system};
    auxSystem.obrigacoes.push(obligation);
    setSystem(auxSystem);
  }

  const handleNewSanction = (sanction: SanctionProps) => {
    let auxSystem = {...system};
    auxSystem.sancoes.push(sanction);
    setSystem(auxSystem);
  }

  const handleNewResponsability = (responsability: ResponsabilityProps) => {
    let auxSystem = {...system};
    auxSystem.responsabilidades.push(responsability);
    setSystem(auxSystem);
  }

  const listItems = () => {
    switch (item) {
      case 0:
        return (
          <div>
            <ul className={styles.itemList}>
              {system.condicoes.map(condition => (
                <li key={condition.pk}>{condition.descricao}</li>
              ))}
            </ul>
            <ConditionForm sistema={system.pk} handleNewCondition={handleNewCondition} />
          </div>  
        );
        break;
      case 1:
        return (
          <div>
            <ul className={styles.itemList}>
              {system.obrigacoes.map(obligation => (
                <li key={obligation.pk}>{obligation.descricao}</li>))}</ul>
            <ObligationForm sistema={system.pk} handleNewObligation={handleNewObligation} />
          </div>
        );
        break;
      case 2:
        return (
          <div>
            <ul className={styles.itemList}>
              {system.sancoes.map(sanction => (
                <li key={sanction.pk}>{sanction.descricao}</li>))}</ul>
            <SanctionForm sistema={system.pk} handleNewSanction={handleNewSanction} />
          </div>
        );
        break;
      case 3:
        return (
          <div>
            <ul className={styles.itemList}>
              {system.responsabilidades.map(responsability => (
                <li key={responsability.pk}>{responsability.descricao}</li>))}</ul>
            <ResponsabilityForm sistema={system.pk} handleNewResponsability={handleNewResponsability} />
          </div>
        );
        break;
      default:
        return (<></>);
        break;
    }
  }

  return (
    <div>
      <SIUpdateForm 
        systemId={system.pk}
        projeto={system.projeto}
        nome={system.nome}
        handleUpdateSystem={handleUpdateSystem}
        handleCloseModal={handleCloseView}
      />
    <div>
      <FormControl component="fieldset">
        <RadioGroup aria-label="donationType" name="donationType1" style={{ display: 'flex', flexDirection: 'row' }}>
          <FormControlLabel value="0" onChange={ event => setItem(0) } checked={(item == 0)} control={<Radio />} label="Condições" />
          <FormControlLabel value="1" onChange={ event => setItem(1) } checked={(item == 1)} control={<Radio />} label="Obrigações" />
          <FormControlLabel value="2" onChange={ event => setItem(2) } checked={(item == 2)} control={<Radio />} label="Sanções" />
          <FormControlLabel value="3" onChange={ event => setItem(3) } checked={(item == 3)} control={<Radio />} label="Responsabilidades" />
        </RadioGroup>
      </FormControl>
      {listItems()}
    </div>
    </div>
  );
}

export default SystemView;