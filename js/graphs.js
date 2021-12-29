var mainGraph = document.getElementById('mainGraph');
var data_matrix = setGraph(colorscaleValues);
var settings = {displayModeBar: true, scrollZoom: true,modeBarButtonsToRemove: ['toImage', 'toggleSpikelines', 'hoverClosestGl2d', 
'resetViewMapbox', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian']};

var layout = {
  showlegend: true,
  dtick :100,
  margin: {
    l: 100,
    r: 10,
    b: 50,
    t: 30,
    pad: 4
  },
  dragmode:true,
  yaxis: {
  tickmode:'array',
  ticktext:[],
  tickmode:[]
  },
  xaxis:{
    title:"Minutes in a day",
  }
};
Plotly.newPlot('mainGraph', data_matrix,layout,settings);

function setGraph (colorscale, data = [], isGroundTruth = false){
  return [
    {
      z: data,
      colorscale: colorscale,
      type: 'heatmap',
      showscale:true,
      hoverongaps: false,
      colorbar:{
        autotick: false,
        tickmode: "array",
        tickvals: (!isGroundTruth) ? config.codes :[0,1,2,3,4] ,
        ticktext: (!isGroundTruth) ? config.labels : ["No Anomaly","Freqeuncy","Duration","Order","Position"],
        tick0: 0,
        dtick: 1
      }
    }
  ];
}

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
  var tmp = setGraph(colorscaleValues2, dataset.groundTruth, true );
  Plotly.newPlot('mainGraph', tmp,layout,settings);
}

function showDataSource(){
  var tmp = setGraph(colorscaleValues, dataset.sourceData );
  Plotly.newPlot('mainGraph', tmp,layout,settings);
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
    config.dates =  figure.dates;
    config.labels = figure.dictionary.activities;
    config.codes = figure.dictionary.codes;
    config.dataV = renderDropDown(figure.dictionary);
    layout.yaxis.tickvals = reduceTickVals([...Array(math.size(figure.z)[0]).keys()], 15);
    layout.yaxis.ticktext = reduceTickVals(config.dates,15);
    
    frequencyVisualizations(config.activityCode,dataset.sourceData);
    updateHeatmap();
  } );
};


function updateHeatmap(){
  data_matrix[0]['z'] = dataset.sourceData;
  var text = data_matrix[0]['z'].map((row, i) => row.map((item, j) => {
    return `
      Data: ${config.dates[i]}<br>
      valeu: ${translateActivityCode(item)}
      ` 
  }))
  data_matrix[0]['text'] = text;
  data_matrix[0]['hoverinfo'] = 'text';
  data_matrix[0]['colorbar']['tickvals']  = config.codes;
  data_matrix[0]['colorbar']['ticktext'] = config.labels;
  Plotly.redraw('mainGraph');
}



function plotBarchart(y, n_days, type="frequency"){
    var x = [...Array(n_days).keys()];
    var xValue = config.dates;
    var data = {
        x: x,
        y: y,
        type: 'bar',
        marker: {
            color: '#1F3BB3'
        },
        hoverinfo: 'text',
        text: y.map((item, i) => {
          return `
            Data: ${config.dates[i]}<br>
            valeu: ${item}
            ` 
        })
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
          tickvals: reduceTickVals(x,15),
          ticktext : reduceTickVals(xValue,15),
          title: setTitle('Dates')
        },
        yaxis: {
          title: ""
        }      
    };

    setTitleAdditionalGraph((type == "frequency") ? "Frequency of an activity on different days" : "Duration per day");
    if(type == "frequency"){
      layout.yaxis.title = "N. of times the activity accours in a day"; 
    } else {
      layout.yaxis.title = config.timeGranularity == "mm" ? setTitle('Minutes') : setTitle('Hours')
    }

    Plotly.newPlot('infoGraph', [data], layout, {displayModeBar: false});
    setStatisticalInformation(cutDecimanlsInString(computeMean(y)), cutDecimanlsInString(computeStd(y)),
      cutDecimanlsInString(getMin(y)), cutDecimanlsInString(getMax(y)), 
      (type == "frequency") ? 'Information about frequency' : 'Information about duration',
      config.dates[y.indexOf(getMin(y))], config.dates[y.indexOf(getMax(y))]);
  
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
      setTitleAdditionalGraph("Order plot to show activities that precede and succeed the observed ");
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
  setTitleAdditionalGraph("Information about when the activity occurs most");
}

function setStatisticalInformation(mean = 0, std = 0, min = 0, max = 0, text = 'Additional information', dateMin="", dateMax = ""){
  $('#mean').text(mean);
  $('#std').text("±" + std);
  $('#min').text(min);
  $('#max').text(max);
  $('#statisticalAdditionalInformation').text(text);
  $('#dateMin').text(dateMin);
  $('#dateMax').text(dateMax);
}

function setTitleAdditionalGraph(label){
  $('#titleAdditionalGraph').text (label);
}
