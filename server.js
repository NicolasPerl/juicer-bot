'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    port: 8080, //3000
    host: '127.0.0.1' //localhost
});
/*
server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        const query = request.query
        console.log('query: ', query);

        return ('HEck yea');
    }
});

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


    
    
const init = async () => {
    await server.register(require('inert'));

    server.route ({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            //return h.file('./Views/comments.html');
            return h.file('index.html');
        }
    });

    server.route ({
        method: 'GET',
        path: '/comments',
        handler: (request, h) => {
            //return h.file('./Views/comments.html');
            return h.file('./Views/comments.html');
        }
    });

    server.route({  
        method: 'GET',
        path: '/Styles/{file*}',
        handler: {
            directory: { 
                path: './Styles'
            }
        }
    })

    server.route({  
        method: 'GET',
        path: '/media/{file*}',
        handler: {
            directory: { 
                path: './media'
            }
        }
    })

    server.route({  
        method: 'GET',
        path: '/Scripts/{file*}',
        handler: {
            directory: { 
                path: './Scripts'
            }
        }
    })

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init(); 