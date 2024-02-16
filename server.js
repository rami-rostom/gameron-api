require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./app/router/router');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
