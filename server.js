const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];
const database = require('knex')(config);

app.use(bodyParser.json())
app.set('port', process.env.PORT || 3000);

app.get('/api/v1/open_mic_performers', (request, response) => {
    database('signups')
        .select()
        .then(signups => {
            response.status(200).json(signups)
        })
        .catch((error) => {
            response.status(500).json({error})
        })
})

app.post('/api/v1/open_mic_performers', (request, response) => {
    const signup = request.body;

    for (let requiredParameter of ['name']) {
        if(!signup[requiredParameter]) {
            return response.status(422).send({
                error: `Expected format: { name: <STRING> } missing ${requiredParameter}`
            })
        }
    }
    database('signups')
        .insert(signup, 'id')
        .then(signup => {
            response.status(201).json('Performer Successfully Added')
        })
        .catch(error => {
            response.status(500).json({ error })
        })
})

app.delete('/api/v1/open_mic_performers/:name', (request, response) => {
    let { name } = request.params;
    name = name.replace(/\+/g, " ");

    database('signups')
        .where('name', name)
        .del()
        .then(signup => {
            if(signup === 0){
                response.status(404).json(`No signup '${name}' found in database`);
            } else {
                response.status(202).json(`Signup '${name}' successfully removed`);
            }
        })
        .catch(error => {
            response.status(500).json({ error: error.message})
        })
})

app.delete('/api/v1/open_mic_performers', (request, response) => {

    database('signups')
        .truncate()
        .then(signups => {
            response.status(202).json('Database successfully cleared');
        })
        .catch(error => {
            response.status(500).json({ error: error.message})
        })
})

app.listen(app.get('port'), () => {
    console.log(`MicCheck is running on ${app.get('port')}`)
})

module.exports = app;