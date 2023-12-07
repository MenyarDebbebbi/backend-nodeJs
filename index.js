const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require('./routes/auth/index.js');
const userRoutes = require('./routes/users/index.js');
const courseRoutes = require('./routes/courses/index.js');

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(
    express.urlencoded({
        extended:true,
    })
);

app.use('/auth',authRoutes)
app.use('/users', userRoutes)
app.use('/courses', courseRoutes)

app.listen(PORT, () => {
    console.log('SERVER UP AND RUNNING ON PORT ',PORT)
});