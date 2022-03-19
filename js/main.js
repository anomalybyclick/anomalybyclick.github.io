/**on startup */
setLinkFromCookie(); 
clickGraph(); 


$('body').on('click', '.lang-dropdown', function () {
  updateLanguageMenu(($(this).data('language')));
});

$('body').on('click', '.source-dropdown', function () {
  var val = $(this).data('source');
  $('#dataDropdown').text(val);
  (val === 'original') ? config.isGroundTruth = false : config.isGroundTruth = true;
  updateHeatmap();
  clickGraph();
});

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
          var res = positionVisualization(config.activityCode,dataset.sourceData)
          plotPositionGraph(res[0], res[1]);
          clickGraph();
          break;
      case 'order':
          $('#showUpdateDuration').css('visibility', 'hidden');
          config.anomalyCode = 4;
          var values = orderVisualizations(config.activityCode,dataset.sourceData);
          plotParallelDiagram(values[0], values[2], values[1]);
          clickGraph();
          break;
      default:
        console.log(`Sorry, we are out of ${expr}.`);
  } 
});

const durationInput = document.getElementById('anomalyDuration');
durationInput.addEventListener('input', updateValue);
function updateValue(e) {
  config.anomalyDuration = e.target.value;
  console.log(config.anomalyDuration)
}

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
  setCookie("abclink", config.link_dataset, 1000);
  if(is_index){
    window.location.href="./pages/home.html";
  } else {
    setLinkFromCookie()
  }
}

function setLinkFromCookie() {
  if (getCookie("abclink") != undefined) {
    config.link_dataset = getCookie("abclink");
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
        //var steps = (config.timeGranularity === 'hh') ? 60 : 1440;
        var res = positionVisualization(config.activityCode,dataset.sourceData)
        plotPositionGraph(res[0], res[1]);
        break;
      case 4:
        var values = orderVisualizations(config.activityCode,dataset.sourceData);
        plotParallelDiagram(values[0], values[2], values[1]);
        break;
      default:
        console.log(`Sorry, we are out of ${expr}.`);
  } 
}


/****/ 


