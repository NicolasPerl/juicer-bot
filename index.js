const steem= require('steem');
const validurl = require('valid-url');
const fs = require("fs");

var config = JSON.parse(fs.readFileSync("config.json"));
var account = null;
var trans_number = 0;
var outstanding_votes = [];
var isVoting = false;

steem.api.setOptions({ url: config.steem_node  }); // set steem node

if (fs.existsSync('state.json')) {
	const state = JSON.parse(fs.readFileSync("state.json"));

	if (state.trans_number) {
		trans_number = state.trans_number;
	}

	console.log("Loaded state.json and set vars");
}

loop();
setInterval(loop, 10000); // create loop

function loop() {
	console.log('Looping every 10 seconds');

	steem.api.getAccounts([config.account_name], function (err, result) { // get account data
		if (err || !result) { // check for errors
			console.log('Error loading account: ' + err); // output error
			return;
		}

		account = result[0]; // set account
		//console.log(account);
	});

	if (account) {
		steem.api.getAccountHistory(account.name, -1, 10, function (err, result) { // get account history starting with last transaction
			if (err || !result) {
				console.log('Error loading account: ' + err); // output error
				return;
			}

			result.forEach(function(trans) { // loop through the found transactions
				var op = trans[1].op; // trans[0] is the transaction #/id
				//console.log('trans: ' + trans);
				console.log('op[1]: ' + op[1]);
				if(trans[0]>trans_number) { // make sure it's a new transaction
					if (op[0] == 'transfer' && op[1].to == account.name) { // check if the trans is a transfer & the reciever is your account name
						if (validurl.isUri(op[1].memo)) { // check memo field if it is a valid URL
							var amount = op[1].amount; // grab amount e.g. '1.00 SBD'
							var currency = amount.substr(amount.indexOf(' ') + 1); // make a substring of the white space
							amount = parseFloat(amount);

							if(config.accepted_currencies && config.accepted_currencies.indexOf(currency) < 0) {
								console.log("Invalid currency sent - should refund");
								refund(op[1].from, op[1].amount, 'invalid_currency');
								return;
							} else if(amount < config.min_mid) {
								console.log("bid to low - should refund");
								refund(op[1].from, op[1].amount, 'invalid_bid');
								return;
							} else if (amount > config.max_bid) {
								console.log("bid to high - should refund");
								refund(op[1].from, op[1].amount, 'invalid_bid');
								return;
							} else {
								checkValidMemo(op,op[1].from, op[1].amount);
							}
		
						} else {
							console.log("memo not a uri - should refund");
							refund(op[1].from, op[1].amount, 'inalid_memo');
						}

					}
				trans_number=trans[0];
				saveState();
				}
			});
		});
	}

	if (outstanding_votes.length > 0 && !isVoting) {
		sendVotes();
	}
}

function checkValidMemo(transData, sender, amount) {
	if (isVoting) {
		return
	}

	const memo =  transData[1].memo; // grab the memo
	var permLink = memo.substr(memo.lastIndexOf('/') + 1); // get permlink from memo
	var author = memo.substring(memo.lastIndexOf('@') + 1, memo.lastIndexOf('/')); // get author from memo


	steem.api.getContent(author, permLink, function (err, result) { // get post data
		var created = new Date(result.created + 'Z');
		if (err || !result) {
			console.log('Not a valid url / author: ' + err); // post doesn't exist
			refund(op[1].from, op[1].amount, 'invalid_memo');
			return;
		}

		// disable comment upvoting
		if (result.parent_author != null && result.parent_author != '') {
			refund(sender,amount, 'no_comments');
			return;
		}

		var votes = result.active_votes.filter(function(vote) { return vote.voter == account.name; }); // check if already voted
		console.log(votes);
		if (votes.length > 0 && votes[0].percent > 0) {
			console.log('already voted on post');
			refund(op[1].from, op[1].amount, 'already_voted');
			return;
		}

		if ((new Date() - created) >= (config.max_post_age * 60 * 60 * 1000)) {
            refund(sender, amount, 'post_to_old');
            return;
		}

		outstanding_votes.push({author: result.author, permlink: result.permlink}); // add vote to outstanding vote list
	});

}

function sendVotes() {
	isVoting = true;
	vote(outstanding_votes.pop(), function() {
		if (outstanding_votes.length > 0) {
			setTimeout(function () { sendVotes(); }, 5000);

		} else {
			isVoting = false;
		}
	})
}

// prvate posting key
function vote(vote, callback) {
	console.log('voting: ' + vote);

	steem.broadcast.vote(config.private_posting_key, account.name, vote.author, vote.permlink, 10000, function (err, reuslt) {
		if (err && !result) {
			cosnole.log('Voting failed: ' + err);
			return;
		}

		sendComment(vote);

		if (callback) {
			callback();
		}
	});
}
// only test with bot account
function refund(sender, amount,memoType) {
	var message = config.memo_messages[memoType];
	message = message.replace(/{sender}/g,sender);
	message = message.replace(/{bid}/g,amount);

	steem.broadcast.transfer(config.private_active_key, config.account_name, sender, amount, messsage, function (err, response) {
		if (err || !result) {
			console.log("Refund failed ! for: " + sender);
		}
	});
}

function saveState() {
	var state = {
		trans_number: trans_number;
	};

	fs.writeFile('state.json',JSON.stringify(state),function (err) {
		if (err) {
			console.log(err);
		};
	});
}

function sendComment(vote) {
    const permlink = 're-' + vote.author.replace(/\./g, '') + '-' + vote.permlink + '-' + new Date().toISOString().replace(/-|:|\./g, '').toLowerCase();
    const comments = config.comments;
    const comment = comments[Math.floor(Math.random()* comments.length)];
    // Broadcast the comment
    steem.broadcast.comment(config.private_posting_key, vote.author, vote.permlink, account.name, permlink, permlink, comment, '{"app":"upvoter/"}', function (err, result) {
      if (!err && result) {
        console.log('Posted comment: ' + permlink);
      } else {
        console.log('Error posting comment: ' + permlink + ', Error: ' + err);
      }
    });
