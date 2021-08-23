const Twitter = require("twitter")
const dotenv = require("dotenv")

dotenv.config()

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
})

// Search for Tweets within the past seven days
// https://developer.twitter.com/en/docs/twitter-api/tweets/search/quick-start/recent-search

const needle = require('needle');

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token = process.env.BEARER_TOKEN;

const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

// gets the 
function retweet(tweetId) {
    client.post('statuses/retweet/' + tweetId, function(error, tweet, response) {
        if (!error) {
          console.log(tweet);
        }
      });
  }

  function likeTweet(tweetId) {
    client.post('favorites/create',  {id: tweetId}, function(error, tweet, response) {
        console.log(error)
        if (!error) {
          console.log(tweet);
        }
      });
  }

  function replyTweet(tweetId) {
      console.log('tweet id, ', tweetId)
      client.post('statuses/update', {
        status: ' @WayV_official YASS KING!!! <3',
        in_reply_to_status_id: tweetId,
        auto_populate_reply_metadata: true,

      }, function (err, data, response) {
        if (err) {
          console.log(err)
        } else {
          console.log(data.text + ' tweeted!')
        }
      })
  }

async function getRequest() {

    // Edit query parameters below
    // specify a search query, and any additional fields that are required
    // by default, only the Tweet ID and text fields are returned
    const params = {
        'query': 'TEN (from:WayV_official OR from:NCTsmtown) -is:retweet',
        'max_results': 100,
        'tweet.fields': 'author_id'
    }


    const res = await needle('get', endpointUrl, params, {
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body) {
        return res.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}


(async () => {
    try {
        // Make request
        const response = await getRequest();
        for (let i=0; i<(response.data).length; i++) {
            retweet(response.data[i].id)
            likeTweet(response.data[i].id)
            replyTweet(response.data[i].id)
        }

    } catch (e) {
        console.log(e);
        process.exit(-1);
    }
    // process.exit();
})();