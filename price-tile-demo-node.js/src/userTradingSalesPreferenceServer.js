const Joi = require('@hapi/joi');
const uuidv1 = require('uuid/v1');

if (typeof localStorage === 'undefined' || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./.user-trading-sales-data');
}

function getUserTradingSalesPreference(userid) {
  let data = localStorage.getItem('preferences-' + userid);
   return data ? JSON.parse(data) : [];
}

function saveUserTradingSalesPreference(userid, userTradingSalesPreference) {
  localStorage.setItem('preferences-' + userid, JSON.stringify(userTradingSalesPreference));
}

function init(server) {
  console.log('>>> user trading and sales preference server server init');
  server.route({
    method: 'GET',
    path: '/tradingSalesPreferences',
    handler: (request, h) => {
      return getUserTradingSalesPreference(request.headers.userid);
    },
    options: {
      description: 'Get user trading and sales preferences',
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
    method: 'POST',
    path: '/tradingSalesPreferences',
    handler: (request, h) => {
      console.log(`userid ${request.headers.userid} payload ${JSON.stringify(request.payload)}`); // ${JSON.stringify(transaction)} 

      saveUserTradingSalesPreference(request.headers.userid, request.payload);
      return h
        .response({
          success: true,
          data: request.payload
        })
        .code(200);
    },
    options: {
      description: 'Save user trading and sales preferences',
      tags: ['api'],
      validate: {
        headers: {
          userid: Joi.string().required()
        },
        payload: Joi.any(),
        options: {
          allowUnknown: true
        }
      }
    }
  });
}
 
module.exports = {
  init: init
};