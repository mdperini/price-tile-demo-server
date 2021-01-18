'use strict';

const Joi = require('@hapi/joi');
const uuidv1 = require('uuid/v1');

const currencyPairs = require('./data/currencyPairs');
var _server;

function initPriceStreams() {
   currencyPairs.forEach(tickPrice);
}

function getCurrencyPair(symbol) {
  return currencyPairs.find((x) => x.symbol === symbol.toUpperCase());
}

function tickPrice(currencyPair) {
  let topic = '/price/' + currencyPair.symbol;
  _server.subscription(topic);
 
  setInterval(() => {
    let newRate = currencyPair.basePrice * (0.99995 + Math.random() * 0.001); //oscillates 0.1%
    let newTick = {
      symbol: currencyPair.symbol,
      priceType: 'SPOT',
      baseMidRate: newRate,
      bidRate: newRate * 1.000001,
      bidLiquidity: 1000000 + Math.floor(Math.random() * 100) * 1000,
      termRate: 1 / (newRate * 1.000001),
      termLiquidity: 1000000 + Math.floor(Math.random() * 100) * 1000,
      date: new Date().toISOString()
    };

    currencyPair.lastTick = newTick;
    _server.publish(topic, newTick);
  }, 2000 + 2000 * Math.random());
}

function init(server) {
  console.log(`>>> currency pair provider server init`);
  _server = server;
  server.route({
    method: 'GET',
    path: '/currencypairs',
    handler: (request, h) => {
      console.log('>>> currencypairs request');
      return currencyPairs.map(ccyPair => {
        ccyPair['key'] = uuidv1(); // ⇨ '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e'
        return ccyPair;
      });
      
    },
    options: {
      description: 'Get currency pairs',
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
    path: '/currencypairs/{symbol}',
    handler: (request, h) => {
      let ccy = getCurrencyPair(request.params.symbol);
      if (ccy) {
        return ccy;
      } else {
        return h
          .response({
            success: false,
            message: `Symbol ${request.params.symbol} was not found!`
          })
          .code(404);
      }
    },
    options: {
      description: 'Get single currency pair info',
      tags: ['api'],
      validate: {
        headers: {
          userid: Joi.string().required()
        },
        params: {
          symbol: Joi.string().required()
        },
        options: {
          allowUnknown: true
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/currencypairs/{symbol}/price',
    handler: (request, h) => {
      let ccy = getCurrencyPair(request.params.symbol);
      if (ccy) {
        if (ccy.lastTick) {
          return ccy.lastTick;
        } else {
          return h
            .response({
              success: false,
              message: `Symbol ${request.params.symbol} not priced yet.`
            })
            .code(404);
        }
      } else {
        return h
          .response({
            success: false,
            message: `Symbol ${request.params.symbol} not found`
          })
          .code(404);
      }
    },
    options: {
      description: 'Get singe currency pair last tick',
      tags: ['api'],
      validate: {
        headers: {
          userid: Joi.string().required()
        },
        params: {
          symbol: Joi.string().required()
        },
        options: {
          allowUnknown: true
        }
      }
    }
  });
 
  initPriceStreams();
}

module.exports = {
  init: init,
  getCurrencyPair: getCurrencyPair
};

