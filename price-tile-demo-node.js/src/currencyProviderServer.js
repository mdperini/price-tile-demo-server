'use strict'

const Joi = require('@hapi/joi');
const uuidv1 = require('uuid/v1');

const currencies = require('./data/currencies');
var _server;

function getCurrency(symbol) {
    return currencies.find((a) => a.symbol.toLowerCase() === symbol.toLowerCase());        
}

function init(server) {
    console.log('>>> currency provider server init');
    _server = server;
    server.route({
        method: 'GET',
        path: '/currencies',
        handler: (request, h) => {
            console.log('>>> currencies request');
            return currencies.map( currency => {
                currency['key'] = uuidv1();
                return currency;
            });
        },
        options: {
            description: 'Get currencies',
            tags: ['api'],
            validate: {
                headers: {
                    userid: Joi.string().required()
                },
                options: {
                    allowUnknown: true
                }
            }

        }
    });

    server.route({
        method: 'GET',
        path: '/currencies/{currency}',
        handler: (request, h) => {
            let currency = getCurrency(request.params.currency);
            if (currency) {
                return currency
            } else {
                return h
                    .response({
                        success: false,
                        message: `Currency ${request.params.currency} was not found!`
                    })
                    .code(404)
            }
        }, 
        options: {
            description: 'Get single currency',
            tags: ['api'],
            validate: {
                headers: {
                    userid: Joi.string().required()
                },
                params: {
                    currency: Joi.string().required()
                },
                options: {
                    allowUnknown: true
                }
            }
        }
    }); 
}

module.exports = {
    init: init,
    getCurrency: getCurrency
}