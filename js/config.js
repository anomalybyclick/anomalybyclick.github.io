const config = {
    anomalyDuration : 1,
    activityCode : 0,
    link_dataset: "https://raw.githubusercontent.com/Joker84a/alterdataset/main/datasets/ELinus.json",
    anomalyCode: 1,
    timeGranularity: 'mm',
    nDays: 0,
    isSourceData: true,
    dates: [],
    labels: [],
    dataV:{},
    codes:[]
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
    [0.2, 'rgb(0,0,0,0.8)'], //-1

    [0.2, 'rgb(63,129,110)'],
    [0.4, 'rgb(63,129,110)'], //0

    [0.4, 'rgb(130,0,13)'],
    [0.6, 'rgb(130,0,13)'],//

    [0.6, 'rgb(37,102,162)'],
    [0.8, 'rgb(37,102,162)'],//1

    [0.8, 'rgb(8,102,100)'],
    [1.0, 'rgb(8,102,100)'],//1

];

const dataset ={
    sourceData: [],
    groundTruth: []
}

