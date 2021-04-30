import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, TextField} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: '50%',
    border: "5px 5px 5px 5px solid white",
    fontSize: 25
  },
  iconButton: {
    padding: 10,
  },
  labelColor: {
    color:'#fff !important',
  },
  textfield: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white"
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white"
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white"
    },
    "& .MuiOutlinedInput-input": {
      color: "white"
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "white"
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "white"
    },
    "& .MuiInputLabel-outlined": {
      color: "white"
    },
    "&:hover .MuiInputLabel-outlined": {
      color: "white"
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "white"
    },
    width: '50%',
    fontSize: 25
  }
}));

function SeachEngine({ searchEngine }) {
  const [query, setQuery] = useState("")
  const classes = useStyles();

  const search = () => {
    let url = ""
    switch (searchEngine) {
      case "DUCKDUCKGO":
        url = `https://duckduckgo.com/?q=${query}`
        break;
      case "YAHOO":
        url = `https://search.yahoo.com/search?p=${query}`
        break;
      case "BING":
        url = `https://www.bing.com/search?q=${query}`
        break;
      case "GOOGLE":
      default:
        url = `https://www.google.com/search?q=${query}`
    }
    window.location.href = url;
  }

  return (
    <div className="searchEngine">
      <TextField 
        label="Search here!" 
        value={query} 
        className={classes.textfield}  
        onChange={ev => setQuery(ev.target.value)}
        variant="outlined"
        />
      <IconButton style={{color:'white'}} className={classes.iconButton} onClick={search}>
        <SearchIcon />
      </IconButton>   
    </div>
  );
}

export default SeachEngine;
