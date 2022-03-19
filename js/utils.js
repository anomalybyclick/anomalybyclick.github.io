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
    if(activityCode == -1 || activityCode === undefined) return 'No Activity';
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
    return math.round(math.mean(values), 0);
}

function computeStd(values){
    return  math.round(math.std(values), 1);
}

function getMax(values){
    return  math.round(math.max(values),1);
}

function getMin(values){
    return  math.round(math.min(values),1);
}

function renderDropDown(data){
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

    $.each(dictionary, function(key, v){
        $('#dropdown-activity').append(html.replaceAll('%CODES%', v.code).replaceAll('%LABELS%', v.activity)); 
    })
   
    return dictionary;
}

function reduceTickVals(arr, step=10){
    if(arr.length < 20) return;
    var newArr = arr.filter(n =>arr.indexOf(n) % step == 0)
    return newArr;
}

function convertMinutesIntoMinutesHours(minutes){
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    h = h < 10 ? '0' + h : h; 
    m = m < 10 ? '0' + m : m; 
    return h + ':' + m;
}

function computeMeanDuration(codesMatrix){
    var durationsPerDays = [];
    for (let i= 0; i<config.nDays; i++){
        var tmpMatrix = codesMatrix[i].filter(function (activity){
            return activity == config.activityCode
        });
        durationsPerDays.push(tmpMatrix.length);
    }
    return computeMean(durationsPerDays);
}

function fromStringToDate(array){
    return array.map(date => convertDateStringFormat(date));
}

function convertDateStringFormat(date){
    let tmp = date.split('/');
    return tmp[2]+'-'+tmp[1]+ '-'+tmp[0]
}

function zerosMatrix (rows, columns, fill=0){
    return Array(rows).fill().map(() => Array(columns).fill(fill));
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}




