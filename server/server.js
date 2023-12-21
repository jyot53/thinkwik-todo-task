require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 8000;
const {connectDB} = require('./database/config');

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended: true,limit:'16kb'}));
app.use(cookieParser());

const whitelist = ['http://localhost:3000']
const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
    origin:'*'
}
app.use(cors(corsOptions));


const userRoutes = require('./routes/user.route');
const todoRoutes = require('./routes/todo.route');
const {verifyJWT} = require('./middlewares/auth.middleware');
app.use('/api/users',userRoutes);
app.use('/api/todos',verifyJWT,todoRoutes);

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server started listening on port - ${PORT}`);
    });
}).catch((err) => {
    console.log("MONGO Database connection failed !!! ", err);
})
