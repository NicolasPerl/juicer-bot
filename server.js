'use strict';

const Hapi = require('hapi');
//construct server instance
const server = Hapi.server({
    port: 8080, //3000
    host: '127.0.0.1' //localhost
});

const blastoff = async () => {
    //middleware
    await server.register(require('inert'));
    server.route ({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('index.html');
        }
    })
    // render the views
    server.route ({
            method: 'GET',
            path: '/{view}',
            handler: (request, h) => {
                return h.file('./Views/'+encodeURIComponent(request.params.view)+".html")
            }
        });

    // config styles
    server.route({  
        method: 'GET',
        path: '/Styles/{file*}',
        handler: {
            directory: { 
                path: './Styles'
            }
        }
    })
    //config media
    server.route({  
        method: 'GET',
        path: '/media/{file*}',
        handler: {
            directory: { 
                path: './media'
            }
        }
    })
    //config scripts
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

blastoff(); 
