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


function durationVisualizations(activityCode, codesMatrix){
    var n_days  = Object.keys(codesMatrix).length;
    var durationsPerDays = [];
    for (let i= 0; i<n_days; i++){
        var tmpMatrix = codesMatrix[i].filter(function (activity){
            return activity == activityCode
        });
        durationsPerDays.push(tmpMatrix.length);
    }
    if(config.timeGranularity === 'hh'){
        console.log('qua');
        durationsPerDays = durationsPerDays.map(function(item) { 
            return item/60;
        });
    }
    console.log(config.timeGranularity);
    plotBarchart(durationsPerDays, n_days);
}

function positionVisualization (activityCode, codesMatrix){
    var n_days  = Object.keys(codesMatrix).length;
    var activityPositionInDays = new Array(1440).fill(0);
    for (let i= 0; i<n_days; i++){
        for (let j = 0; j< 1440; j++){
            if(codesMatrix[i][j] == activityCode){
                activityPositionInDays[j]++;
            }
        }
    }
    if(config.timeGranularity === 'hh'){
        console.log('qua');
        console.log(activityPositionInDays);
        activityPositionInDays = convertToHours(activityPositionInDays);
        plotPositionGraph(activityPositionInDays, 60);
    } else {
        plotPositionGraph(activityPositionInDays);
    }
    
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


function convertToHours(arr, chunkSize=60) {
    const res = [];
    for (let j = 0; j < 1440; j += chunkSize) {
        const chunk = arr.slice(j, j + chunkSize);
        res.push(math.sum(chunk));
    }
    

    console.log(res);
    return res;
}

function clearVisualization (matrix, steps=1){
   /*for (let i = 0; i< 12; i++){
        for (let j = 1; j<1440-steps; j++){
            if(matrix[i][j] !== matrix[i][j-steps] && matrix[i][j] !== matrix[i][j+steps]){
                matrix[i][j] = matrix[i][j-steps];
            }
        }
    }*/
    return matrix;
}


