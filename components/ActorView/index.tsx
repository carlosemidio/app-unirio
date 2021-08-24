import React from 'react';
import { FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import ActorUpdateForm from '../ActorUpdateForm';
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

interface ActorProps {
  pk: string;
  projeto: string;
  nome: string;
  condicoes: Array<ConditionProps>;
  obrigacoes: Array<ObligationProps>;
  sancoes: Array<SanctionProps>;
  responsabilidades: Array<ResponsabilityProps>;
}

interface IProps {
  _actor: ActorProps;
  handleUpdateActor: (data: Object) => void;
  handleCloseView: () => void;
}

const ActorView: React.FC<IProps> = ({ _actor, handleUpdateActor, handleCloseView }) => {
  const [item, setItem] = useState(0);
  const [actor, setActor] = useState(_actor);

  const handleNewCondition = (condition: ConditionProps) => {
    let auxActor = {...actor};
    auxActor.condicoes.push(condition);
    setActor(auxActor);
    handleUpdateActor(auxActor);
  }

  const handleNewObligation = (obligation: ObligationProps) => {
    let auxActor = {...actor};
    auxActor.obrigacoes.push(obligation);
    setActor(auxActor);
    handleUpdateActor(auxActor);
  }

  const handleNewSanction = (sanction: SanctionProps) => {
    let auxActor = {...actor};
    auxActor.sancoes.push(sanction);
    setActor(auxActor);
    handleUpdateActor(auxActor);
  }

  const handleNewResponsability = (responsability: ResponsabilityProps) => {
    let auxActor = {...actor};
    auxActor.responsabilidades.push(responsability);
    setActor(auxActor);
    handleUpdateActor(auxActor);
  }

  const listItems = () => {
    switch (item) {
      case 0:
        return (
          <div>
            <ul className={styles.itemList}>
              {actor.condicoes.map(condition => (
                <li key={condition.pk}>{condition.descricao}</li>
              ))}
            </ul>
            <ConditionForm ator={actor.pk} handleNewCondition={handleNewCondition} />
          </div>  
        );
        break;
      case 1:
        return (
          <div>
            <ul className={styles.itemList}>
              {actor.obrigacoes.map(obligation => (
                <li key={obligation.pk}>{obligation.descricao}</li>))}</ul>
            <ObligationForm ator={actor.pk} handleNewObligation={handleNewObligation} />
          </div>
        );
        break;
      case 2:
        return (
          <div>
            <ul className={styles.itemList}>
              {actor.sancoes.map(sanction => (
                <li key={sanction.pk}>{sanction.descricao}</li>))}</ul>
            <SanctionForm ator={actor.pk} handleNewSanction={handleNewSanction} />
          </div>
        );
        break;
      case 3:
        return (
          <div>
            <ul className={styles.itemList}>
              {actor.responsabilidades.map(responsability => (
                <li key={responsability.pk}>{responsability.descricao}</li>))}</ul>
            <ResponsabilityForm ator={actor.pk} handleNewResponsability={handleNewResponsability} />
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
      <ActorUpdateForm 
        actorId={actor.pk}
        projeto={actor.projeto}
        nome={actor.nome}
        handleUpdateActor={handleUpdateActor}
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

export default ActorView;