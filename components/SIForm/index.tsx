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
  projeto: yup.number().required('O projeto é obrigatório'),
  sistema: yup.number().required('O sistema é obrigatório'),
  nome: yup.string().required('O nome é obrigatório'),
};

interface Option {
  name: string;
  value:string;
}

// Shape of form values
interface FormValues {
  projeto: string;
  sistema: string;
  nome: string;
  options: Array<Option>;
  handleNewSystem: (data: Object) => null;
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

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <Card className={styles.card}>
          <CardContent>
            <TextField
              id="nome"
              label="Sistema Responsável"
              value={values.nome}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.nome ? errors.nome : ''}
              error={touched.nome && Boolean(errors.nome)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="projeto"
              label="Projeto"
              type="text"
              value={values.projeto}
              error={touched.projeto && Boolean(errors.projeto)}
              margin="dense"
              variant="outlined"
              disabled={true}
              fullWidth
            />
            <FormControl
              variant="outlined"
              className={styles.formControl}
              fullWidth
            >
              <InputLabel id="select-system-label">Sistema Relacionado</InputLabel>
              <Select
                id="sistema"
                labelId="select-system-label"
                value={values.sistema}
                label="Sistema Relacionado"
                onChange={(event) => setFieldValue('sistema', event.target.value)}
                onBlur={handleBlur}
                error={touched.sistema && Boolean(errors.sistema)}
              >
                {values?.options?.map((system) => (
                  <MenuItem key={system.value} value={system.value}>
                    {system.name}
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
  projeto: string;
  sistema: string;
  nome: string;
  options: Array<Option>;
  handleNewSystem: (data: Object) => null;
}

const Form = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: ({ projeto, sistema, nome, options, handleNewSystem }) => {
    return {
      projeto: projeto,
      sistema: sistema || '',
      nome: nome || '',
      options: options || [],
      handleNewSystem: handleNewSystem,
    };
  },

  validationSchema: yup.object().shape(validationsForm),

  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const { handleNewSystem } = props;

    setTimeout(() => {
      // submit to the server
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/sistemas/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setSubmitting(false);
          resetForm();
          handleNewSystem(data);
        });
    }, 1000);
  },
})(form);

export default Form;