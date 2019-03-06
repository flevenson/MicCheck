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
    before(done => {
        database.migrate
            .rollback()
            .then(() => database.migrate.latest())
            .then(() => database.seed.run())
            .then(() => done())
            .catch(error => {
                throw error;
            })
            .done();
    })

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
            .then(() => console.log('Testing complete. Db rolled back'))
            .then(() => done());
    })


})