import React from 'react';
import { FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import VerticeUpdateForm from '../VerticeUpdateForm';
import { useState } from 'react';
import ConditionForm from '../ConditionForm';
import ObligationForm from '../ObligationForm';
import SanctionForm from '../SanctionForm';
import ResponsabilityForm from '../ResponsabilityForm';

import styles from "./styles.module.scss";

interface ConditionProps {
  pk: string;
  descricao: string;
}

interface ObligationProps {
  pk: string;
  descricao: string;
}

interface SanctionProps {
  pk: string;
  descricao: string;
}

interface ResponsabilityProps {
  pk: string;
  descricao: string;
}

interface VerticeProps {
  pk: string;
  projeto: string;
  descricao: string;
  condicoes: Array<ConditionProps>;
  obrigacoes: Array<ObligationProps>;
  sancoes: Array<SanctionProps>;
  responsabilidades: Array<ResponsabilityProps>;
}

interface IProps {
  _vertice: VerticeProps;
  handleUpdateVertice: (data: Object) => void;
  handleCloseView: () => void;
}

const VerticeView: React.FC<IProps> = ({ _vertice, handleUpdateVertice, handleCloseView }) => {
  const [item, setItem] = useState(0);
  const [vertice, setVertice] = useState(_vertice);

  const handleNewCondition = (condition: ConditionProps) => {
    let auxVertice = {...vertice};
    auxVertice.condicoes.push(condition);
    setVertice(auxVertice);
    handleUpdateVertice(auxVertice);
  }

  const handleNewObligation = (obligation: ObligationProps) => {
    let auxVertice = {...vertice};
    auxVertice.obrigacoes.push(obligation);
    setVertice(auxVertice);
    handleUpdateVertice(auxVertice);
  }

  const handleNewSanction = (sanction: SanctionProps) => {
    let auxVertice = {...vertice};
    auxVertice.sancoes.push(sanction);
    setVertice(auxVertice);
    handleUpdateVertice(auxVertice);
  }

  const handleNewResponsability = (responsability: ResponsabilityProps) => {
    let auxVertice = {...vertice};
    auxVertice.responsabilidades.push(responsability);
    setVertice(auxVertice);
    handleUpdateVertice(auxVertice);
  }

  const listItems = () => {
    switch (item) {
      case 0:
        return (
          <div>
            <ul className={styles.itemList}>
              {vertice?.condicoes?.map(condition => (
                <li key={condition?.pk}>{condition?.descricao}</li>
              ))}
            </ul>
            <ConditionForm vertice={vertice?.pk} handleNewCondition={handleNewCondition} handleCloseModal={handleCloseView} />
          </div>  
        );
        break;
      case 1:
        return (
          <div>
            <ul className={styles.itemList}>
              {vertice?.obrigacoes?.map(obligation => (
                <li key={obligation?.pk}>{obligation?.descricao}</li>))}</ul>
            <ObligationForm vertice={vertice?.pk} handleNewObligation={handleNewObligation} handleCloseModal={handleCloseView} />
          </div>
        );
        break;
      case 2:
        return (
          <div>
            <ul className={styles.itemList}>
              {vertice?.sancoes?.map(sanction => (
                <li key={sanction?.pk}>{sanction?.descricao}</li>))}</ul>
            <SanctionForm vertice={vertice?.pk} handleNewSanction={handleNewSanction} handleCloseModal={handleCloseView} />
          </div>
        );
        break;
      case 3:
        return (
          <div>
            <ul className={styles.itemList}>
              {vertice?.responsabilidades?.map(responsability => (
                <li key={responsability?.pk}>{responsability?.descricao}</li>))}</ul>
            <ResponsabilityForm vertice={vertice?.pk} handleNewResponsability={handleNewResponsability} handleCloseModal={handleCloseView} />
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
      <VerticeUpdateForm 
        verticeId={vertice.pk}
        projeto={vertice.projeto}
        descricao={vertice.descricao}
        handleUpdateVertice={handleUpdateVertice}
        handleCloseModal={handleCloseView}
      />
    <div>
      <FormControl component="fieldset">
        <RadioGroup aria-label="donationType" name="donationType1" style={{ display: 'flex', flexDirection: 'row' }}>
          <FormControlLabel value="0" onChange={ event => setItem(0) } checked={(item == 0)} control={<Radio />} label="Conditions" />
          <FormControlLabel value="1" onChange={ event => setItem(1) } checked={(item == 1)} control={<Radio />} label="Obligations" />
          <FormControlLabel value="2" onChange={ event => setItem(2) } checked={(item == 2)} control={<Radio />} label="Sanctions" />
          <FormControlLabel value="3" onChange={ event => setItem(3) } checked={(item == 3)} control={<Radio />} label="Responsibilities" />
        </RadioGroup>
      </FormControl>
      {listItems()}
    </div>
    </div>
  );
}

export default VerticeView;