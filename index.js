var twitter = require('./lib/twitter');
var db = require('./lib/db');
var abbreviate = require('./lib/abbreviate');


// just log out errors from the promises
var error = function(err){
  console.log('======= ERR =======');
  console.log(err.message || err);
  console.log('===================');
};



// handle new tweets and retweets
twitter.stream.on('tweet', function(tweet){

  if(tweet.retweeted_status){
    // it's a retweet if retweeted_status object is present
    db.addEventToTweet(tweet.retweeted_status.id, 'retweet', {
      id          : tweet.id,
      created_at  : new Date(tweet.created_at).getTime(),
      user        : abbreviate.user(tweet.user)
    }).then(function(){
      console.log('retweet   :', tweet.text);
    }).fail(error);
  } else if(tweet.in_reply_to_status_id && !twitter.isUserTweet(tweet)){
    // it's a retweet if in_reply_to_status_id is present and it's not
    // our tracked user
    db.addEventToTweet(tweet.in_reply_to_status_id, 'reply', {
      id          : tweet.id,
      text        : tweet.text,
      created_at  : new Date(tweet.created_at).getTime(),
      user        : abbreviate.user(tweet.user)
    }).then(function(){
      console.log('reply     :', tweet.text);
    }).fail(error);
  } else if(twitter.isMention(tweet)){
    // it's a mention if the tweet contains the user we track
    db.addMention({
      id          : tweet.id,
      text        : tweet.text,
      created_at  : new Date(tweet.created_at).getTime(),
      user        : abbreviate.user(tweet.user)
    }).then(function(){
      console.log('mention   :', tweet.text);
    }).fail(error);
  } else if(twitter.isUserTweet(tweet)){
    // if this tweet definitely came from the user we're tracking
    db.saveTweet(abbreviate.tweet(tweet)).then(function(){
      console.log('tweet     :', tweet.text);
    }).fail(error);
  }
});


// on favorite
twitter.stream.on('favorite', function(e){
  db.addEventToTweet(e.target_object.id, 'favorite', {
    created_at  : new Date(e.created_at).getTime(),
    user        : abbreviate.user(e.source)
  }).then(function(){
    console.log('favorite  :', e.source.screen_name);
  }).fail(error);
});


// on follow
twitter.stream.on('follow', function(e){
  db.addFollow({
    created_at  : new Date(e.created_at).getTime(),
    user        : abbreviate.user(e.source)
  }).then(function(){
    console.log('follow    :', e.source.screen_name);
  }).fail(error);
});
