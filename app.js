// Import required dependencies
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const useragent = require('express-useragent')
const mongoose = require('mongoose')

// create an instance of express and instantiate other dependencies
const app = module.exports = express();
app.use(bodyParser.json())
app.use(cors())
app.use(useragent.express())
const shortUrl = require('./models/shortUrl')

// connect to database
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/shortUrls', { useNewUrlParser: true });



// Allows access to static pages
app.use(express.static(__dirname + '/public'))


// creates the database entry
app.get('new/:urlToShorten(*)', (req, res, next) => {
    let { urlToShorten } = req.params;
    // Regex for url
    let expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    let regex = expression;
    if (regex.text(urlToShorten) === true) {
        let short = Math.floor(Math.random() * 100000).toString();

        let data = new shortUrl(
            {
                originalUrl: urlToShorten,
                shorterUrl: short
            }
        );
        data.save(err => {
            if (err) {
                return res.send("Error saving to database")
            }
        });
        return res.json(data)

    }
    let data = new shortUrl({
        originalUrl: 'urlToShorten does not match',
        shorterUrl: 'InvalidURl'
    })
    return res.json({ data })
});

app.post('/api/shorturl/new', function (req, res, next) {


    res.json({});
});


// Query databse and foward to original Url


// process.env.PORT is for heroku
app.listen(process.env.PORT || 3000, () => console.log("Listening to Port 3000"));