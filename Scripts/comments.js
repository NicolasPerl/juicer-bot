
//Memo URL to Upvote
var memoURL = 'https://steemit.com/technology/@techchat/bmw-has-a-motorcycle-that-balances-itself'

//Wif DELETE BEFORE PUSHING----------------------------------------
var wif = ''//--
//-----------------------------------------------------------------

var techchat='techchat'

// set the counter
var i = 1 

//template to post
template ='![steemitComment.png](https://steemitimages.com/DQmTz3Tp8ueysinU65zbUG91RserdhYUwuFmhdr77GjijH1/steemitComment.png) <br> We are excited to see you join us here! Steemit is a remarkable platform that is built to reward users for creating quality content. Its a logic called *proof of brain*. <br><br>As for TechChat, think of us as DJs that create tech content instead of music. We create content by looking for the most shocking, interesting, and exciting breakthroughs in the tech space. Basically - we do all the research so you dont have to.<br><br>We hope to hear your opinion on TechChat’s content! We always love to hear from our community. <br><br>Happy Steeming 🚀'


var limit = 2
var query = {
  tag: 'introduceyourself',
  limit: limit,
};



var repeat_list = [];
/* auto comment*/
function loopComment () {
  console.log("repeat_list: ", repeat_list);
  steem.api.getDiscussionsByCreated(query, function(err, result) {
    setTimeout(function () {
      var permlinkSlug = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
      var discussion = result[i];
      console.log(i, discussion);
      var user_id = discussion.id;
      var flag = $.inArray(user_id, repeat_list); //check if user_id is already in array
      if (flag === -1) {
        repeat_list.push(user_id);
        console.log("inside inarray",repeat_list);
        window.permlink = discussion.permlink;
        window.author = discussion.author;
        console.log(author, 'author');
        /* broadcast comment*/
        steem.broadcast.comment(
          wif, 
          author, // author of post you're commenting to
          permlink, //parentPermlink 
          'techchat', // same user the private_posting_key is for
          permlinkSlug, //permlink a slug (lowercase 'a'-'z', '0'-'9', and '-', min 1 character, max 255 characters)
          '', //title human-readable title
          template, //body 
          { tags: ['introduceyourself'] }, //jsonMetadata arbitrary metadata
          function(err, result) {
          console.log(err, result);
          });
      }
      i++;
      if (i < limit) {
        loopComment();
      }
    }, 21000)
  }); 
}
 /*auto comment ends */

 /*Execute every 5 hours 14400000 

 function fire () {
  let timer = setInterval(loopComment(),21000);

 }
*/

function fire () {
  loopComment();
 }


