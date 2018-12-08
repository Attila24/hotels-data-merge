import 'mocha';
import * as chai from 'chai';
import axios from 'axios';
import chaiHttp = require("chai-http");

import * as s1Mock from './mock/gdmqa.json';
import * as s2Mock from './mock/1fva3m.json';
import * as s3Mock from './mock/j6kzm.json';
import MockAdapter from "axios-mock-adapter";
import {Hotel} from "../app/dto/hotel.dto";

const adapter = new MockAdapter(axios);

chai.use(chaiHttp);
const expect = chai.expect;

describe('POST /hotels', () => {
    let server;

    beforeEach(() => {
        server = require('../app/server');

        adapter.onGet('https://api.myjson.com/bins/gdmqa').reply(200, s1Mock);
        adapter.onGet('https://api.myjson.com/bins/1fva3m').reply(200, s2Mock);
        adapter.onGet('https://api.myjson.com/bins/j6kzm').reply(200, s3Mock);
    });

    afterEach(() => {
        adapter.restore();
    });

    it('should return a single hotel by ID', () => {
        chai.request(server).post('/hotels')
                .type('json')
                .send({ids: ['iJhz']})
            .then(res => {
                expect(res.body).to.be.not.undefined;
                const body = res.body as Hotel[];
                expect(body.length).to.eq(1);
                const hotel = body[0];
                expect(hotel.amenities).to.not.be.undefined;
                expect(hotel.name).to.not.be.undefined;
                expect(hotel.bookingConditions).to.not.be.undefined;
                expect(hotel.bookingConditions.length).to.eq(5);
                expect(hotel.destinationId).to.not.be.undefined;
                expect(hotel.images).to.not.be.undefined;
                expect(hotel.description).to.not.be.undefined;
            });
    });

    it('should return multiple hotels by IDs', () => {
       chai.request(server).post('/hotels')
               .type('json')
               .send({ids: ['SjyX', 'iJhz']})
               .then(res => {
                   expect(res.body).to.be.not.undefined;
                   const body = res.body as Hotel[];
                   expect(body.length).to.eq(2);
               });
    });

    it('should return multiple hotels by destination IDs', () => {
        chai.request(server).post('/hotels')
                .type('json')
                .send({destination: 5432})
                .then(res => {
                    expect(res.body).to.be.not.undefined;
                    const body = res.body as Hotel[];
                    expect(body.length).to.eq(2);
                });
    });

    it('should return empty array if hotels are not found', () => {
        chai.request(server).post('/hotels')
                .type('json')
                .send({ids: ['abc', 'def']})
                .then(res => {
                    expect(res.body).to.be.not.undefined;
                    const body = res.body as Hotel[];
                    expect(body.length).to.eq(0);
                });
    });

    it('should throw an error if no parameters were provided', () => {
        chai.request(server).post('/hotels')
                .type('json')
                .send({})
                .then(res => {
                    expect(res.body).to.be.not.undefined;
                    expect(res.status).to.eq(400);
                    expect(res.body.error).to.be.not.undefined;
                });
    });

    it('should throw an error if some of the hotel ID parameters are not string', () => {
        chai.request(server).post('/hotels')
                .type('json')
                .send({ids: ['abc', 123]})
                .then(res => {
                    expect(res.body).to.be.not.undefined;
                    expect(res.status).to.eq(400);
                    expect(res.body.error).to.be.not.undefined;
                });
    });

    it('should throw an error if destination ID is not number', () => {
        chai.request(server).post('/hotels')
                .type('json')
                .send({destination: 'abc'})
                .then(res => {
                    expect(res.body).to.be.not.undefined;
                    expect(res.status).to.eq(400);
                    expect(res.body.error).to.be.not.undefined;
                });
    });
});
