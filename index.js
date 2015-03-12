var twitter = require('./lib/twitter');
var db = require('./lib/db');
var abbreviate = require('./lib/abbreviate');


// just log out success and errors from the promises
var success = function(message){ console.log(message); };
var error   = function(message){ console.log(message); };



// handle new tweets and retweets
twitter.stream.on('tweet', function(tweet){

  // assume it's a retweet if retweeted_status object is present
  if(tweet.retweeted_status){
    db.addEventToTweet(tweet.retweeted_status.id, 'retweet', {
      id    : tweet.id,
      user  : abbreviate.user(tweet.user)
    }).then(success).fail(error);
  } else
    db.saveTweet(abbreviate.tweet(tweet)).then(success).fail(error);
});



// whenever a new event come in, add it to the original tweet
twitter.stream.on('user_event', function(e){
  db.addEventToTweet(e.target_object.id, e.event, {
    created_at  : e.created_at,
    user        : abbreviate.user(e.source)
  }).then(success).fail(error);
});
