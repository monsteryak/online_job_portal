const mongoose = require("mongoose");

const conn_str = "mongodb://localhost:27017/test";


mongoose.connect(conn_str, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log("Connected successfully..."))
    .catch((error) => console.log(error));