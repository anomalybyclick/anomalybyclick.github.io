//function to handle the business logic of visualizations based on the anomaly selected
$(".anomaly").on('click', function(){
    console.log($(this).data('anomaly'));
    switch ($(this).data('anomaly')) {
        case 'frequency':
            frequencyVisualizations(0,data_matrix[0].z);
            break;
        case 'duration':
            break;
        case 'position':
            break;
        case 'order':
            break;
        default:
          console.log(`Sorry, we are out of ${expr}.`);
      } 
})

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
    $('#mean').text(cutDecimanlsInString(cosputeMean(y)));
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
    return annotation =
        {
            showarrow: false,
            text: label,
            align: "right",
            x: x0,
            xanchor: "right",
            y: y0,
            yanchor: position
        }
}