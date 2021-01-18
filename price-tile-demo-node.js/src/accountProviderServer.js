'use strict'

const Joi = require('@hapi/joi');
const uuidv1 = require('uuid/v1');

const accounts = require('./data/accounts');
var _server;

function getAccount(accountId) {
    return accounts.find((a) => a.id.toLowerCase() === accountId.toLowerCase());        
}

function init(server) {
    console.log('>>> accounts server init');
    _server = server;
    server.route({
        method: 'GET',
        path: '/accounts',
        handler: (request, h) => {
            console.log('>>> accounts request');
            return accounts.map( account => {
                account['key'] = uuidv1();
                return account;
            });
        },
        options: {
            description: 'Get accounts',
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
        path: '/accounts/{account}',
        handler: (request, h) => {
            let account = getAccount(request.params.account);
            if (account) {
                return account
            } else {
                return h
                    .response({
                        success: false,
                        message: `Account ${request.params.account} was not found!`
                    })
                    .code(404)
            }
        }, 
        options: {
            description: 'Get single account',
            tags: ['api'],
            validate: {
                headers: {
                    userid: Joi.string().required()
                },
                params: {
                    account: Joi.string().required()
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
    getAccount: getAccount
}