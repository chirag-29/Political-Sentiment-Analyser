var express = require("express");
var twitterAnalysisInstance = require("./twitterAnalysis.js");
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var app = express();
var twitter = new twitterAnalysisInstance();
var score;
var tone_analysis;
var analyzed_tones = [];
console.log(analyzed_tones);

var temp_tone;
var score;

var toneAnalyzer = new ToneAnalyzerV3({
    iam_apikey:"_bL_rLIORwcOdusCyqPYBObmdNIB1QiCDY_185AggNAn",
    version: '2017-09-21',
    url: "https://gateway-lon.watsonplatform.net/tone-analyzer/api"

});




app.use(express.static('public'));

app.get('/tone',function(req,res){
    res.send(analyzed_tones);


});



app.get('/results/:query', function (req, res) {

    twitter.getTwitterHashTagData(req.params.query, function (error, dataScores, twitterData) {
        if (error) console.log(error);
        console.log(twitterData.length);
        for(i=0;i<twitterData.length;i++)
        {
           text = twitterData[i];
            var input = {"text":text};

            var params = 
                    {
                    'tone_input': input,
                    'content_type': 'application/json'
                    };
            
            toneAnalyzer.tone(params, function(error, response) 
                    {
                    if (error)
                            {
                            console.log('Error:', error);
                            }
                    else
                            {
                           
                            tone_analysis = response.document_tone.tones;
                            if(tone_analysis.length>0)
                            {
                               
                                analyzed_tones.push(tone_analysis);
                                // console.log("Array Inside");
                                // console.log(analyzed_tones);
                                
                            }
                    
                            }
                    });
                   
                   
        }
        res.write(JSON.stringify(twitterData));
        res.end(JSON.stringify(dataScores).toString());
    });

});

var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("Listening to the app on port " + port);
});

