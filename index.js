var twitter = require('./lib/twitter');
var db = require('./lib/db');
var abbreviate = require('./lib/abbreviate');


// just log out success and errors from the promises
var success = function(message){ console.log(message); };
var error   = function(message){ console.log(message); };



// handle new tweets and retweets
twitter.stream.on('tweet', function(tweet){

  if(tweet.retweeted_status){
    // it's a retweet if retweeted_status object is present
    db.addEventToTweet(tweet.retweeted_status.id, 'retweet', {
      id          : tweet.id,
      created_at  : new Date(tweet.created_at).getTime(),
      user        : abbreviate.user(tweet.user)
    }).then(success).fail(error);
  } else if(tweet.in_reply_to_status_id){
    // it's a retweet if in_reply_to_status_id is present
    db.addEventToTweet(tweet.in_reply_to_status_id, 'reply', {
      id          : tweet.id,
      text        : tweet.text,
      created_at  : new Date(tweet.created_at).getTime(),
      user        : abbreviate.user(tweet.user)
    }).then(success).fail(error);
  } else if(twitter.isMention(tweet)){
    // it's a mention if the tweet contains the user we track
    db.addMention({
      id          : tweet.id,
      text        : tweet.text,
      created_at  : new Date(tweet.created_at).getTime(),
      user        : abbreviate.user(tweet.user)
    }).then(success).fail(error);
  } else if(twitter.isUserTweet(tweet)){
    // if this tweet definitely came from the user we're tracking
    db.saveTweet(abbreviate.tweet(tweet)).then(success).fail(error);
  } else {
    // if the term is present, but they don't use the @ sign
    db.addReference({
      id          : tweet.id,
      text        : tweet.text,
      created_at  : new Date(tweet.created_at).getTime(),
      user        : abbreviate.user(tweet.user)
    }).then(success).fail(error);
  }
});


// on favorite
twitter.stream.on('favorite', function(e){
  db.addEventToTweet(e.target_object.id, 'favorite', {
    created_at  : new Date(e.created_at).getTime(),
    user        : abbreviate.user(e.source)
  }).then(success).fail(error);
});


// on follow
twitter.stream.on('follow', function(e){
  db.addFollow({
    created_at  : new Date(e.created_at).getTime(),
    user        : abbreviate.user(e.source)
  }).then(success).fail(error);
});
