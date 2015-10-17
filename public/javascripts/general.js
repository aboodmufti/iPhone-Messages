$(function(){

    $('.timePicker').timepicker({
        'step' : 5,
        'useSelect': true
    
    });
    
    if($('#no_elements').val() == false){
        $('.course_info').remove();
    }
    
});