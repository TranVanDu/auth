require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const requireLogin = require('./middleware/requireLogin');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { MONGO_URI } = require('./config/key');

//connect mongo
// mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
// });

//sử dụng socket.io

const connect = mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
    console.log('connected to mongo success');
});

mongoose.connection.on('error', (error) => {
    console.log('error connected to mongo', error);
});
app.use(cors());
app.use(morgan('dev'));

// Allow the app to accept JSON on req.body
//app.use(express.json())
//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());

// app.get("/", (req, res) => res.json("👌hello word! Welcom my friend"));
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/mail'));
app.use('/api/users', requireLogin, require('./routes/user'));
app.use('/api/posts', requireLogin, require('./routes/post'));
app.use('/api/chat', requireLogin, require('./routes/chat'));
app.use('/uploads', express.static('uploads'));

io.on('connect', (socket) => {
    console.log('connect');
});
// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    // All the javascript and css files will be read and served from this folder
    app.use(express.static('client/build'));
    const path = require('path');
    // index.html for all page routes    html or routing and naviagtion
    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(__dirname, '../client', 'build', 'index.html')
        );
    });
}

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
