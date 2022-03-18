function frequencyVisualizations(activityCode, codesMatrix){
    var hist_values = new Array(config.nDays).fill(0);
    for (let i= 0; i<config.nDays; i++){
        var day = removeActivityCodeRepetitions(codesMatrix[i]);
        var anomalies = removeActivityCodeRepetitions(dataset.groundTruth[i])
        hist_values[i] = day.filter(x => x === activityCode).length;
        var tmp = anomalies.filter(x => x === 1).length
        if(tmp !=0){
            hist_values[i] = hist_values[i] * 10
        }
    }
    return hist_values;
}

function removeActivityCodeRepetitions(activitiesCodes){
    var matrix = activitiesCodes.filter(function(item, pos, arr){
        return pos === 0 || item !== arr[pos-1];
    });
    return matrix;
}


function cutDecimanlsInString(valueLabel, length = 4){
    valueLabel = valueLabel.toString();
    return valueLabel.substring(0, length);
}


function orderVisualizations(activityCode, codesMatrix){
    var preActivities = [];
    var postActivities = [];
    for (let i= 0; i<config.nDays; i++){
        var day = removeActivityCodeRepetitions(codesMatrix[i]);
        day.filter(function(array, index) {
            if(array == activityCode && (index+1)<config.nDays && (index-1)>0){
                postActivities.push(translateActivityCode(day[index+1]));
                preActivities.push(translateActivityCode(day[index-1]));
            }
        });
    }
    return [preActivities, postActivities, [...Array(preActivities.length).fill(translateActivityCode(activityCode))]];
    // plotParallelDiagram(preActivities, [...Array(preActivities.length).fill(translateActivityCode(activityCode))], postActivities);
}


function durationVisualizations(activityCode, codesMatrix){
    var durationsPerDays = [];
    for (let i= 0; i<config.nDays; i++){
        var tmpMatrix = codesMatrix[i].filter(function (activity){
            return activity == activityCode
        });
        durationsPerDays.push(tmpMatrix.length);
    }
    if(config.timeGranularity === 'hh'){
        durationsPerDays = durationsPerDays.map(function(item) { 
            return item/60;
        });
    }
   
    return durationsPerDays;
}


function positionVisualization (activityCode, codesMatrix){
   
    var activityPositionInDays = new Array(1440).fill(0);
    for (let i= 0; i<config.nDays; i++){
        for (let j = 0; j< 1440; j++){
            if(codesMatrix[i][j] == activityCode){
                activityPositionInDays[j]++;
            }
        }
    }
    /*if(config.timeGranularity === 'hh'){
        activityPositionInDays = convertToHours(activityPositionInDays);
        plotPositionGraph(activityPositionInDays, 60);
    } else {
        plotPositionGraph(activityPositionInDays);
    }*/

    return activityPositionInDays;
    
}


