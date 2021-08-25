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
  descricao: yup.string().required(),
};

interface ResponsabilityProps {
  pk: string;
  descricao: string;
}

// Shape of form values
interface FormValues {
  sistema?: string;
  ator?: string;
  vertice?: string;
  descricao?: string;
  handleNewResponsability: (data: ResponsabilityProps) => void;
  handleCloseModal: () => void;
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
              label="Description"
              value={values.descricao}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.descricao ? errors.descricao : ''}
              error={touched.descricao && Boolean(errors.descricao)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
          </CardContent>
          <CardActions className={styles.actions}>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Add
            </Button>
            <Button color="secondary" onClick={values.handleCloseModal}>
              Cancel
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
  handleNewResponsability: (data: ResponsabilityProps) => void;
  handleCloseModal: () => void;
}

const Form = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: ({ sistema, ator, vertice, descricao, handleNewResponsability, handleCloseModal }) => {
    return {
      sistema: sistema || '',
      ator: ator || '',
      vertice: vertice || '',
      descricao: descricao || '',
      handleNewResponsability: handleNewResponsability,
      handleCloseModal: handleCloseModal
    };
  },

  validationSchema: yup.object().shape(validationsForm),

  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const { handleNewResponsability } = props;

    setTimeout(() => {
      // submit to the server
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/responsabilidades/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setSubmitting(false);
          resetForm();
          handleNewResponsability(data);
        });
    }, 1000);
  },
})(form);

export default Form;