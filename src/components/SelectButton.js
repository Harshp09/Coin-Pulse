import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  selectbutton: {
    border: "1px solid gold",
    borderRadius: 5,
    padding: "10px 20px",
    fontFamily: "Montserrat",
    cursor: "pointer",
    backgroundColor: ({ selected }) => selected ? "gold" : "",
    color: ({ selected }) => selected ? "black" : "",
    fontWeight: ({ selected }) => selected ? 700 : 500,
    "&:hover": {
      backgroundColor: "gold",
      color: "black",
    },
    width: "22%",
  },
});

const SelectButton = ({ children, selected, onClick }) => {
  const classes = useStyles({ selected });

  return (
    <span className={classes.selectbutton} onClick={onClick}>
      {children}
    </span>
  );
};

export default SelectButton;
