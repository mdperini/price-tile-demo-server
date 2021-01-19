const Joi = require('@hapi/joi');
const uuidv1 = require('uuid/v1');

if (typeof localStorage === 'undefined' || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./.user-data');
}

function getUserPreference(userid) {
  let data = localStorage.getItem('preferences-' + userid);
   return data ? JSON.parse(data) : [];
}

function saveUserPreference(userid, userPreference) {
  localStorage.setItem('preferences-' + userid, JSON.stringify(userPreference));
}

function init(server) {
  console.log('>>> user preference server server init');
  server.route({
    method: 'GET',
    path: '/preferences',
    handler: (request, h) => {
      return getUserPreference(request.headers.userid);
    },
    options: {
      description: 'Get user preferences',
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
    path: '/preferences',
    handler: (request, h) => {
      console.log(`userid ${request.headers.userid} payload ${JSON.stringify(request.payload)}`); // ${JSON.stringify(transaction)} 

      saveUserPreference(request.headers.userid, request.payload);
      return h
        .response({
          success: true,
          data: request.payload
        })
        .code(200);
    },
    options: {
      description: 'Save user preferences',
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