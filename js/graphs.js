var mainGraph = document.getElementById('mainGraph');
var data_matrix = setGraph(colorscaleValues);
var settings = {displayModeBar: false, scrollZoom: false,modeBarButtonsToRemove: ['toImage', 'toggleSpikelines', 'hoverClosestGl2d', 
'resetViewMapbox', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian']} ;
const map1 = [...Array(1440).keys()].map(x => convertMinutesIntoMinutesHours(x)); // minuti convertiti in ore

var layout = {
  showlegend: true,
  dtick :100,
  margin: {
    l: 100,
    r: 50,
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
    title:"Time",
    tickmode:'array',
    ticktext: reduceTickVals(map1,100),
    tickvals: reduceTickVals([...Array(1440).keys()], 100),
  },
  modebar: {
    orientation: 'v',
    bgcolor: 'white',
    color: '#1F3BB3',
    activecolor: '#9ED3CD'
  },
  
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

function filterSourceData(data){
  return data.slice(config.actualDataIndex,config.actualDataIndex+config.observationWindowSize);
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
        updateGraphs()
    });
    
  }
}

function updateMatrixWithAnomaly(x_cord, y_cord, x1_cord){
  for (i = 0; i< (x1_cord - x_cord); i++){
    data_matrix[0]['z'][y_cord][x_cord+i] = config.activityCode; // aggiornamento visuale
    dataset.sourceData[y_cord+config.actualDataIndex][x_cord+i] = config.activityCode; // aggiornamento della matrice sorgente
  }
  updateHeatmap();
}

function updateGroundTruth(x_cord, y_cord, x1_cord ){
  for (i = 0; i< (x1_cord - x_cord); i++){
    dataset.groundTruth[y_cord+config.actualDataIndex][x_cord+i] = config.anomalyCode;
  }
}

function createPlotFromJson(linkToOnlineDataset) {
  Plotly.d3.json(linkToOnlineDataset, function(figure){ 
    console.log(figure)
    dataset.sourceData = figure.z;
    config.nDays = math.size(dataset.sourceData)[0]
    dataset.groundTruth = figure.anomalies//zerosMatrix(config.nDays, 1440, 0);
    config.dates =  figure.dates;
    config.labels = figure.dictionary.activities;
    config.codes = figure.dictionary.codes;
    config.dataV = renderDropDown(figure.dictionary);
    config.anomalyDuration = computeMeanDuration( dataset.sourceData);

    $("#messageDropdown").text(translateActivityCode(config.activityCode));
    $('#datePicker').val(fromStringToDate(config.dates)[0]);
    $('#datePicker').attr('min', fromStringToDate(config.dates)[0]);
    $('#datePicker').attr('max', fromStringToDate(config.dates).at(-1));

    layout.yaxis.tickvals = reduceTickVals([...Array(math.size(figure.z)[0]).keys()], 15);
    layout.yaxis.ticktext = reduceTickVals(config.dates,15);

    plotBarchart(frequencyVisualizations(config.activityCode,dataset.sourceData));
    updateHeatmap();
  });
};

function updateHeatmap(){
  // data_matrix[0]['z'] = filterSourceData(dataset.sourceData);
  data_matrix[0]['z'] = (!config.isGroundTruth) ? filterSourceData(dataset.sourceData) :filterSourceData(dataset.groundTruth);
  var textActivity = anomalyTextInfoTranslated("ACTIVITY");
  var text = data_matrix[0]['z'].map((row, i) => row.map((item, j) => {
    return `
      Data: ${config.dates[i]}<br>
      ${textActivity} ${translateActivityCode(item)}<br>
      Time: ${map1[j]}
      `
  }));

  data_matrix[0]['text'] = text;
  data_matrix[0]['hoverinfo'] = 'text';
  
  data_matrix[0]['colorbar']['tickvals'] = (!config.isGroundTruth) ? config.codes :[0,1,2,3,4];
  data_matrix[0]['colorbar']['ticktext']  = (!config.isGroundTruth) ? config.labels : ["No Anomaly","Frequency","Duration","Order","Position"],
  data_matrix[0]['colorscale'] = (!config.isGroundTruth) ? colorscaleValues :colorscaleValues2;


  Plotly.redraw('mainGraph');
}

function confirmOrDropAnomaly(type='bar'){
    document.getElementById('infoGraph').on('plotly_click', function(data){
     
      if(type == 'bar'){
        if (data.points[0]['marker.color'] == 'red'){
          if (window.confirm("Do you really want to leave?")) {
            dataset.groundTruth[data.points[0].x] = dataset.groundTruth[data.points[0].x].map(function(v){
              return 0
            })
            updateGraphs()
          }
        }
      } else if (type == 'sankey'){
        if(data.points[0].source.label.includes("!") || true){
          for (i= 0; i<dataset.sourceData.length; i++){
            for (j=0; j<dataset.sourceData[i].length;j++){
              if(translateActivityCode(dataset.sourceData[i][j]) == data.points[0].target.label.replace("!","") && dataset.groundTruth[i][j] == 4)
                dataset.groundTruth[i][j] = 0
                
                
            }
          }
          updateGraphs()
        }
      } else {
        console.log(data.points[0])
      }
    });
}

function plotBarchart(y, type){
    var x = [...Array(config.nDays).keys()];
    var xValue = config.dates;    
    var data = {
        x: x,
        type: 'bar',
        marker: {
            color: '#1F3BB3'
        },
        hoverinfo: 'text',
        text: y.map((item, i) => {
          return `Data: ${config.dates[i]}<br>
                  Value: ${item}` 
        })
    };

    // assign data to y without anomalies
    data.y = y.map(function (v) {
      if(config.anomalyCode == 1)
        return v % 10 == 0 ? v/10 : v
      else 
        return typeof v  == 'string' ? parseInt(v.replace('!','')) : v
    });
    // detect anomalies by dividing by 10
    data.marker.color = y.map(function (v) {
      if(config.anomalyCode == 1)
        return v % 10 == 0 ? 'red' : '#1F3BB3'
      else
        return typeof v  == 'string' ? 'red' : '#1F3BB3'
    });
   
    var mean = computeMean(data.y);
    var upperStd = computeMean(data.y)+computeStd(data.y);
    var lowerStd = computeMean(data.y)-computeStd(data.y);
    
    var layout = {
        showlegend: false,
        margin: {
          l: 100,
          r: 80,
          b: 100,
          t: 30,
          pad: 4
        },
        shapes: [createOrizontalLine(0,mean,config.nDays,mean),
            createOrizontalLine(0,upperStd,config.nDays,upperStd),
            createOrizontalLine(0,lowerStd,config.nDays,lowerStd)
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
    layout.yaxis.title = anomalyTextInfoTranslated ("SECONDGRAPH.YAXES", config.anomalyCode); 
    Plotly.newPlot('infoGraph', [data], layout, {displayModeBar: false});

    confirmOrDropAnomaly('bar')

    setStatisticalInformation(computeMean(data.y), computeStd(data.y),
        getMin(data.y), getMax(data.y), 
        anomalyTextInfoTranslated ("SECONDGRAPH.STATISTICS.STATISTICALINFO", config.anomalyCode),
        config.dates[data.y.indexOf(getMin(data.y))], config.dates[data.y.indexOf(getMax(data.y))]);

    $("#anomalyDuration").val(config.timeGranularity == "mm" ? computeMean(data.y) : computeMean(data.y)*60 );
} 

function plotParallelDiagram(pre, middle, post){
    var preArray = pre.filter(onlyUnique);
    var postArray = post.filter(onlyUnique);
    var middleArray = middle.filter(onlyUnique);

    var countsMiddle = {};
    var countsPost = {};
    pre.forEach(function (x) { countsMiddle[x] = (countsMiddle[x] || 0) + 1; })
    post.forEach(function (x) { countsPost[x] = (countsPost[x] || 0) + 1; })
    var values = Object.values(countsMiddle).concat(Object.values(countsPost))

    labels = preArray.concat(middleArray, postArray)
    colors = labels.map(function(v){
      return v.includes("!") ? "red": "blue";
    })
    source = [...Array(preArray.length ).keys()]
    source = source.concat(new Array(postArray.length).fill(preArray.length))

    target = new Array(preArray.length).fill(preArray.length)
    target = target.concat(range(preArray.length+1, preArray.length+postArray.length))

    var trace1 = {
      type: "sankey",
      orientation: "h",
      node: {
        pad: 15,
        thickness: 30,
        line: {
          color: "black",
          width: 0.5
        },
       label: labels,
       color: colors
      },

      link: {
        source: source,
        target: target,
        value:  values
      }
    }

    var data = [ trace1 ];
    Plotly.newPlot('infoGraph', data);
    confirmOrDropAnomaly('sankey')
    setStatisticalInformation();
    setTitleAdditionalGraph(anomalyTextInfoTranslated ("SECONDGRAPH.TITLE", 3));
}

function plotPositionGraph (y, steps=1440){
  
  var trace2 = {
    x: [...Array(steps).keys()],
    y: y,
    fill: 'tonexty',
    type: 'scatter',
    line: {shape: 'spline'}
  };
  var layout = {
    showlegend: false,
    margin: {
      l: 100,
      r: 80,
      b: 100,
      t: 30,
      pad: 4
    },
    xaxis: {
      title: setTitle('Hours'),
      tickmode:'array',
      ticktext: reduceTickVals(map1,100),
      tickvals: reduceTickVals([...Array(1440).keys()], 100),
    },
    yaxis: {
      title: setTitle(anomalyTextInfoTranslated ("SECONDGRAPH.YAXES", 4),12),
    }      
};
  var data = [ trace2];
  Plotly.newPlot('infoGraph', data, layout);
  confirmOrDropAnomaly('postion')
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
