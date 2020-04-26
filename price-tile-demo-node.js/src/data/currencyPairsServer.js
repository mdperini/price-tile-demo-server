'use strict';

const Joi = require('@hapi/joi');
const uuidv1 = require('uuid/v1');

const currencyPairs = require('./data/currencyPairsUSDNDFs');
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
      bidLiquidity: 10000 + Math.floor(Math.random() * 100) * 1000,
      termRate: 1 / (newRate * 1.000001),
      termLiquidity: 10000 + Math.floor(Math.random() * 100) * 1000,
      date: new Date().toISOString(),
      rung = [ {
        nearTenor: 'SP+1',
        nearTenorDate: new Date(2020,0,27).toISOString(),
        bidPoints: 0,
        askPoints: 0,
        bidLiquidity: 0,
        askLiquidity: 0,
        bidAllInPoints: 0,
        askAllInPoints: 0,
        farTenor: '1W',
        farTenorDate: new Date(2020,1,2).toISOString(), 
      },{
        nearTenor: 'SP+1',
        nearTenorDate: new Date(2020,0,27).toISOString(),
        bidPoints: 0,
        askPoints: 0,
        bidLiquidity: 1000000,
        askLiquidity: 1000000,
        bidAllInPoints: 0,
        askAllInPoints: 0,
        farTenor: '1W',
        farTenorDate: new Date(2020,1,2).toISOString(), 
      }]
    };

    currencyPair.lastTick = newTick;
    _server.publish(topic, newTick);
  }, 1000 + 1000 * Math.random());
}

function init(server) {
  _server = server;
  server.route({
    method: 'GET',
    path: '/currencypairs',
    handler: (request, h) => {
      console.log('currencypairs');
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
            message: `Symbol ${request.params.symbol} not found`
          })
          .code(404);
      }
    },
    options: {
      description: 'Get singe currency pair info',
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

