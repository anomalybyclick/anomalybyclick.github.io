/**on startup */
setLinkFromCookie();
clickGraph();


$("#datePicker").on("input", function() {
  let index = fromStringToDate(config.dates).indexOf($(this).val());
  if (index < config.dates.length -config.observationWindowSize){
    config.actualDataIndex = index;
    updateHeatmap();
  } else {
    config.actualDataIndex = config.dates.length -config.observationWindowSize;
    updateHeatmap();
  }
});

/**Interaction functions */
$('#dowload').on('click', function(){
  dowload();
});

$('#dataSource').on('click', function(){
  config.isGroundTruth = false;
  updateHeatmap();
  clickGraph();
});

$('#groundtruth').on('click', function(){
  config.isGroundTruth = true;
  updateHeatmap();
  clickGraph();
});

$('#loadDataset').on('click', function(){
  loadDataset(false);
  clickGraph();
});

$('body').on('click', '.activity-dropdown', function () {
  config.activityCode = $(this).data('activityCode');
  config.anomalyDuration = computeMeanDuration( dataset.sourceData);
  $("#messageDropdown").text(translateActivityCode(config.activityCode));
  updateGraphs();
  clickGraph();
});

$(".language").on('click', function(){
  setLanguage($(this).data('language'));
});

$(".anomaly").on('click', function(){
  document.getElementById("infoGraphDiv").scrollIntoView();
  switch ($(this).data('anomaly')) {
      case 'frequency':
          $('#showUpdateDuration').css('visibility', 'hidden');
          config.anomalyCode = 1;
          plotBarchart(frequencyVisualizations(config.activityCode,dataset.sourceData));
          clickGraph();
          break;
      case 'duration':
          $('#showUpdateDuration').css('visibility', 'visible');
          config.anomalyCode = 2;
          plotBarchart(durationVisualizations(config.activityCode,dataset.sourceData));
          clickGraph();
          break;
      case 'position':
          $('#showUpdateDuration').css('visibility', 'hidden');
          config.anomalyCode = 3;
          var steps = (config.timeGranularity === 'hh') ? 1440 : 60;
          plotPositionGraph(positionVisualization(config.activityCode,dataset.sourceData), steps);
          clickGraph();
          break;
      case 'order':
          $('#showUpdateDuration').css('visibility', 'hidden');
          config.anomalyCode = 4;
          var values = orderVisualizations(config.activityCode,dataset.sourceData);
          plotParallelDiagram(values[0], values[1], values[2]);
          clickGraph();
          break;
      default:
        console.log(`Sorry, we are out of ${expr}.`);
  } 
});

//get and set anomaly duration form dropdown menu
$('#updatemAnomalyDuration').on('click', function () {
  config.anomalyDuration = $("#anomalyDuration").val();
});

$(".toggle_option").click(function(){
  config.timeGranularity = ($(this).data('toggle') != 'ss') ? $(this).data('toggle') : 'mm';
  document.getElementById("infoGraphDiv").scrollIntoView();
  updateGraphs();
});

/**functions */
function dowload(){
  var myjson=JSON.stringify(data_matrix);
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(myjson));
  a.setAttribute('download',  "data.json");
  a.click();

  myjson=JSON.stringify(dataset.groundTruth);
  a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(myjson));
  a.setAttribute('download',  "groundtruth.json");
  a.click()
}

function loadDataset(is_index){
  config.link_dataset = $("#link").val().trim();
  document.cookie = "link=" + config.link_dataset;
  if(is_index){
    window.location.href="./pages/home.html";
  }
}

function setLinkFromCookie() {
  if (document.cookie.split(';')[0] != undefined) {
    config.link_dataset = document.cookie.split(';')[0].split("=")[1];
    $("#link").val(config.link_dataset);
    createPlotFromJson(config.link_dataset);
  }
}

function updateGraphs(){
  switch (config.anomalyCode) {
      case 1:
        plotBarchart(frequencyVisualizations(config.activityCode,dataset.sourceData));
        break;
      case 2:
          plotBarchart(durationVisualizations(config.activityCode,dataset.sourceData));
          break;
      case 3:
        var steps = (config.timeGranularity === 'hh') ? 60 : 1440;
          plotPositionGraph(positionVisualization(config.activityCode,dataset.sourceData), steps);
          break;
      case 4:
          var values = orderVisualizations(config.activityCode,dataset.sourceData);
          plotParallelDiagram(values[0], values[1], values[2]);
          break;
      default:
        console.log(`Sorry, we are out of ${expr}.`);
  } 
}