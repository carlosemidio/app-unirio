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
  name: yup.string().required('O nome é obrigatório'),
  email: yup
    .string()
    .email('Informe um email válido')
    .required('O email é obrigatório'),
  company: yup.string(),
  phone: yup
    .string()
    .min(14, 'O telefone precisa ter pelo menos 8 caracteres')
    .max(15, 'O telefone precisa ter no máximo 9 caracteres')
    .required('Informe um telefome'),
  value: yup.string().required('Informe um valor'),
};

// Shape of form values
interface FormValues {
  name?: string;
  cpf?: string;
  email?: string;
  company?: string;
  phone?: string;
  value?: string;
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

  const [mask, setMask] = useState('(99) 99999-9999');

  const options = [
    // {
    //   value: '32d70bcb-239a-4a14-97d5-b086cf8ee15b',
    //   name: 'R$ 5,00',
    // },
    // {
    //   value: 'e459ca85-1f81-4018-b4b9-1f177de34532',
    //   name: 'R$ 10,00',
    // },
    {
      value: 'R$ 20,00',
      name: 'R$ 20,00',
    },
    {
      value: 'R$ 50,00',
      name: 'R$ 50,00',
    },
    {
      value: 'R$ 100,00',
      name: 'R$ 100,00',
    },
    {
      value: 'R$ 200,00',
      name: 'R$ 200,00',
    },
    {
      value: 'R$ 300,00',
      name: 'R$ 300,00',
    },
  ];

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <Card className={styles.card}>
          <CardContent>
            <TextField
              id="name"
              label="Nome"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.name ? errors.name : ''}
              error={touched.name && Boolean(errors.name)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="cpf"
              label="CPF"
              type="cpf"
              inputProps={{
                minLength: 11,
                maxLength: 11,
              }}
              value={values.cpf}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.cpf ? errors.cpf : ''}
              error={touched.cpf && Boolean(errors.cpf)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.email ? errors.email : ''}
              error={touched.email && Boolean(errors.email)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="company"
              label="Empresa"
              value={values.company}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.company ? errors.company : ''}
              error={touched.company && Boolean(errors.company)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <FormControl
              variant="outlined"
              className={styles.formControl}
              fullWidth
            >
              <InputLabel id="select-category-label">Valor</InputLabel>
              <Select
                id="value"
                labelId="select-category-label"
                value={values.value}
                label="Valor"
                onChange={(event) => setFieldValue('value', event.target.value)}
                onBlur={handleBlur}
                error={touched.value && Boolean(errors.value)}
              >
                {options.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.name}
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
  name?: string;
  cpf?: string;
  email?: string;
  company?: string;
  phone?: string;
  value?: string;
}

const Form = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: ({ name, cpf, email, company, phone, value }) => {
    return {
      name: name || '',
      cpf: cpf || '',
      email: email || '',
      company: company || '',
      phone: phone || '',
      value: value || '',
    };
  },

  validationSchema: yup.object().shape(validationsForm),

  handleSubmit: (values, { setSubmitting, resetForm }) => {
    setTimeout(() => {
      // submit to the server
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/doador`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setSubmitting(false);
          resetForm();
          alert(data.message);
        });
    }, 1000);
  },
})(form);

export default Form;