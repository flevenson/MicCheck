process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;
const config = require('../knexfile')['test'];
const database = require('knex')(config);
chai.use(chaiHttp);

