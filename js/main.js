//https://raw.githubusercontent.com/Joker84a/alterdataset/main/datasets/patient_109.json
var x = 0;
var y = 0;

var a = nj.array([2,3,4]);
console.log(a);


var x1= 0;
var y1= 0;
var activity = 0;

var type = "point";
var isShift= false;
var link_dataset="https://raw.githubusercontent.com/Joker84a/alterdataset/main/datasets/patient_109.json";

var colorscaleValue = [
            [0, 'rgb(165,0,38)'],
            [0.1, 'rgb(165,0,38)'],
    
            [0.1, 'rgb(215,48,39)'],
            [0.2, 'rgb(215,48,39)'],
    
            [0.2, 'rgb(244,109,67)'],
            [0.3, 'rgb(244,109,67)'],
    
            [0.3, 'rgb(253,174,97)'],
            [0.4, 'rgb(253,174,97)'],
    
            [0.4, 'rgb(254,224,144)'],
            [0.5, 'rgb(254,224,144)'],
    
            [0.5, 'rgb(224,243,248)'],
            [0.6, 'rgb(224,243,248)'],
    
            [0.6, 'rgb(171,217,233)'],
            [0.7, 'rgb(171,217,233)'],
    
            [0.7, 'rgb(116,173,209)'],
            [0.8, 'rgb(116,173,209)'],
    
            [0.8, 'rgb(69,117,180)'],
            [0.9, 'rgb(69,117,180)'],
    
            [0.9, 'rgb(49,54,149)'],
            [1.0, 'rgb(49,54,149)']
        
];

var data_matrix = [
  {
    z: [[1, null, 2, 3, 5], [0, 2, 2, 3, 1], [5, 4, 4,4, 2]],
    colorscale: colorscaleValue,
    type: 'heatmap',
    showscale:false,
    hoverongaps: false,
    colorbar:{
      autotick: true,
      tick0: 0,
      dtick: 1
    }
  }
];




$('.dropdown-toggle').on('show.bs.dropdown', function () {
  console.log($(this).html());
})

/**on startup page */
setLinkFromCookie();



/**functions */
function setLinkFromCookie() {
  if (document.cookie.split(';')[0] != undefined) {
    link_dataset = document.cookie.split(';')[0].split("=")[1];
    console.log(document.cookie.split(';')[0].split("=")[1]);
    $("#link").val(link_dataset);
    createPlotFromJson(link_dataset);
  }
}


function checkMode(anomaly) {
    if (anomaly.checked) {
        type = anomaly.value;
        console.log(type);
    }
}

/*
var slider = document.getElementById("myRange");
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  activity = this.value;
  $("#activity_selected").html(activity);

}*/

/**plot */

var myPlot = document.getElementById('myDiv'),
    d3 = Plotly.d3;

    var layout = {
      showlegend: true
  };

Plotly.newPlot('myDiv', data_matrix,layout,{displayModeBar: false});

myPlot.on('plotly_click', function(data){
    var tmp_x = 0;
    var tmp_y = 0;
    for(var i=0; i < data.points.length; i++){
            tmp_x= data.points[i].x; 
            tmp_y= data.points[i].y;
    }
    if (type == "point") {
      console.log(activity);
      data_matrix[0]['z'][tmp_y][tmp_x] = activity;
      updateHeatmap();
    } else if (type == "shift") {
      if (isShift== false) {
        x = tmp_x;
        y = tmp_y;
        isShift=true;
      } else {
        x1 = tmp_x;
        isShift=false;
        updateMatrixWithShift (x, y, x1)
      }
    }
    
    
});



function updateMatrixWithShift (x_cord, y_cord, x1_cord){
  console.log(x1_cord - x_cord);
  if(x1_cord - x_cord<0) {
    return;
  };
  for (i = 0; i< (x1_cord - x_cord); i++){
    data_matrix[0]['z'][y_cord][x_cord+i] = activity;
    updateHeatmap();
  }
}


function createPlotFromJson(link_dataset_to_load) {
  Plotly.d3.json(link_dataset_to_load, function(figure){ 
    data_matrix[0]['z'] =figure.z;
    updateHeatmap();
  } );
};

function updateHeatmap(){
  Plotly.redraw('myDiv');
}

/*****onclick********/
function loadDataset(is_not_home){
  console.log($("#link").val().trim())
  link_dataset = $("#link").val().trim();
  document.cookie = "link=" + link_dataset;
  if(is_not_home){
    window.location.href="./pages/home.html";
  }
};

function dowload(){
  var myjson=JSON.stringify(data_matrix);
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(myjson));
  a.setAttribute('download',  "filename.json");
  a.click()

}