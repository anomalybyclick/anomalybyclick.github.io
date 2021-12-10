//function to handle the business logic of visualizations based on the anomaly selected
$(".anomaly").on('click', function(){
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
    plotHistogram(hist_values, n_days);
    return hist_values;
}

function removeActivityCodeRepetitions(activitiesCodes){
    var matrix = activitiesCodes.filter(function(item, pos, arr){
        return pos === 0 || item !== arr[pos-1];
    });
    return matrix;
}

function plotHistogram(y, n_days){
    var x = [...Array(n_days).keys()];
    console.log(x)
    var data = {
        x: x,
        y: y,
        type: 'bar',
      };
    Plotly.newPlot('barChart', [data]);
}