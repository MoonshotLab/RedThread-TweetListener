var Q = require('q');
var config = require('../config')();
var MongoClient = require('mongodb').MongoClient;
var tweets = null;

MongoClient.connect(config.DB_CONNECT, function(err, db){
  client = db;
  if(err) console.log('error connecting to db...', err);
  else console.log('connected to database');

  tweets = db.collection('tweets');
});



// save the original tweet
// tweet - { id, text, created_at, followers_count }
exports.saveTweet = function(tweet){
  var deferred = Q.defer();

  tweets.insert({ original : tweet }, function(err, res){
    if(err) deferred.reject(err);
    else deferred.resolve(res);
  });

  return deferred.promise;
};



// add an event (favorite, retweet, or reply) to a tweet record
exports.addEventToTweet = function(twitterId, eventType, eventDetails){
  var deferred = Q.defer();

  var insert = {};
  insert[eventType] = eventDetails;

  tweets.update(
    { 'original.id' : twitterId },
    { $push         : insert },
    function(err, res){
      if(err) deferred.reject(err);
      if(res === 0){
        deferred.reject({
          message   : 'Could not find tweet with id ' + twitterId,
          type      : eventType,
          details   : eventDetails
        });
      } else deferred.resolve({
        type    : eventType,
        details : eventDetails
      });
    }
  );

  return deferred.promise;
};
