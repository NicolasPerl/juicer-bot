'use strict';
var controller = require("./server/controllers/comment_controller");
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
                return h.file('./views/'+encodeURIComponent(request.params.view)+".html")
            }
        });

    // config styles
    server.route({  
        method: 'GET',
        path: '/styles/{file*}',
        handler: {
            directory: { 
                path: './styles'
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
        path: '/scripts/{file*}',
        handler: {
            directory: { 
                path: './scripts'
            }
        }
    })


    //New AJAX request code
    server.route({  
        method: 'POST',
        path: '/api/{payload}',
        handler: function(request,h) {
            console.log('request: -----',request);
            var payloadData = parseInt(request.query.param);
            //var added = payloadData + 1; 
            console.log('payloadData route: ', payloadData);
            // controller.registerLimit(payloadData, function (err, data) {
            //     if (err) {
            //         console.log("thi sis a");
            //         throw err
            //     } else {
            //         console.log("success: ", data);
            //         return h.response(data);
            //     }
            //     return h.response(data);
               
            // });
            return h.response(payloadData);

        }
    })
//.config.params.param

//////////////////////////////////////////////////////////////////
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

blastoff(); 
