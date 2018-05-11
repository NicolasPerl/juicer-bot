'use strict';
var async = require('async');

module.exports = {
	registerLimit: function (payloadData, callback) {
		console.log('in registerLimit: ', payloadData);
		var limit = 0;
		async.auto({
			saveLimit: function(cb) {
				limit = payloadData;
				console.log('inside saveLimit:------------', limit);
				callback(null, limit);
			}
		}, function (err, results) {
				console.log('inside callback in controller---------');
				console.log('err = ', err);
    			console.log('results = ', results);
		})
		
	}


}//close module.exports


