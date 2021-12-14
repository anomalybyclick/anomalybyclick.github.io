
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