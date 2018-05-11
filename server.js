'use strict';
var controller = require("./server/controllers/comment_controller");
const Hapi = require('hapi');
var Joi = require('joi');
//var sc2 = require('sc2-sdk');


//construct server instance
const server = Hapi.server({
    port: 3000, //8080
    host: 'localhost' //127.0.0.1
});

// sc2.init({
//   app: 'juicer.app',
//   callbackURL: 'http://127.0.0.1:8080',
//   scope: ['vote', 'comment']
// });

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
            //console.log('request: -----',request);
            var payloadData = parseInt(request.query.param);
            console.log('payloadData route: ', payloadData);
            controller.registerLimit(payloadData, function (err, data) {
                if (err) {
                    console.log("this is data object: ", data);
                    throw err
                } else {
                    console.log("success: ", data);
                    return this;

                }
            });
            return this;
        },
        options: {
            validate: {
                query: {
                    param: Joi.number().integer()
                }
            }
        }
    })

    server.route({
        method: 'POST',
        path: '/api/fire/{submit}',
        handler: function(request,h) {



            console.log('request---------------: ',request);
            var payloadData = request.query;
            var limit = parseInt(payloadData.limit);
            console.log('payloadData route: ', limit);
            steem.api.getAccounts(['ned', 'dan'], function(err, result) {
                console.log(err, result);
            });
        }
    })


//////////////////////////////////////////////////////////////////
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

blastoff(); 
