var Q = require('q');
var config = require('../config')();
var MongoClient = require('mongodb').MongoClient;

var twitterFollows = null;
var twitterMentions = null;
var twitterReference = null;
var tweets = null;


MongoClient.connect(config.DB_CONNECT, function(err, db){
  client = db;
  if(err) console.log('error connecting to db...', err);
  else console.log('connected to database');

  twitterFollows = db.collection('twitterFollows');
  twitterMentions = db.collection('twitterMentions');
  twitterReference = db.collection('twitterReference');
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
        var message = [
          'Could not add', eventType, 'to tweet with id', twitterId,
          'because the tweet could not be found.'
        ].join(' ');
        deferred.reject({ message : message });
      } else deferred.resolve({
        type    : eventType,
        details : eventDetails
      });
    }
  );

  return deferred.promise;
};



exports.addFollow = function(followData){
  var deferred = Q.defer();

  twitterFollows.insert(followData, function(err, res){
    if(err) deferred.reject(err);
    else deferred.resolve(res);
  });

  return deferred.promise;
};



exports.addMention = function(mentionData){
  var deferred = Q.defer();

  twitterMentions.insert(mentionData, function(err, res){
    if(err) deferred.reject(err);
    else deferred.resolve(res);
  });

  return deferred.promise;
};



exports.addReference = function(mentionData){
  var deferred = Q.defer();

  twitterReference.insert(mentionData, function(err, res){
    if(err) deferred.reject(err);
    else deferred.resolve(res);
  });

  return deferred.promise;
};
