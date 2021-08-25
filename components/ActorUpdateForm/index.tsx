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
import { FaEdit } from 'react-icons/fa';

import styles from "./styles.module.scss";

const validationsForm = {
  projeto: yup.number().required('O projeto é obrigatório'),
  nome: yup.string().required('O nome é obrigatório'),
};

// Shape of form values
interface FormValues {
  actorId?: string;
  projeto: string;
  nome: string;
  handleUpdateActor: (data: Object) => void;
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
              id="nome"
              label="Actor Name"
              value={values.nome}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.nome ? errors.nome : ''}
              error={touched.nome && Boolean(errors.nome)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
          </CardContent>
          <CardActions className={styles.actions}>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              <FaEdit 
                fontSize={32}
                title="Update system" />
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};

interface MyFormProps {
  actorId: string;
  projeto: string;
  nome: string;
  handleUpdateActor: (data: Object) => void;
  handleCloseModal: () => void;
}

const Form = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: ({ actorId, projeto, nome, handleUpdateActor, handleCloseModal }) => {
    return {
      actorId: actorId || '',
      projeto: projeto,
      nome: nome || '',
      handleUpdateActor: handleUpdateActor,
      handleCloseModal: handleCloseModal
    };
  },

  validationSchema: yup.object().shape(validationsForm),

  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const { handleUpdateActor } = props;

    setTimeout(() => {
      // submit to the server
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/atores/${values.actorId}/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setSubmitting(false);
          resetForm();
          handleUpdateActor(data);
        });
    }, 1000);
  },
})(form);

export default Form;