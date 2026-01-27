const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('express çalışıyor');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
