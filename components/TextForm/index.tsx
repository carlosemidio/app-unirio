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
  descricao: yup.string().required('A descrição é obrigatória'),
};

// Shape of form values
interface FormValues {
  descricao: string;
  handleNewText: (data: Object) => null;
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
              label="Text"
              value={values.descricao}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.descricao ? errors.descricao : ''}
              error={touched.descricao && Boolean(errors.descricao)}
              margin="dense"
              variant="outlined"
              fullWidth
              multiline
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
  descricao: string;
  handleNewText: (data: Object) => null;
  handleCloseModal: () => void;
}

const Form = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: ({ descricao, handleNewText, handleCloseModal }) => {
    return {
      descricao: descricao || '',
      handleNewText: handleNewText,
      handleCloseModal: handleCloseModal
    };
  },

  validationSchema: yup.object().shape(validationsForm),

  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const { handleNewText } = props;

    setTimeout(() => {
      setSubmitting(false);
      resetForm();
      handleNewText(values.descricao);
    }, 1000);
  },
})(form);

export default Form;