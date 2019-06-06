
var twitterAnalysis = function () {
    var async = require('async');
    var twitter = require("twitter");
    var dotenv = require("dotenv");
    var sentiment = require("sentiment");

    dotenv.config();

    var twitterApi = new twitter({
        consumer_key: 'RKC3Lzc2531e3iuwLo05kMm0b',
        consumer_secret: 'Ac7E6kP2brkb9eW6YAyGpzu25tWJAtH3ijg9dGmkZRQYjn4byy',
        access_token_key: '780430172826718208-r7sVRksxsNp8ZKc6sjAjW9jDWedWBdl',
        access_token_secret: 'FLmRyHaOwGykSNGLQaPJQwJPsTaeAQfPwHOQiBYM0wIgn'
    });


    this.getTwitterHashTagData = function (query, callback) {
        var dataScore = {"Very Negative": 0, "Negative": 0, "Neutral": 0, "Positive": 0, "Very Positive": 0};
        var sum = 0;

        twitterApi.get("search/tweets", {q: "#" + query, lang: "en",count:50}, function (error, tweets, response) {
            var twitterData = [];
            var sortedTwitterData = [];
            if (error) callback(error);
            async.each(tweets.statuses, function (item, callEach) {
                
                twitterData.push(item.text);
                var sentScore = sentiment(item.text, function (err, data) {
                    if (data.score < -4) {
                        sortedTwitterData.unshift(item.text);
                        dataScore["Very Negative"] += 1;
                    }   
                    else if (data.score >= -3 && data.score < 0) {
                        sortedTwitterData.splice(2, 0, item.text);
                        dataScore["Negative"] += 1;
                    }
                    else if (data.score == 0) {
                        sortedTwitterData.splice(3, 0, item.text);
                        dataScore["Neutral"] += 1;
                    }
                    else if (data.score > 0 && data.score <= 3) {
                        sortedTwitterData.splice(4, 0, item.text);
                        dataScore["Positive"] += 1;
                    }
                    else {
                        sortedTwitterData.push(item.text);
                        dataScore["Very Positive"] += 1;
                    }
                    callEach(); // decrementing by 1 until the length of the array is completed for the tweets.statuses
                });

            }, function () {

                callback(null, dataScore, sortedTwitterData);

            });

        });
    };
};

module.exports = twitterAnalysis;