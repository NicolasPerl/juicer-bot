'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    port: 8080, //3000
    host: '127.0.0.1' //localhost
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        const query = request.query
        console.log('query: ', query);

        return ('HEck yea');
    }
});
/*
server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request, h) => {

        return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
    }
});

server.route({
    method: 'GET',
    path: '/{p*}',
    handler: (request, h) => {
        reply.file('/index.html');
    }
});
*/

await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/picture.jpg',
        handler: function (request, h) {

            return h.file('/path/to/picture.jpg');
        }
    });
    
const init = async () => {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init(); 