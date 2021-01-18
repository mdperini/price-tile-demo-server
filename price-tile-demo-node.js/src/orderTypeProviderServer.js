'use strict'

const Joi = require('@hapi/joi');
const uuidv1 = require('uuid/v1');

const orderTypes = require('./data/orderTypes');
var _server;

function getOrderType(id) {
    return orderTypes.find((a) => a.id.toLowerCase() === id.toLowerCase());        
}

function init(server) {
    console.log('>>> orderType provider server init');
    _server = server;
    server.route({
        method: 'GET',
        path: '/orderTypes',
        handler: (request, h) => {
            console.log('>>> orderTypes request');
            return orderTypes.map( orderType => {
                orderType['key'] = uuidv1();
                return orderType;
            });
        },
        options: {
            description: 'Get orderTypes',
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
        path: '/orderTypes/{orderType}',
        handler: (request, h) => {
            let orderType = getOrderType(request.params.orderType);
            if (orderType) {
                return orderType
            } else {
                return h
                    .response({
                        success: false,
                        message: `Currency ${request.params.orderType} was not found!`
                    })
                    .code(404)
            }
        }, 
        options: {
            description: 'Get single orderType',
            tags: ['api'],
            validate: {
                headers: {
                    userid: Joi.string().required()
                },
                params: {
                    orderType: Joi.string().required()
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
    getOrderType: getOrderType
}