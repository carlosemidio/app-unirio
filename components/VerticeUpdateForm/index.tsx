import React from 'react';
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
  projeto: yup.number().required('O projeto é obrigatório'),
  descricao: yup.string().required('O descricao é obrigatório'),
};

// Shape of form values
interface FormValues {
  verticeId?: string;
  projeto: string;
  descricao: string;
  handleUpdateVertice: (data: Object) => void;
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
          </CardContent>
          <CardActions className={styles.actions}>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Atualizar Vértice
            </Button>
            <Button color="secondary" onClick={values.handleCloseModal}>
              Cancelar
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};

interface MyFormProps {
  verticeId: string;
  projeto: string;
  descricao: string;
  handleUpdateVertice: (data: Object) => void;
  handleCloseModal: () => void;
}

const Form = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: ({ verticeId, projeto, descricao, handleUpdateVertice, handleCloseModal }) => {
    return {
      verticeId: verticeId || '',
      projeto: projeto,
      descricao: descricao || '',
      handleUpdateVertice: handleUpdateVertice,
      handleCloseModal: handleCloseModal
    };
  },

  validationSchema: yup.object().shape(validationsForm),

  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const { handleUpdateVertice } = props;

    setTimeout(() => {
      // submit to the server
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vertices/${values.verticeId}/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setSubmitting(false);
          resetForm();
          handleUpdateVertice(data);
        });
    }, 1000);
  },
})(form);

export default Form;