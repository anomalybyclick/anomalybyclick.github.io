//get and set activity code form dropdown menu
$('.activity-dropdown').on('click', function () {
    config.activityCode = $(this).data('activityCode');
    console.log(config.activityCode);
});

//function to handle the business logic of visualizations based on the anomaly selected
$(".anomaly").on('click', function(){
    console.log($(this).data('anomaly'));
    switch ($(this).data('anomaly')) {
        case 'frequency':
            config.anomalyCode = 1;
            frequencyVisualizations(0,data_matrix[0].z);
            break;
        case 'duration':
            config.anomalyCode = 2;
            break;
        case 'position':
            config.anomalyCode = 3;
            break;
        case 'order':
            config.anomalyCode = 4;
            orderVisualizations(2,data_matrix[0].z);
            break;
        default:
          console.log(`Sorry, we are out of ${expr}.`);
    } 
});

//get and set anomaly duration form dropdown menu
$('#updatemAnomalyDuration').on('click', function () {
    config.anomalyDuration = $("#anomalyDuration").val();
    console.log(config.anomalyDuration);
});

