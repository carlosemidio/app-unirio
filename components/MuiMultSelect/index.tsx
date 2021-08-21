import React from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    width: '100%',
    maxWidth: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 320,
    },
  },
};

function getStyles(itemID: string, items_selected:string[], theme:Theme) {
  return {
    fontWeight:
      items_selected.indexOf(itemID) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface ItemProps {
  name: string;
  value: string;
}

interface Props {
  items: Array<ItemProps>;
  items_selected: string[];
  field: string;
  label: string;
  onChangeField: (field: string, value: string[]) => void;
}

const MultipleSelect: React.FC<Props> = ({ items, items_selected, field, label, onChangeField }) => {
  const classes = useStyles();
  const theme = useTheme();
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChangeField(field, event.target.value as string[]);
  };

  let itemsNames: any = [];

  for (let index = 0; index < items.length; index++) {
    itemsNames[items[index].value] = items[index].name;
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="items-label">{label}</InputLabel>
        <Select
          labelId="items-label"
          id="items"
          multiple
          value={items_selected}
          onChange={handleChange}
          input={<Input id="select-items" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {(selected as string[]).map((value) => (
                <Chip
                  key={value}
                  label={itemsNames[value]}
                  className={classes.chip}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {items.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
              style={getStyles(item.value, items_selected, theme)}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultipleSelect;