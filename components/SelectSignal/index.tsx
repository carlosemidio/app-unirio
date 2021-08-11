import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
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
  item: yup.string().required('Selecione uma opção'),
};

interface Option {
  name: string;
  value:string;
}

// Shape of form values
interface FormValues {
  item: string;
  handleSelectItem: (signal: string) => null;
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
      name: 'Positivo', 
      value: '+'
    },
    {
      name: 'Negativo', 
      value: '-'
    },
    {
      name: 'Default', 
      value: ''
    }
  ];

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <Card className={styles.card}>
          <CardContent>
            <FormControl
              variant="outlined"
              className={styles.formControl}
              fullWidth
            >
              <InputLabel id="select-item-label">Selecione</InputLabel>
              <Select
                id="item"
                labelId="select-item-label"
                value={values.item}
                label="Selecionar"
                onChange={(event) => setFieldValue('item', event.target.value)}
                onBlur={handleBlur}
                error={touched.item && Boolean(errors.item)}
              >
                {options?.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
          <CardActions className={styles.actions}>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Selecionar
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
  item: string;
  handleSelectItem: (signal: string) => null;
}

const Form = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: ({ item, handleSelectItem }) => {
    return {
      item: item || '',
      handleSelectItem: handleSelectItem,
    };
  },

  validationSchema: yup.object().shape(validationsForm),

  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const { handleSelectItem } = props;
    
    setTimeout(() => {
      setSubmitting(false);
      resetForm();
      handleSelectItem(values.item);
    }, 400);
  },
})(form);

export default Form;
