var x = 0;
var y = 0;

var x1= 0;
var y1= 0;
var activity = 0;

var type = "point";

var colorscaleValue = [
    [0, 'rgb(165,0,38)'],
    [0.143, 'rgb(165,0,38)'], //-1

    [0.143, 'rgb(215,48,39)'],
    [0.286, 'rgb(215,48,39)'], //0

    [0.286, 'rgb(244,109,67)'],
    [0.429, 'rgb(244,109,67)'],//

    [0.429, 'rgb(253,174,97)'],
    [0.572, 'rgb(253,174,97)'],//1

    [0.572, 'rgb(254,224,144)'],
    [0.715, 'rgb(254,224,144)'],//

    [0.715, 'rgb(224,243,248)'],
    [0.858, 'rgb(224,243,248)'],//

    [0.858, 'rgb(171,217,233)'],
    [1.0, 'rgb(171,217,233)'],//

];


var data_matrix = [
    {
      z: [[1, null, 2, 3, 5], [0, 2, 2, 3, 1], [5, 4, 4,4, 2]],
      colorscale: colorscaleValue,
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


var myPlot = document.getElementById('mainGraph'),
    d3 = Plotly.d3;
    var layout = {
      showlegend: true
  };

Plotly.newPlot('mainGraph', data_matrix,layout,{displayModeBar: false});

myPlot.on('plotly_click', function(data){
    var tmp_x = 0;
    var tmp_y = 0;
    for(var i=0; i < data.points.length; i++){
            tmp_x= data.points[i].x; 
            tmp_y= data.points[i].y;
    }
    console.log(config.anomalyDuration);
    updateMatrixWithShift (parseInt(tmp_x), parseInt(tmp_y), parseInt(tmp_x)+parseInt(config.anomalyDuration));
});


function updateMatrixWithShift (x_cord, y_cord, x1_cord){
  console.log(x1_cord - x_cord);

  for (i = 0; i< (x1_cord - x_cord); i++){
    data_matrix[0]['z'][y_cord][x_cord+i] = activity;
    
  }
  updateHeatmap();
}


function createPlotFromJson(link_dataset_to_load) {
  Plotly.d3.json(link_dataset_to_load, function(figure){ 
    data_matrix[0]['z'] =figure.z;
    updateHeatmap();
  } );
};

function updateHeatmap(){
  Plotly.redraw('mainGraph');
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
}

function plotPositionGraph (y){
  var trace1 = {
    z: [y],
    x: [...Array(1440).keys()],
    y:[-1,-2,-3],
    type: 'heatmap',
  };

  var trace2 = {
    x: [...Array(1440).keys()],
    y: y,
    fill: 'tonexty',
    type: 'scatter',
    line: {shape: 'spline'}
  };

  var layout = {showlegend: false};
  var data = [trace1, trace2];
  Plotly.newPlot('infoGraph', data, layout);
}