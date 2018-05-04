'use strict';

// module.exports = function (payload,callback) {
// 	// var payloadData {
// 	// 	limit: payload;
// 	// };
// 	// return payloadData
// 	console.log('Ehaelrj');
// }

module.exports = {
	registerLimit: function (payloadData, callback) {
		//var dataToSave = payloadData;
		var payloadData = {
			limit: payloadData
		};
		//var added = payloadData.limit + 1;
		var added = payloadData;
		return callback;
	}
}


