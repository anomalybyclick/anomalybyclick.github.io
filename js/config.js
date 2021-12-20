const config = {
    anomalyDuration : 1,
    activityCode : 1,
    link_dataset: "https://raw.githubusercontent.com/Joker84a/alterdataset/main/datasets/patient_109.json",
    anomalyCode: 0,
    timeGranularity: 'mm',
    nDays: 0
}

const colorscaleValues = [
    [0, 'rgb(0,0,0,0.8)'],
    [0.143, 'rgb(0,0,0,0.8)'], //-1

    [0.143, 'rgb(63,129,110)'],
    [0.286, 'rgb(63,129,110)'], //0

    [0.286, 'rgb(130,0,13)'],
    [0.429, 'rgb(130,0,13)'],//

    [0.429, 'rgb(37,102,162)'],
    [0.572, 'rgb(37,102,162)'],//1

    [0.572, 'rgb(79,42,0)'],
    [0.715, 'rgb(79,42,0)'],//

    [0.715, 'rgb(255,165,48)'],
    [0.858, 'rgb(255,165,48)'],//

    [0.858, 'rgb(192,4,185)'],
    [1.0, 'rgb(192,4,185)'],//

];

const colorscaleValues2 = [
    [0, 'rgb(0,0,0,0.8)'],
    [0.250, 'rgb(0,0,0,0.8)'], //-1

    [0.250, 'rgb(63,129,110)'],
    [0.5, 'rgb(63,129,110)'], //0

    [0.5, 'rgb(130,0,13)'],
    [0.750, 'rgb(130,0,13)'],//

    [0.750, 'rgb(37,102,162)'],
    [0.1, 'rgb(37,102,162)'],//1

];

const dataset ={
    sourceData: [],
    groundTruth: []
}

