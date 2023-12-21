require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8000;

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended: true,limit:'16kb'}));



const whitelist = ['http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));


app.listen(PORT, () => {
    console.log(`server started listening on port - ${PORT}`);
})
