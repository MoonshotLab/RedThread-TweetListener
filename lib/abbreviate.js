exports.user = function(original){
  return {
    id                : original.id,
    screen_name       : original.screen_name,
    followers_count   : original.followers_count,
    friends_count     : original.friends_count,
    listed_count      : original.listed_count,
    favourites_count  : original.favourites_count,
    statuses_count    : original.statuses_count,
    protected         : original.protected,
    verified          : original.verified,
    following         : original.following
  };
};


exports.tweet = function(original){
  return {
    id                    : original.id,
    text                  : original.text,
    created_at            : new Date(original.created_at).getTime(),
    followers_count       : original.user.followers_count,
    in_reply_to_status_id : original.in_reply_to_status_id
  };
};
