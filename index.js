require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const { userRoute } = require('./routes/user');
const {notFound,errorHandlerMiddleware}=require("./middleware");

app.use(express.json());
app.use('/api/userauth', userRoute);
app.use('/api/bugauth', bugRoute);

app.get("/", (req, res) => {
    res.send("welcome to server");
})

//connection to database
mongoose.set("strictQuery", false);
const url = process.env.MONGO_URL_ADMIN;
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