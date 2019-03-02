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
        .catch((error) => {
            response.status(500).json({error})
        })
})

app.post('/api/v1/open_mic_performers', (request, response) => {
    const performer = request.body;

    for (let requiredParameter of ['name']) {
        if(!performer[requiredParameter]) {
            return response.status(422).send({
                error: `Expected format: { name: <STRING> } missing ${requiredParameter}`
            })
        }
    }
    database('performers').insert(performer, 'id')
        .then(performer => {
            response.status(201).json({id: performer[0]})
        })
        .catch(error => {
            response.status(500).json({ error })
        })
})

app.delete('/api/v1/open_mic_performers/:name', (request, response) => {
    let { name } = request.params;
    name = name.replace(/\+/g, " ");

    database('performers')
        .where('name', name)
        .del()
        .then(performer => {
            if(performer === 0){
                response.status(404).json(`No performer '${name}' found in database`);
            } else {
                response.status(202).json(`Performer '${name}' successfully removed`);
            }
        })
        .catch(error => {
            response.status(500).json({ error: error.message})
        })
})

app.listen(app.get('port'), () => {
    console.log(`MicCheck is running on ${app.get('port')}`)
})