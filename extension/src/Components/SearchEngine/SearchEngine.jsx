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
  },
  iconButton: {
    padding: 10,
  },
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
        id="standard-basic" 
        label="Search here!" 
        value={query} 
        className={classes.input}  
        onChange={ev => setQuery(ev.target.value)}/>
      <IconButton style={{color:'white'}} className={classes.iconButton} onClick={search}>
        <SearchIcon />
      </IconButton>   
    </div>
  );
}

export default SeachEngine;
