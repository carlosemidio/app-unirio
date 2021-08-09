import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
} from '@material-ui/core';
import { withFormik, FormikProps } from 'formik';
import * as yup from 'yup';

import styles from "./styles.module.scss";

const validationsForm = {
  indicador: yup.string().required('O Rótulo é obrigatório'),
  descricao: yup.string().required('A descrição é obrigatória'),
  criterio_accountability: yup.string().required('O Criterio accountability é obrigatório'),
};

// Shape of form values
interface FormValues {
  criteriaType: boolean;
  indicador: string;
  descricao: string;
  nome_iso: string;
  criterio_accountability: string;
  handleNewCriteria: (data: Object) => null;
}

const form = (props: FormikProps<FormValues>) => {
  const {
    values,
    touched,
    errors,
    isSubmitting,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  } = props;

  const options = [
    {
      name: 'Engajamento', 
      value: 'Engajamento'
    },
    {
      name: 'Gerenciamento', 
      value: 'Gerenciamento'
    },
    {
      name: 'Regulação', 
      value: 'Regulação'
    }
  ];

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <Card className={styles.card}>
          <CardContent>
            <TextField
              id="indicador"
              label="Rótulo do Indicador de Accountability"
              value={values.indicador}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.indicador ? errors.indicador : ''}
              error={touched.indicador && Boolean(errors.indicador)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="descricao"
              label="Descrição do Indicador de Accountability"
              value={values.descricao}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.descricao ? errors.descricao : ''}
              error={touched.descricao && Boolean(errors.descricao)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            {
              !values.criteriaType ? <TextField
                id="nome_iso"
                label="Regra ISO"
                value={values.nome_iso}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.nome_iso ? errors.nome_iso : ''}
                error={touched.nome_iso && Boolean(errors.nome_iso)}
                margin="dense"
                variant="outlined"
                fullWidth
              /> : <></> 
            }
            <FormControl
              variant="outlined"
              className={styles.formControl}
              fullWidth
            >
              <InputLabel id="select-system-label">Criterio accountability</InputLabel>
              <Select
                id="criterio_accountability"
                labelId="select-system-label"
                value={values.criterio_accountability}
                label="Criterio accountability"
                onChange={(event) => setFieldValue('criterio_accountability', event.target.value)}
                onBlur={handleBlur}
                error={touched.criterio_accountability && Boolean(errors.criterio_accountability)}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
          <CardActions className={styles.actions}>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Enviar
            </Button>
            <Button color="secondary" onClick={handleReset}>
              Cancelar
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};

interface MyFormProps {
  criteriaType: boolean;
  indicador: string;
  descricao: string;
  nome_iso: string;
  criterio_accountability: string;
  handleNewCriteria: (data: Object) => null;
}

const Form = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: ({ criteriaType, indicador, descricao, nome_iso, criterio_accountability, handleNewCriteria }) => {
    return {
      criteriaType: criteriaType,
      indicador: indicador,
      descricao: descricao || '',
      nome_iso: nome_iso || '',
      criterio_accountability: criterio_accountability || '',
      handleNewCriteria: handleNewCriteria,
    };
  },

  validationSchema: yup.object().shape(validationsForm),

  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const { handleNewCriteria } = props;

    setTimeout(() => {
      // submit to the server
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/criterios-${values.criteriaType ? 'ux' : 'iso' }/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setSubmitting(false);
          resetForm();
          handleNewCriteria(data);
        });
    }, 1000);
  },
})(form);

export default Form;