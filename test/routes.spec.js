process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should()
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;
const config = require('../knexfile')['test'];
const database = require('knex')(config);

chai.use(chaiHttp);

describe('Server file', () => {

    // before(done => {
    //     database.migrate
    //       .rollback()
    //       .then(() => database.migrate.latest())
    //       .then(() => database.seed.run())
    //       .then(() => done())
    //       .catch(error => {
    //         throw error;
    //       })
    //       .done();
    //   });

    beforeEach(done => {
        database.migrate
            .rollback()
            .then(() => database.migrate.latest())
            .then(() => database.seed.run())
            .then(() => done());
    });

    after(done => {
        database.migrate
            .rollback()
            .then(() => database.migrate.latest())
            .then(() => console.log('Testing complete. Db rolled back'))
            .then(() => done());
    });

    it('should return a 404 for a route that does not exist', done => {
        chai
            .request(app)
            .get('/fakeroute')
            .end((error, response) => {
                expect(response).to.have.status(404);
                done();
            })
    })

    describe('/api/v1/performers', () => {
        it('get request should have a 200 status', done => {
            chai
                .request(app)
                .get('/api/v1/open_mic_performers')
                .end((error, response) => {
                    expect(response).to.have.status(200);
                    done();
                });
        });

        it('get request should return data as JSON', done => {
            chai
                .request(app)
                .get('/api/v1/open_mic_performers')
                .end((error, response) => {
                    expect(response).to.be.json;
                    done();
                })
        });

        it('get request should return an array with all performers', done => {
            chai
                .request(app)
                .get('/api/v1/open_mic_performers')
                .end((error, response) => {
                    expect(response.body).to.be.a('array');
                    expect(response.body.length).to.equal(3);
                    let performerNames = response.body.map(performer => performer.name);
                    expect(performerNames.includes('Christie Buchele')).to.equal(true);
                    expect(performerNames.includes('Janae Burris')).to.equal(true);
                    expect(performerNames.includes('Rachel Weeks')).to.equal(true);
                    done();
                })
        })

        it('post request should correctly add a new performer', done => {
            const newPerformer = {
                name: 'Ben Kronberg'
            }

            chai
                .request(app)
                .post('/api/v1/open_mic_performers')
                .send(newPerformer)
                .end((error, response) => {
                    expect(response).to.have.status(201);
                    expect(response.body).to.equal('Performer Successfully Added')
                    done()
                })
        })

        it('post request should return error message if missing name', done => {
            const newPerformer = {

            }

            chai
                .request(app)
                .post('/api/v1/open_mic_performers')
                .send(newPerformer)
                .end((error, response) => {
                    expect(response).to.have.status(422);
                    expect(response.error.text).to.equal(`{"error":"Expected format: { name: <STRING> } missing name"}`)
                    done()
                })
        })
    })
    process.removeAllListeners()
})