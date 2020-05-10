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
      termRate: newRate * 1.004001,
      termLiquidity: 10000 + Math.floor(Math.random() * 100) * 1000,
      date: new Date().toISOString(),
      rungs: [ {
        nearTenor: 'SP+1',
        nearTenorDate: new Date(2020,0,29).toISOString(),
        nearTenorFixingDate: null,
        bidPoints: 0,
        askPoints: 0,
        bidLiquidity: 0,
        askLiquidity: 0,
        bidAllInPoints: 0,
        askAllInPoints: 0,
        farTenor: '1W',
        farTenorDate: new Date(2020,1,4).toISOString(), 
        farTenorFixingDate: null, 
      },
      {
        nearTenor: '1W',
        nearTenorDate: new Date(2020,1,4).toISOString(),
        nearTenorFixingDate: new Date(2020,1,2).toISOString(),
        bidPoints: 4000 + Math.floor(Math.random() * 100) * 1000,
        askPoints: 20000 + Math.floor(Math.random() * 100) * 1000,
        bidLiquidity: 1000000,
        askLiquidity: 1000000,
        bidAllInPoints: newRate * 1.005001,
        askAllInPoints: newRate * 1.006001,
        farTenor: '1M',
        farTenorDate: new Date(2020,1,28).toISOString(), 
        farTenorFixingDate: new Date(2020,1,26).toISOString(), 
      },
      {
        nearTenor: '3W',
        nearTenorDate: new Date(2020,1,18).toISOString(),
        nearTenorFixingDate: new Date(2020,1,16).toISOString(),
        bidPoints: 4000 + Math.floor(Math.random() * 100) * 1000,
        askPoints: 4000 + Math.floor(Math.random() * 100) * 1000,
        bidLiquidity: 1000000,
        askLiquidity: 1000000,
        bidAllInPoints: newRate * 1.005001,
        askAllInPoints: newRate * 1.006001,
        farTenor: '1M',
        farTenorDate: new Date(2020,1,28).toISOString(), 
        farTenorFixingDate: new Date(2020,1,26).toISOString(), 
      },
      {
        nearTenor: '1M',
        nearTenorDate: new Date(2020,1,28).toISOString(),
        nearTenorFixingDate: new Date(2020,1,26).toISOString(),
        bidPoints: 150.58 + Math.floor(Math.random() * 100) * 1000,
        askPoints: 240.00 + Math.floor(Math.random() * 100) * 1000,
        bidLiquidity: 1000000,
        askLiquidity: 1000000,
        bidAllInPoints: newRate * 1.005001,
        askAllInPoints: newRate * 1.006001,
        farTenor: '2M',
        farTenorDate: new Date(2020,2,28).toISOString(), 
        farTenorFixingDate: new Date(2020,2,26).toISOString(), 
      },
      {
        nearTenor: '1M',
        nearTenorDate: new Date(2020,1,28).toISOString(),
        nearTenorFixingDate: new Date(2020,1,26).toISOString(),
        bidPoints: 235.08 + Math.floor(Math.random() * 100) * 1000,
        askPoints: 320.00 + Math.floor(Math.random() * 100) * 1000,
        bidLiquidity: 1000000,
        askLiquidity: 1000000,
        bidAllInPoints: newRate * 1.005001,
        askAllInPoints: newRate * 1.006001,
        farTenor: '3M',
        farTenorDate: new Date(2020,3,26).toISOString(), 
        farTenorFixingDate: new Date(2020,3,24).toISOString(), 
      },
      {
        nearTenor: '1M',
        nearTenorDate: new Date(2020,1,28).toISOString(),
        nearTenorFixingDate: new Date(2020,1,26).toISOString(),
        bidPoints: 442.00 + Math.floor(Math.random() * 100) * 1000,
        askPoints: 540.00 + Math.floor(Math.random() * 100) * 1000,
        bidLiquidity: 1000000,
        askLiquidity: 1000000,
        bidAllInPoints: newRate * 1.005001,
        askAllInPoints: newRate * 1.006001,
        farTenor: '4M',
        farTenorDate: new Date(2020,4,28).toISOString(), 
        farTenorFixingDate: new Date(2020,4,26).toISOString(), 
      },
      {
        nearTenor: '1M',
        nearTenorDate: new Date(2020,1,28).toISOString(),
        nearTenorFixingDate: new Date(2020,1,26).toISOString(),
        bidPoints: 620.25 + Math.floor(Math.random() * 100) * 1000,
        askPoints: 719.00 + Math.floor(Math.random() * 100) * 1000,
        bidLiquidity: 1000000,
        askLiquidity: 1000000,
        bidAllInPoints: newRate * 1.005001,
        askAllInPoints: newRate * 1.006001,
        farTenor: '5M',
        farTenorDate: new Date(2020,5,27).toISOString(),
        farTenorFixingDate: new Date(2020,5,25).toISOString(), 
      },
      {
        nearTenor: '1M',
        nearTenorDate: new Date(2020,1,28).toISOString(),
        nearTenorFixingDate: new Date(2020,1,26).toISOString(),
        bidPoints: 776.85 + Math.floor(Math.random() * 100) * 1000,
        askPoints: 911.85 + Math.floor(Math.random() * 100) * 1000,
        bidLiquidity: 1000000,
        askLiquidity: 1000000,
        bidAllInPoints: newRate * 1.005001,
        askAllInPoints: newRate * 1.006001,
        farTenor: '6M',
        farTenorDate: new Date(2020,6,26).toISOString(),
        farTenorFixingDate: new Date(2020,6,24).toISOString(), 
      },
      {
        nearTenor: '1M',
        nearTenorDate: new Date(2020,1,28).toISOString(),
        nearTenorFixingDate: new Date(2020,1,26).toISOString(),
        bidPoints: 1085.75 + Math.floor(Math.random() * 100) * 1000,
        askPoints: 1220.75 + Math.floor(Math.random() * 100) * 1000,
        bidLiquidity: 1000000,
        askLiquidity: 1000000,
        bidAllInPoints: newRate * 1.005001,
        askAllInPoints: newRate * 1.006001,
        farTenor: '9M',
        farTenorDate: new Date(2020,9,28).toISOString(),
        farTenorFixingDate: new Date(2020,9,26).toISOString(), 
      },
      {
        nearTenor: '1M',
        nearTenorDate: new Date(2020,1,28).toISOString(),
        nearTenorFixingDate: new Date(2020,1,26).toISOString(),
        bidPoints: 1420.30 + Math.floor(Math.random() * 100) * 1000,
        askPoints: 1645.30 + Math.floor(Math.random() * 100) * 1000,
        bidLiquidity: 1000000,
        askLiquidity: 1000000,
        bidAllInPoints: newRate * 1.005001,
        askAllInPoints: newRate * 1.006001,
        farTenor: '1Y',
        farTenorDate: new Date(2021,0,28).toISOString(),
        farTenorFixingDate: new Date(2021,0,26).toISOString(), 
      },
      {
        nearTenor: '1M',
        nearTenorDate: new Date(2020,1,28).toISOString(),
        nearTenorFixingDate: new Date(2020,1,26).toISOString(),
        bidPoints: 1782.00 + Math.floor(Math.random() * 100) * 1000,
        askPoints: 2007.00 + Math.floor(Math.random() * 100) * 1000,
        bidLiquidity: 1000000,
        askLiquidity: 1000000,
        bidAllInPoints: newRate * 1.005001,
        askAllInPoints: newRate * 1.006001,
        farTenor: '1MM1',
        farTenorDate: new Date(2021,2,18).toISOString(),
        farTenorFixingDate: new Date(2021,2,16).toISOString(), 
      },
      {
        nearTenor: '1M',
        nearTenorDate: new Date(2020,1,28).toISOString(),
        nearTenorFixingDate: new Date(2020,1,26).toISOString(),
        bidPoints: 2285.12 + Math.floor(Math.random() * 100) * 1000,
        askPoints: 228512 + Math.floor(Math.random() * 100) * 1000,
        bidLiquidity: 1000000,
        askLiquidity: 1000000,
        bidAllInPoints: newRate * 1.005001,
        askAllInPoints: newRate * 1.006001,
        farTenor: 'IMM2',
        farTenorDate: new Date(2021,3,26).toISOString(),
        farTenorFixingDate: new Date(2020,1,2).toISOString(), 
      } 
      ]
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

