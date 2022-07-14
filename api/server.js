/**
 * The server entry point.
 * author - Christopher Evans, 30.05.2022
 *
 * This is where the main tie together of the whole api. Very little
 *  functionality sits here. This is just where modules get initiated and
 *  attached to the main process.
 */

const express = require('express')
const bodyParser = require('body-parser')
// const cors = require('cors')

const app = express()
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors())

const { CardsRouter } = require('./src/routes');

app.use('/cards', CardsRouter);

// The default route middleware, use to check connection to server and database.
app.get('/',
    async function(req, res){
        res.send('<h1>Elephant API</h1>')
    }
);

// Handle errors
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(400).send(err.message);
})

app.listen(port, () => console.log(`ElephantServer listening on port ${port}!`))
