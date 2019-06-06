var angercount = 0;
var joycount = 0;
var fearcount = 0;
var sadnesscount = 0;
var analyticalcount = 0;
var confidentcount = 0;
var tentativecount = 0;

var angerscores = 0.0;
var joyscores = 0.0;
var fearscores = 0.0;
var sadnessscores = 0.0;
var analyticalscores = 0.0;
var confidentscores = 0.0;
var tentativescores = 0.0;
var tonescores = [];
var barchart;

var newarr;

app.controller("main-ctrl", ["$scope", "$http", function ($scope, $http) {
    $scope.title = "Political Sentiment Analysis";
    $scope.newtitle = "Tonal Analysis";
       $scope.getResponse = function () {
           $http.get("/results/" + $scope.searchInput).then(function (data) {
                console.log(data);
               var twitterData = data.data;
               twitterData = twitterData.split(/[{}]+/);
               document.getElementById('sentval').style.visibility ='visible';
               document.getElementById('favunfav').style.visibility ='visible';
               document.getElementById('tonalbtn').style.visibility = 'visible';
               document.getElementById('hide_div').style.visibility = 'visible';
               document.getElementById('hide_text').style.visibility = 'visible';
               document.getElementById('hide_text2').style.visibility = 'visible';
               document.getElementById('regions_div').style.visibility = 'visible';


               var scores = "{" + twitterData[1] + "}";
               scores = JSON.parse(scores);
               var posScore = scores["Very Positive"] + scores["Positive"]+ scores["Neutral"];
              var negScore = scores["Negative"]+ scores["Very Negative"] + scores["Neutral"];
              var disp1;
                if(posScore>negScore){
                   disp1 = true;
               }
               else{
                  disp1 = false;
               }
                var per = posScore/(posScore+negScore);
                var opts = {
                angle: 0.15, // The span of the gauge arc
                lineWidth: 0.44, // The line thickness
                radiusScale: 1, // Relative radius
                pointer: {
                    length: 0.6, // // Relative to gauge radius
                    strokeWidth: 0.035, // The thickness
                    color: '#000000' // Fill color
                },
                limitMax: false,     // If false, max value increases automatically if value > maxValue
                limitMin: false,     // If true, the min value of the gauge will be fixed
                colorStart: '#98fb98',   // Colors
                colorStop: '#40c4ff',    // just experiment with them
                strokeColor: '#f44336',  // to see which ones work best for you
                generateGradent: true,
                highDpiSupport: true,     // High resolution support
                
                };

                var target = document.getElementById('ggchart');
                target.style.visibility = 'visible';     // your canvas element
                var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
                gauge.maxValue = 1; // set max gauge value
                gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
                gauge.animationSpeed = 32; // set animation speed (32 is default value)
                gauge.set(per);
                per = per*100.0;

               var finalScores = [scores["Very Negative"], scores["Negative"], scores["Neutral"], scores["Positive"], scores["Very Positive"]];
               var canvas = document.getElementById('tweet-chart'),
                   ctx = canvas.getContext('2d'),
                   startingData = {
                       labels: ["Very Negative", "Negative", "Neutral", "Positive", "Very Positive"],
                       datasets: [
                           {   
                               fillColor: "rgba(100,181,246,0.75)",
                               strokeColor: "rgba(25,118,210,1)",
                               pointColor: "rgba(25,118,210,1)",
                               pointStrokeColor: "#fff",
                               data: finalScores
                           }
                       ]
                   };
        

         
           var tweetChart = new Chart(ctx).Line(startingData, {animationSteps: 50});    
           var canvas2 = document.getElementById('radarchart');
           var ctx2 = canvas2.getContext('2d');
           var data = {
                labels:["Very Negative", "Negative", "Neutral", "Positive", "Very Positive"],
                datasets: [{
                    
                    fillColor: "rgba(100,181,246,0.75)",
                    strokeColor: "rgba(25,118,210,1)",
                    pointColor: "rgba(25,118,210,1)",
                    pointStrokeColor: "#fff",
                    
                    data: finalScores
                }]
            };
            document.getElementById('radcard').style.visibility='visible';
               var myRadarChart = new Chart(ctx2).Radar(data,{animationSteps:50,borderColor:"#fff"});
           
               $scope.tweets = JSON.parse(twitterData[0]);
                $scope.percent = per;
                $scope.disp = disp1;

           });

     
       };
}]);

app.controller("tone-ctrl", ["$scope", "$http", function ($scope, $http) {
    $scope.title = "Political Sentiment Analysis";
    $scope.newtitle = "Tonal Analysis";
    
           $http.get("/tone").then(function (data) {
                newarr = data.data;
                console.log(data.data.length);
                for(i=0;i<newarr.length;i++){
                    console.log(newarr[i]);
                    
                
                    for(j=0;j<newarr[i].length;j++){
                        console.log(newarr[i][j].tone_id);
                        if(newarr[i][j].tone_id == "anger"){
                            angercount += 1;
                            angerscores = angerscores + newarr[i][j].score;
                        }
                        else if(newarr[i][j].tone_id == "fear"){
                            fearcount += 1;
                            fearscores += newarr[i][j].score;
                        }
                        else if(newarr[i][j].tone_id == "joy"){
                            joycount += 1;
                            joyscores += newarr[i][j].score;
                        }
                        else if(newarr[i][j].tone_id == "sadness"){
                            sadnesscount += 1;
                            sadnessscores += newarr[i][j].score;
                        }
                        else if(newarr[i][j].tone_id == "analytical"){
                            analyticalcount += 1;
                            analyticalscores += newarr[i][j].score;
                        }
                        else if(newarr[i][j].tone_id == "confident"){
                            confidentcount += 1;
                            confidentscores += newarr[i][j].score;
                            

                        }
                        else if(newarr[i].tone_id == "tentative"){
                            tentativecount += 1;
                            tentativescores += newarr[i][j].score;

                        }

                    }
                    if(angercount>0){
                        angerscores = angerscores/angercount;
                    }
                    else{
                        angerscores = 0;
                    }

                    if(joycount>0){
                        joyscores = joyscores/joycount;
                    }
                    else{
                        joyscores = 0;
                    }

                    if(fearcount>0){
                        fearscores = fearscores/fearcount;
                    }
                    else{
                        fearscores = 0;
                    }

                    if(analyticalcount>0){
                        analyticalscores = analyticalscores/analyticalcount;
                    }
                    else{
                        analyticalscores = 0;

                    }

                    if(sadnesscount>0){
                        sadnessscores = sadnessscores/sadnesscount;
                    }
                    else{
                        sadnessscores = 0;

                    }

                    if(confidentcount>0){
                        confidentscores = confidentscores/confidentcount;
                    }
                    else{
                        confidentscores = 0
                    }

                    if(tentativecount>0){
                        tentativescores = tentativescores/tentativecount;
                    }
                    else{
                        tentativescores = 0;
                    }
                    
                    
                   
                    
                    
                    
                    

                    
                    tonescores = [angerscores,joyscores,fearscores,analyticalscores,sadnessscores,confidentscores,tentativescores];
                    
                   
                   
let myChart = document.getElementById('myChart').getContext('2d');
if(barchart != undefined){
    barchart.destroy();
}
barchart = new Chart(myChart, {
    type:'horizontalBar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data:{
      labels:["Anger", "Joy", "Fear", "Analytical", "Sadness","Confident","Tentative"],
      datasets:[{
        label:'Score',
        data:tonescores,
        //backgroundColor:'green',
        backgroundColor:[
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderWidth:1,
        borderColor:'#777',
        hoverBorderWidth:3,
        hoverBorderColor:'#000'
      }]
    },
    options:{
      legend:{
        display:true,
        position:'right',
        labels:{
          fontColor:'#000'
        }
      },
      layout:{
        padding:{
          left:50,
          right:0,
          bottom:0,
          top:0
        }
      },
      tooltips:{
        enabled:true
      }
    }
  });


                   
                }

           });

 
       
}]);

// app.controller("tone-ctrl", ["$scope", "$http", function ($scope, $http) {
//     $scope.newtitle = "Tonal Analysis";

//            $http.get("/tone").then(function(data){
//                $scope.chartdata = data;
//            });   

//            }]);

