
function frequencyVisualizations(activityCode, codesMatrix){
    var n_days  = Object.keys(codesMatrix).length;
    var hist_values = new Array(n_days).fill(0);
    for (let i= 0; i<n_days; i++){
        var day = removeActivityCodeRepetitions(codesMatrix[i]);
        hist_values[i] = day.filter(x => x === activityCode).length;
    }
    plotBarchart(hist_values, n_days);
    return hist_values;
}

function removeActivityCodeRepetitions(activitiesCodes){
    var matrix = activitiesCodes.filter(function(item, pos, arr){
        return pos === 0 || item !== arr[pos-1];
    });
    return matrix;
}

function plotBarchart(y, n_days){
    var x = [...Array(n_days).keys()];
    console.log(x)
    var data = {
        x: x,
        y: y,
        type: 'bar',
        marker: {
            color: '#1F3BB3'
        }
    };
    var mean = computeMean(y);
    var upperStd = computeMean(y)+computeStd(y);
    var lowerStd = computeMean(y)-computeStd(y);
    var layout = {
        showlegend: false,
        shapes: [createOrizontalLine(0,mean,n_days,mean),
            createOrizontalLine(0,upperStd,n_days,upperStd),
            createOrizontalLine(0,lowerStd,n_days,lowerStd)
        ],
        annotations:[ createAnnotations('-std', 0, lowerStd), 
        createAnnotations('+std', 0, upperStd),
        createAnnotations('mean', 0, mean) ]  
    };

    Plotly.newPlot('infoGraph', [data], layout, {displayModeBar: false});
    $('#mean').text(cutDecimanlsInString(computeMean(y)));
    $('#std').text("±" + cutDecimanlsInString(computeStd(y)));
    $('#min').text(cutDecimanlsInString(getMin(y)));
    $('#max').text(cutDecimanlsInString(getMax(y)));
}

function computeMean(values){
    return math.mean(values);
}

function computeStd(values){
    return math.std(values);
}

function getMax(values){
    return math.max(values);
}

function getMin(values){
    return math.min(values);
}

function cutDecimanlsInString(valueLabel, length = 4){
    valueLabel = valueLabel.toString();
    return valueLabel.substring(0, length);
}

function createOrizontalLine(x0,y0,x1,y1, label){
    return line = {
        type: 'line',
        xref: 'paper',
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        line: {
            color: '#52CDFF',
            width: 2,
            dash: 'dot'
        }
    }
}

function createAnnotations(label, x0,y0, position="top"){
    return annotation = {
            showarrow: false,
            text: label,
            align: "right",
            x: x0,
            xanchor: "right",
            y: y0,
            yanchor: position
        }
}


function orderVisualizations(activityCode, codesMatrix){
    var n_days  = Object.keys(codesMatrix).length;
    var preActivities = [];
    var postActivities = [];
    for (let i= 0; i<n_days; i++){
        var day = removeActivityCodeRepetitions(codesMatrix[i]);
        day.filter(function(array, index) {
            
            if(array == activityCode && (index+1)<n_days && (index-1)>0){
                postActivities.push(translateActivityCode(day[index+1]));
                preActivities.push(translateActivityCode(day[index-1]));
            }
        });
    }
    plotParallelDiagram(preActivities, [...Array(preActivities.length).fill(translateActivityCode(activityCode))], postActivities);
}

function plotParallelDiagram(pre, middle, post){
    var trace1 = {
        type: 'parcats',
        line: {color: '#1F3BB3'},
        dimensions: [
          {label: 'PreActivity',
           values: pre},
          {label: 'Activity',
           values: middle},
          {label: 'PostActivity',
           values: post}]
      };
      var data = [ trace1 ];

      /*var trace2 = {
        x: [0,1, 2],
        y: [20, 1, 60],
        mode: 'lines',
        line: {'shape': 'spline', 'smoothing': 1.3}
      };
      var data = [
  
        {
          z: [[20,1,60]],
          x: [0,1,2],
          y:['ciao1'],
    
          type: 'heatmap'
        }  ,trace2,
      ];*/
      


      Plotly.newPlot('infoGraph', data);
}

function translateActivityCode(activityCode){
    switch (activityCode) {
        case 0:
            return '';
        case 1:
            return 'Bed';
        case 2:
            return 'Court';
        case 3:
            return 'Hygine';
        case 4:
            return 'Dining Room';
        case 5:
            return 'WC';
        case 6:
            return 'Recreation Room';
        default:
          console.log(`Sorry, we are out of ${expr}.`);
          return 'No activity'
    }
}