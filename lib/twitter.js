var trackUser = 'wingstop';
var config = require('../config')();
var twit = require('twit');

var twitter = new twit({
  consumer_key        : config.TWITTER_CONSUMER_KEY,
  consumer_secret     : config.TWITTER_CONSUMER_SECRET,
  access_token        : config.TWITTER_ACCESS_TOKEN,
  access_token_secret : config.TWITTER_ACCESS_TOKEN_SECRET
});

var stream = twitter.stream('user', { track : trackUser });



exports.stream = stream;

exports.isUserTweet = function(tweet){
  if(tweet.user.screen_name == trackUser) return true;
  else return false;
};

exports.isMention = function(tweet){
  var isMention = false;

  tweet.entities.user_mentions.forEach(function(user){
    if(user.screen_name == trackUser) isMention = true;
  });

  return isMention;
};
