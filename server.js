const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const path = require('path');

const cronConfig = require('./scheduler/config.js');
const cronScheduler = require('./scheduler');

cronScheduler.initCrons(cronConfig);

const app = express();

//Connect Database
connectDB();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//Init Middleware
app.use(express.json({ extended: false }));

var allowedOrigins = ['http://localhost:3000/', 'https://app.porchlight.art/'];

// app.use(cors({
// origin: function(origin, callback){
//     // allow requests with no origin
//     // (like mobile apps or curl requests)
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//     var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//     return callback(new Error(msg), false);
//     }
//     return callback(null, true);
// }
// }));
app.use(cors());

//app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/profile', require('./routes/api/profile'));
// app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/artists', require('./routes/api/artists'));
app.use('/api/hosts', require('./routes/api/hosts'));
app.use('/api/events', require('./routes/api/events'));
app.use('/api/uploads', require('./routes/api/uploads'));
app.use('/api/cloudinary', require('./routes/api/cloudinary'));

app.use(express.static('client/build'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
