'use strict'; 

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Nes = require('@hapi/nes');
const HapiSwagger = require('hapi-swagger');
const Path = require('path');
const Pack = require('../package')

const accountProviderServer = require('./accountProviderServer');
const currencyPairsServer = require('./currencyPairsServer');
const staticFileServer = require('./staticFileServer');
const transactionServer = require('./transactionServer');
const userPreferenceServer = require('./userPreferenceServer');

const start = async () => {
  const server = Hapi.server({
    port: 3383,
    host: 'localhost',
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '../client')
      },
      cors: {
        origin: ['http://localhost:4200', 'http://localhost:3006'],
        additionalHeaders: ['cache-control', 'x-requested-with', 'userid']
      }
    }
  });

  const hapiGoodOptions = {
    reporters: {
      myConsoleReporter: [
       {
          module: '@hapi/good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*' }]
        },
        {
          module: '@hapi/good-console'
        },
        'stdout'
      ]
    }
  };
 
  await server.register({
    plugin: require('@hapi/good'),
    options: hapiGoodOptions
  });
 
  const swaggerOptions = {
    info: {
      title: 'Sample Pricing Server - API Documentation',
      version: Pack.version
    }
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);
 
  await server.register(Nes);
  staticFileServer.init(server);
  accountProviderServer.init(server);
  currencyPairsServer.init(server);
  transactionServer.init(server);
  userPreferenceServer.init(server);

  await server.start();
  console.log('Server running at:', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

start();


