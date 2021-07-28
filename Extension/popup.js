
$("#t").click(() => {
  fetch("http://localhost:5000/api",{
    mode: 'no-cors',
  headers: {
    'Access-Control-Allow-Origin':'*',
    "accepts":"application/json"
  }
  })
  
    .then(res => console.log(res) )
    .then(data => console.log(data))
})