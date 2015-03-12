var config = require('../config')();
var twit = require('twit');

var twitter = new twit({
  consumer_key        : config.TWITTER_CONSUMER_KEY,
  consumer_secret     : config.TWITTER_CONSUMER_SECRET,
  access_token        : config.TWITTER_ACCESS_TOKEN,
  access_token_secret : config.TWITTER_ACCESS_TOKEN_SECRET
});

var stream = twitter.stream('user', { track : '_joelongstreet '});

exports.stream = stream;
