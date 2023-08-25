require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const authRoute = require('./routes/user');
const {notFound,errorHandlerMiddleware}=require("./middleware");

app.use(express.json());
app.use('/api/userauth', authRoute);

app.get("/", (req, res) => {
    res.send("welcome to server");
})

//connection to database
mongoose.set("strictQuery", false);
const url = process.env.MONGO_URL;
mongoose.connect(url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false
    })
    .then(() => { console.log("Connected to MongoDB Atlas") })
    .catch((err) => console.error(`${err}`));


// error handler
app.use(notFound);
app.use(errorHandlerMiddleware);

// connection to port
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`PORT : ${port}`);
})