"use strict"

fetch('https://cat-fact.herokuapp.com/facts')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    document.getElementById("content").innerText = JSON.stringify(data[0])
  });