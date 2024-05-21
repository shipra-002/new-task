const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/routes.js');

const { default: mongoose } = require('mongoose');
const app = express();
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

    mongoose.connect("mongodb+srv://shipraarora036:CPOgC9iaegZQHY8S@cluster0.8hdtc3g.mongodb.net/new-tasks", {    
    
useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});