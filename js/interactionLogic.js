//get and set activity code form dropdown menu
$('.activity-dropdown').on('click', function () {
    setActivityCode($(this).data('activityCode'));
});

//function to handle the business logic of visualizations based on the anomaly selected
$(".anomaly").on('click', function(){
    console.log($(this).data('anomaly'));
    switch ($(this).data('anomaly')) {
        case 'frequency':
            frequencyVisualizations(0,data_matrix[0].z);
            break;
        case 'duration':
            break;
        case 'position':
            break;
        case 'order':
            orderVisualizations(2,data_matrix[0].z);
            break;
        default:
          console.log(`Sorry, we are out of ${expr}.`);
    } 
});

//get and set anomaly duration form dropdown menu
$('#updatemAnomalyDuration').on('click', function () {
    setAnomalyDuration($("#anomalyDuration").val());
})
