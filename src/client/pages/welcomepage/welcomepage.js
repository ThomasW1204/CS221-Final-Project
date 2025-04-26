const storedData = localStorage.getItem('myData');
const parsedData = JSON.parse(storedData);
console.log(parsedData.Set);
console.log(parsedData);