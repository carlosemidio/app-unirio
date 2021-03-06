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
  options: Array<Option>;
  item: string;
  type: string;
  handleSelectItem: (id: string, type: string) => null;
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
            <FormControl
              variant="outlined"
              className={styles.formControl}
              fullWidth
            >
              <InputLabel id="select-item-label">Select</InputLabel>
              <Select
                id="item"
                labelId="select-item-label"
                value={values.item}
                label="Select"
                onChange={(event) => setFieldValue('item', event.target.value)}
                onBlur={handleBlur}
                error={touched.item && Boolean(errors.item)}
              >
                {values?.options?.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
          <CardActions className={styles.actions}>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Select
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
  options: Array<Option>;
  item: string;
  type: string;
  handleSelectItem: (id: string, type: string) => null;
  handleCloseModal: () => void;
}

const Form = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: ({ options, item, type, handleSelectItem, handleCloseModal }) => {
    return {
      options: options || [],
      item: item || '',
      type: type || '',
      handleSelectItem: handleSelectItem,
      handleCloseModal: handleCloseModal
    };
  },

  validationSchema: yup.object().shape(validationsForm),

  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const { handleSelectItem } = props;
    
    setTimeout(() => {
      setSubmitting(false);
      resetForm();
      handleSelectItem(values.item, values.type);
    }, 400);
  },
})(form);

export default Form;
