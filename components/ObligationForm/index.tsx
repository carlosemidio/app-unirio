import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
} from '@material-ui/core';
import { withFormik, FormikProps } from 'formik';
import * as yup from 'yup';

import styles from "./styles.module.scss";

const validationsForm = {
  sistema: yup.number(),
  ator: yup.number(),
  vertice: yup.number(),
  descricao: yup.string().required('A descrição é obrigatória'),
};

interface ObligationProps {
  pk: string;
  descricao: string;
}

// Shape of form values
interface FormValues {
  sistema?: string;
  ator?: string;
  vertice?: string;
  descricao?: string;
  handleNewObligation: (data: ObligationProps) => void;
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
              label="Descrição"
              value={values.descricao}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.descricao ? errors.descricao : ''}
              error={touched.descricao && Boolean(errors.descricao)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            {(values.sistema != '') ?
              <TextField
                id="sistema"
                label="Sistema"
                type="text"
                value={values.sistema}
                error={touched.sistema && Boolean(errors.sistema)}
                margin="dense"
                variant="outlined"
                disabled={true}
                fullWidth
              />: <></>
            }
            {(values.ator != '') ?
              <TextField
                id="ator"
                label="Ator"
                type="text"
                value={values.ator}
                error={touched.ator && Boolean(errors.ator)}
                margin="dense"
                variant="outlined"
                disabled={true}
                fullWidth
              />: <></>
            }
            {(values.vertice != '') ?
              <TextField
                id="vertice"
                label="Vértice"
                type="text"
                value={values.vertice}
                error={touched.vertice && Boolean(errors.vertice)}
                margin="dense"
                variant="outlined"
                disabled={true}
                fullWidth
              />: <></>
            }
          </CardContent>
          <CardActions className={styles.actions}>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Adicionar Obrigação
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
  sistema?: string;
  ator?: string;
  vertice?: string;
  descricao?: string;
  handleNewObligation: (data: ObligationProps) => void;
}

const Form = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: ({ sistema, ator, vertice, descricao, handleNewObligation }) => {
    return {
      sistema: sistema || '',
      ator: ator || '',
      vertice: vertice || '',
      descricao: descricao || '',
      handleNewObligation: handleNewObligation,
    };
  },

  validationSchema: yup.object().shape(validationsForm),

  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const { handleNewObligation } = props;

    setTimeout(() => {
      // submit to the server
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/obrigacoes/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setSubmitting(false);
          resetForm();
          handleNewObligation(data);
        });
    }, 1000);
  },
})(form);

export default Form;