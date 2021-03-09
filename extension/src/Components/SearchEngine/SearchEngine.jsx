import { useState } from 'react';

function SeachEngine({ searchEngine }) {
  const [query, setQuery] = useState("")

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
      <input type="text" name="search" placeholder="Search here!" value={query} onChange={ev => setQuery(ev.target.value)} />
      <button onClick={search}>search</button>
    </div>
  );
}

export default SeachEngine;
