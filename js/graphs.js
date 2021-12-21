
var data_matrix = [
    {
      z: [[1, null, 2, 3, 5], [0, 2, 2, 3, 1], [5, 4, 4,4, 2]],
      colorscale: colorscaleValues,
      type: 'heatmap',
      showscale:true,
      hoverongaps: false,
      colorbar:{
        autotick: false,
        tickmode: "array",
        tickvals: [-1,0,1,2,3,4,5],
        ticktext: ["No activity","Bed","Court","Dining room","Recreation room","Hygine","WC"],
        tick0: 0,
        dtick: 1
      }
    }
  ];
  
var mainGraph = document.getElementById('mainGraph');
var layout = {
  showlegend: true,
  margin: {
    l: 60,
    r: 10,
    b: 0,
    t: 10,
    pad: 4
  }
};


Plotly.newPlot('mainGraph', data_matrix,layout,{displayModeBar: false});

function clickGraph(){
  if(config.isSourceData) {
    document.getElementById('mainGraph').on('plotly_click', function(data){

        var tmp_x = 0;
        var tmp_y = 0;
        for(var i=0; i < data.points.length; i++){
                tmp_x= data.points[i].x; 
                tmp_y= data.points[i].y;
        }
        updateGroundTruth(parseInt(tmp_x), parseInt(tmp_y), parseInt(tmp_x)+parseInt(config.anomalyDuration));
        updateMatrixWithAnomaly(parseInt(tmp_x), parseInt(tmp_y), parseInt(tmp_x)+parseInt(config.anomalyDuration));
    });
  }
}



function showGroundtruth(){
  var tmp = [
    {
      z: dataset.groundTruth,
      colorscale: colorscaleValues2,
      type: 'heatmap',
      showscale:true,
      hoverongaps: false,
      colorbar:{
        autotick: false,
        tickmode: "array",
        tickvals: [0,1,2,3,4],
        ticktext: ["No anomaly","Freqeuncy","Duration","Position","Order"],
        tick0: 0,
        dtick: 1
      }
    }
  ];

  Plotly.newPlot('mainGraph', tmp,layout,{displayModeBar: false});
}

function showDataSource(){
  var tmp = [
    {
      z: dataset.sourceData,
      colorscale: colorscaleValues,
      type: 'heatmap',
      showscale:true,
      hoverongaps: false,
      colorbar:{
        autotick: false,
        tickmode: "array",
        tickvals: [-1,0,1,2,3,4,5],
        ticktext: ["No activity","Bed","Court","Dining room","Recreation room","Hygine","WC"],
        tick0: 0,
        dtick: 1
      }
    }
  ];

  Plotly.newPlot('mainGraph', tmp,layout,{displayModeBar: false});
}

function updateMatrixWithAnomaly(x_cord, y_cord, x1_cord){
  console.log('sono qua');
  for (i = 0; i< (x1_cord - x_cord); i++){
    data_matrix[0]['z'][y_cord][x_cord+i] = config.activityCode;
  }
  updateHeatmap();
}

function updateGroundTruth(x_cord, y_cord, x1_cord){
  for (i = 0; i< (x1_cord - x_cord); i++){
    dataset.groundTruth[y_cord][x_cord+i] = config.anomalyCode;
  }
}

function createPlotFromJson(linkToOnlineDataset) {
  Plotly.d3.json(linkToOnlineDataset, function(figure){ 
    dataset.sourceData = figure.z;
    config.nDays = math.size(dataset.sourceData)[0]
    dataset.groundTruth = Array(config.nDays).fill().map(() => Array(1440).fill(0))
    frequencyVisualizations(config.activityCode,dataset.sourceData);
    updateHeatmap();
  } );
};

function updateHeatmap(){
  data_matrix[0]['z'] = dataset.sourceData;
  Plotly.redraw('mainGraph');
}

function plotBarchart(y, n_days){
    var x = [...Array(n_days).keys()];
    var xValue = ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data8', 'data9', 'data10', 'data11', 'data12'];
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
        createAnnotations('mean', 0, mean) ],
        xaxis: {
          tickmode: "array",
          tickvals: x,
          ticktext : xValue,
          title: setTitle('Dates')
        },
        yaxis: {
          title: config.timeGranularity == "mm" ? setTitle('Minutes') : setTitle('Hours')
        }      
    };
    Plotly.newPlot('infoGraph', [data], layout, {displayModeBar: false});
    setStatisticalInformation(cutDecimanlsInString(computeMean(y)), cutDecimanlsInString(computeStd(y)),
      cutDecimanlsInString(getMin(y)), cutDecimanlsInString(getMax(y)), 'Information about frequency');
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
      Plotly.newPlot('infoGraph', data);
      setStatisticalInformation();
}

function plotPositionGraph (y, steps=1440){
  console.log(Array.from({length:50},(v,k)=>k-50).reverse())
  var trace1 = {
    z: [y],
    x: [...Array(steps).keys()],
    y:Array.from({length:50},(v,k)=>k-50).reverse(),
    type: 'heatmap',
  };
  var trace2 = {
    x: [...Array(steps).keys()],
    y: y,
    fill: 'tonexty',
    type: 'scatter',
    line: {shape: 'spline'}
  };
  var layout = {
    showlegend: false,
    xaxis: {
      title:  config.timeGranularity == "mm" ? setTitle('Minutes') : setTitle('Hours')
    },
    yaxis: {
      title: setTitle('N. of times the activity occurs',12)
    }      
};
  var data = [trace1, trace2];
  Plotly.newPlot('infoGraph', data, layout);
  setStatisticalInformation(cutDecimanlsInString(computeMean(y)), cutDecimanlsInString(computeStd(y)),
  cutDecimanlsInString(getMin(y)), cutDecimanlsInString(getMax(y)), 'Statistical information about number of times an activity occures in that time location in a day');
}

function setStatisticalInformation(mean = 0, std = 0, min = 0, max = 0, text = 'Additional information'){
  $('#mean').text(mean);
  $('#std').text("±" + std);
  $('#min').text(min);
  $('#max').text(max);
  $('#statisticalAdditionalInformation').text(text);
}

