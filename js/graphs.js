var mainGraph = document.getElementById('mainGraph');
var data_matrix = setGraph(colorscaleValues);
var settings = {displayModeBar: true, scrollZoom: true,modeBarButtonsToRemove: ['toImage', 'toggleSpikelines', 'hoverClosestGl2d', 
'resetViewMapbox', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian']};
const map1 = [...Array(1440).keys()].map(x => convertMinutesIntoMinutesHours(x));

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
    tickmode:'array',
    ticktext: reduceTickVals(map1,100),
    tickvals: reduceTickVals([...Array(1440).keys()], 100),
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
        ticktext: (!isGroundTruth) ? config.labels : ["No Anomaly","Frequency","Duration","Order","Position"],
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
    $("#messageDropdown").text(translateActivityCode(config.activityCode));
    layout.yaxis.tickvals = reduceTickVals([...Array(math.size(figure.z)[0]).keys()], 15);
    layout.yaxis.ticktext = reduceTickVals(config.dates,15);
    
    frequencyVisualizations(config.activityCode,dataset.sourceData);
    updateHeatmap();
    config.anomalyDuration = computeMeanDuration( dataset.sourceData);
  });
};

function updateHeatmap(){
  data_matrix[0]['z'] = dataset.sourceData;
  var textActivity = anomalyTextInfoTranslated ("ACTIVITY");
  var text = data_matrix[0]['z'].map((row, i) => row.map((item, j) => {
    return `
      Data: ${config.dates[i]}<br>
      ${textActivity} ${translateActivityCode(item)}<br>
      Time: ${map1[j]}
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
    var textActivity = anomalyTextInfoTranslated ("ACTIVITY");
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
            ${textActivity}: ${item}
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

    setTitleAdditionalGraph( anomalyTextInfoTranslated ("SECONDGRAPH.TITLE", config.anomalyCode) );
    if(type == "frequency"){
      layout.yaxis.title = anomalyTextInfoTranslated ("SECONDGRAPH.YAXES", 1); 
    } else {
      layout.yaxis.title = config.timeGranularity == "mm" ? setTitle('Minutes') : setTitle('Hours')
    }

    Plotly.newPlot('infoGraph', [data], layout, {displayModeBar: false});

    setStatisticalInformation(computeMean(y), computeStd(y),
      getMin(y), getMax(y), 
      anomalyTextInfoTranslated ("SECONDGRAPH.STATISTICS.STATISTICALINFO", config.anomalyCode),
      config.dates[y.indexOf(getMin(y))], config.dates[y.indexOf(getMax(y))]);

    $("#anomalyDuration").val(config.timeGranularity == "mm" ? computeMean(y) : computeMean(y)*60 );
} 

function plotParallelDiagram(pre, middle, post){
  console.log(pre);
  console.log(post);
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
      setTitleAdditionalGraph(anomalyTextInfoTranslated ("SECONDGRAPH.TITLE", 3));
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
      title: setTitle(anomalyTextInfoTranslated ("SECONDGRAPH.YAXES", 4),12)
    }      
};
  var data = [trace1, trace2];
  Plotly.newPlot('infoGraph', data, layout);
  setStatisticalInformation(cutDecimanlsInString(computeMean(y)), cutDecimanlsInString(computeStd(y)),
  cutDecimanlsInString(getMin(y)), cutDecimanlsInString(getMax(y)), anomalyTextInfoTranslated ("SECONDGRAPH.STATISTICS.STATISTICALINFO", 4));
  setTitleAdditionalGraph(anomalyTextInfoTranslated ("SECONDGRAPH.TITLE", 4));
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
