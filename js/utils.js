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