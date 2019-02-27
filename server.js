const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];
const database = require('knex')(config);

app.use(bodyParser.json())
app.set('port', process.env.PORT || 3000);

app.get('/api/v1/open_mic_performers', (request, response) => {
    database('performers')
        .select()
        .then(performers => {
            response.status(200).json(performers)
        })
})