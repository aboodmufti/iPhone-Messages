$(function(){

    //get Events + display calendar
    var getEvents = function(data){
        var events_arr = [];
        console.log(data);
        for(i=0; i<data["events"].length; ++i){
            if(data["events"][i].start_date != null && data["events"][i].end_date != null){
                events_arr.push({
                    title: data["events"][i].event_name,
                    start : data["events"][i].start_date,
                    end: data["events"][i].end_date,
                    backgroundColor: "#E8F8FF",
                    borderColor:"#B2E6FF",
                    textColor: "black"
                });
            }
            else if( data["events"][i].one_date != null ){
                events_arr.push({
                    title: data["events"][i].event_name,
                    start : data["events"][i].one_date,
                    backgroundColor: "#E8F8FF",
                    borderColor:"#B2E6FF",
                    textColor: "black"
                });
            }
            
        }
        var components_arr = [];
        for(i=0; i<data["components"].length; ++i){
            if(data["components"][i].date == "" || data["components"][i].date == null){
                continue;
            }
            else{
                components_arr.push({
                    title: data["components"][i].course_code +" : "+ data["components"][i].component_name,
                    start : data["components"][i].date,
                    backgroundColor: "#CBF0BB",
                    borderColor:"#B5D7A7",
                    textColor: "black",
                    url: "/courses/specificCourse/"+data["components"][i].course_code
                });
            }
            
        }
        var full_arr = components_arr.concat(events_arr)
        
        $('#calendar').fullCalendar({
        events: full_arr,
            firstDay: 1,
            height: "auto",
            header: {
                    left:'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek'
                    },
            eventRender: function(event, element)
                        { 
                            element.find('.fc-event-title').append("<br/>" + event.description); 
                        }
        });
    
    }
    
    $.getJSON("/courses/getEvents", getEvents)
    


});