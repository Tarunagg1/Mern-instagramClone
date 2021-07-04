require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/db')

const app = express();
app.use(express.json());
app.use(cors())

app.use(express.static('public'));

app.use(require('./routes/authRoute'))
app.use(require('./routes/postRoute'))
app.use(require('./routes/user'))


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log("Server listning at",PORT);
})