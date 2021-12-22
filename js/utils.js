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

function setTitle (label, font=18){
  var title = {
    text: label,
    font: {
      family: 'Courier New, monospace',
      size: font,
      color: '#7f7f7f'
    }
  };
  return title;
}

function translateActivityCode(activityCode){
    console.log(activityCode);
    if(activityCode == -1) return 'No Activity';
    return config.dataV[activityCode].activity;
 
}

function convertToHours(arr, chunkSize=60) {
  const res = [];
  for (let j = 0; j < 1440; j += chunkSize) {
      const chunk = arr.slice(j, j + chunkSize);
      res.push(math.sum(chunk));
  }
  return res;
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

function renderDropDown(data){
    console.log(data);
    var html = `
    <a class="dropdown-item preview-item activity-dropdown" data-activity-code= "%CODES%">
    <div class="preview-item-content flex-grow py-2">
      <p class="preview-subject ellipsis font-weight-medium text-dark" > %LABELS%</p>
      <p class="fw-light small-text mb-0">Code %CODES% </p>
    </div>
  </a>
    `;

    var dictionary = {};

    for (var i = 0; i< Object.keys(data.codes).length; i++){
        dictionary[data.codes[i]] = {'code': data.codes[i],'activity':  data.activities[i]};
    }
    config.dataV = dictionary;
    console.log(config.dataV);

    $.each(dictionary, function(key, v){
        $('.dropdown-menu').append(html.replaceAll('%CODES%', v.code).replaceAll('%LABELS%', v.activity));
    })
    return dictionary;
}

function _empty(obj,arr_values){
    if(obj.constructor === Object && Object.keys(obj).length === 0  )
     return true;
    if(arr_values.length != 0 && Object.keys(obj).length !== 0 && obj.constructor === Object ){
     if(obj.constructor === Object && !obj.hasOwnProperty(arr_values[0])) 
      return true;
     if (arr_values.length ==1 && obj[arr_values[0]].constructor === Object && Object.keys(obj[arr_values[0]]).length !== 0 )
      return false;
     if(obj[arr_values[0]].constructor !== Object && obj[arr_values[0]]=="")
      return true;
     if(obj[arr_values[0]].constructor !== Object && obj[arr_values[0]]!="" )
      return false;
     if (arr_values.length >1 && obj[arr_values[0]].constructor === Object && Object.keys(obj[arr_values[0]]).length !== 0 ) {
      current_elm=arr_values.shift();
      return _empty(obj[current_elm],arr_values);
     }
    }
    return true;
   }