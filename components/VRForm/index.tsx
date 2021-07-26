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
  descricao: yup.string().required('A descrição é obrigatória'),
};

// Shape of form values
interface FormValues {
  projeto: string;
  tarefa: string;
  options: Array<Option>;
  descricao: string;
  handleNewVR: (data: Object) => null;
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
              id="descricao"
              label="Descrição do Vértice de Responsabilidade"
              value={values.descricao}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.descricao ? errors.descricao : ''}
              error={touched.descricao && Boolean(errors.descricao)}
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
              <InputLabel id="select-system-label">Tarefa Relacionada</InputLabel>
              <Select
                id="tarefa"
                labelId="select-system-label"
                value={values.tarefa}
                label="Tarefa Relacionada"
                onChange={(event) => setFieldValue('tarefa', event.target.value)}
                onBlur={handleBlur}
                error={touched.tarefa && Boolean(errors.tarefa)}
              >
                {values?.options?.map((tarefa) => (
                  <MenuItem key={tarefa.value} value={tarefa.value}>
                    {tarefa.name}
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

interface Option {
  name: string;
  value:string;
}

interface MyFormProps {
  projeto: string;
  tarefa: string;
  options: Array<Option>;
  descricao: string;
  handleNewVR: (data: Object) => null;
}

const Form = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: ({ projeto, tarefa, options, descricao, handleNewVR }) => {
    return {
      projeto: projeto,
      descricao: descricao || '',
      tarefa: tarefa || '',
      options: options || [],
      handleNewVR: handleNewVR,
    };
  },

  validationSchema: yup.object().shape(validationsForm),

  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const { handleNewVR } = props;

    setTimeout(() => {
      // submit to the server
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vertices/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setSubmitting(false);
          resetForm();
          handleNewVR(data);
        });
    }, 1000);
  },
})(form);

export default Form;