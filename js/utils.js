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
  switch (activityCode) {
      case 1:
          return '';
      case 0:
          return 'Bed';
      case 2:
          return 'Court';
      case 3:
          return 'Hygine';
      case 4:
          return 'Dining Room';
      case 5:
          return 'WC';
      case 6:
          return 'Recreation Room';
      default:
        console.log(`Sorry, we are out of.`);
        return 'No activity'
  }
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