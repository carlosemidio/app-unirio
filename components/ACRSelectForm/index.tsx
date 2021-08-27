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
import { Description } from '@material-ui/icons';

const validationsForm = {
  item: yup.string().required('Selecione uma opção'),
};

interface Option {
  name: string;
  value:string;
  criterio_accountability:string;
  description: string;
}

// Shape of form values
interface FormValues {
  options: Array<Option>;
  item: string;
  type: string;
  handleSelectItem: (id: string, type: string) => null;
  handleCloseModal: () => void;
}

const ACRForm = (props: FormikProps<FormValues>) => {
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

  const criterias = [
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

  const [criteria, setCriteria] = useState('Engajamento');
  const [description, setDescription] = useState('');
  
  const getDescription = (value:string) => {
    const _description = values.options.filter(option => (option.value == value))[0];

    setDescription(_description?.description as string);
  }

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
              <InputLabel id="select-item-label">Criteria</InputLabel>
              <Select
                id="item"
                labelId="select-item-label"
                value={criteria}
                label="Criteria"
                onChange={(event) => {
                  setDescription('');
                  setCriteria(event.target.value as string);
                }}
                onBlur={handleBlur}
                error={touched.item && Boolean(errors.item)}
              >
                {criterias.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                onChange={event => { 
                  setFieldValue('item', event.target.value);
                  getDescription(event.target.value as string);
                }}
                onBlur={handleBlur}
                error={touched.item && Boolean(errors.item)}
              >
                {values?.options?.map((item) => {
                  if (item.criterio_accountability == criteria) {
                    return (
                      <MenuItem key={item.value} value={item.value}>
                        {item.name}
                      </MenuItem>
                    )
                  }
                })}
              </Select>
            </FormControl>
            <div className={styles.description}>{description}</div>
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
})(ACRForm);

export default Form;
