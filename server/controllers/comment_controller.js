'use strict';
var async = require('async');

module.exports = {
	registerLimit: function (payloadData, callback) {
		console.log('in registerLimit: ', payloadData);
		var added = 0;
		async.auto({
			saveLimit: function(cb) {
				added = payloadData + 1;
				console.log('inside saveLimit:------------', added);
				callback(null, added);
			}
		}, function (err, results) {
				console.log('inside callback in controller---------');
				console.log('err = ', err);
    			console.log('results = ', results);
		})
		
	}
}


