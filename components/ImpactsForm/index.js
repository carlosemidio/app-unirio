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
  TextField
} from '@material-ui/core';
import * as yup from 'yup';

import styles from "./styles.module.scss";

const Form = ({ impact, handleImpactsChange, handleCloseImpactChanges }) => {
  return (
    <div className={styles.container}>
        <Card className={styles.card}>
            <CardContent>
                <TextField
                    id="width"
                    label="Width"
                    type="text"
                    value={impact?.width}
                    onChange={ event => handleImpactsChange('width', event.target.value) }
                    margin="dense"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="height"
                    label="Height"
                    type="text"
                    value={impact?.height}
                    onChange={ event => handleImpactsChange('height', event.target.value) }
                    margin="dense"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="color"
                    label="Text Color"
                    type="text"
                    value={impact?.color}
                    onChange={ event => handleImpactsChange('color', event.target.value) }
                    margin="dense"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="backgroundColor"
                    label="Background Color"
                    type="text"
                    value={impact?.backgroundColor}
                    onChange={ event => handleImpactsChange('backgroundColor', event.target.value) }
                    margin="dense"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="description"
                    label="Description"
                    value={impact?.description}
                    onChange={ event => handleImpactsChange('description', event.target.value) }
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    multiline
                />
            </CardContent>
            <CardActions className={styles.actions}>
                <Button type="submit" color="primary">
                    Salvar
                </Button>
                <Button color="secondary" onClick={handleCloseImpactChanges}>
                    Cancelar
                </Button>
            </CardActions>
        </Card>
    </div>
  );
};

export default Form;
