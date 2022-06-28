const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Concert = require('../../../models/concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/concerts', () => {
  before(async () => {
    const testConcertOne = new Concert({_id: '62a5c993a3e1138136ca06d5', performer: 'Performer #1', genre: 'rap', price: 12, day: 1, image: 'img/1.jpg'});
    await testConcertOne.save();

    const testConcertTwo = new Concert({_id: '62a5c993a3e1138136ca06d4', performer: 'Performer #2', genre: 'pop', price: 9, day: 2, image: 'img/2.jpg'});
    await testConcertTwo.save();

    const testConcertThree = new Concert({_id: '62a5ead9cede2cbc4178da6e', performer: 'Performer #2', genre: 'rock', price: 23, day: 3, image: 'img/3.jpg'});
    await testConcertThree.save();
  });

  it('/performer/:performer should return concerts array by :performer', async () => {
    const res = await request(server).get('/api/concerts/performer/Performer #2');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length);
  });

  it('/genre/:genre should return concerts array by :genre', async () => {
    const res = await request(server).get('/api/concerts/genre/rap');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(1);
  });

  it('/price/:price_min/:price_max should return concerts array by :price', async () => {
    const res = await request(server).get('/api/concerts/price/10/20');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(1);
  });

  it('/day/:day should return concerts array by :day', async () => {
    const res = await request(server).get('/api/concerts/day/1');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.equal(1);
  });

  after(async () => {
    await Concert.deleteMany();
  });
});
