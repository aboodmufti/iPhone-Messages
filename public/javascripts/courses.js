
$(function(){
    //Adding components
    var num_components = 1;

    $("#plus").on("click", function(){
     ++num_components;
     $("#components_div").append('\
     <div id="table_'+num_components+'">\
     <table>\
        <tr>\
          <td>Component '+ num_components +' Name :</td>\
          <td>\
            <input type="text" name="component_name_'+num_components+'" placeholder="Assignment, Exam, Essay,..." id="component_name_'+num_components+'">\
          </td>\
        </tr>\
        <tr>\
          <td>Weight:</td>\
          <td>\
            <input type="number" name="weight_'+num_components+'" placeholder="25" id="weight_'+num_components+'" max="100" min="1">%\
          </td>\
        </tr>\
        <tr>\
          <td>Due Date:</td>\
          <td>\
            <input type="date" name="due_date_'+num_components+'" id="due_date_'+num_components+'">\
          </td>\
        </tr>\
        <tr>\
          <td>Grade: (if available)</td>\
          <td>\
            <input type="number" name="grade_'+num_components+'" placeholder="90" id="grade_'+num_components+'" max="100" min="1">%\
          </td>\
        </tr>\
      </table><br></div>');
 
     $("html, body").animate({ scrollTop: $(document).height() }, 500);
 
  });

    $("#minus").on("click", function(){
 
     $("#table_"+num_components+"").remove();
     --num_components;
     $("html, body").animate({ scrollTop: $(document).height() }, 1);
  });

    $("#add").on("click", function(){
        $(".error").remove();

        var sum = 0;
        for(i = 1; i<= num_components; ++i){
          sum += Number($("#weight_"+i).val());
        }

        if (sum != 100){
          $("#components_div").append("<p class='error'>Weights do not add up to 100!</p>");
        }
        else{
          var infos = {number_of_components: num_components};
  
          for(i = 1; i<= num_components; ++i){
            infos[i] = {   course_code: $("#course_code").val(),
                           component_name: $("#component_name_"+i).val(),
                           weight: $("#weight_"+i).val(), 
                           due_date: $("#due_date_"+i).val(),
                           grade: $("#grade_"+i).val() };
                
          }
  
          //console.log(infos);
  
          //$.post("/addComponent", {'infos' : infos }); 
          $("#components_div").append('<input type="hidden" name="num_components" value='+num_components+'>');
          $("#form").submit();
          /*
          $.ajax({
              url: "/addComponent",
              type: 'POST',
              data: {'infos' : infos },
              contentType: 'application/json',
              //dataType: 'json'
          });
          */
        }

  });

    //Analysis functions
    var grades_func_1 = function(target,grades){
        var traget_grade_orig = target;
        var traget_grade = traget_grade_orig;
        var grades_arr = grades
        //console.log("FIRST: ");
        //console.log([target,grades]);
        var available = false; 
        var num_available = 0;
        //calculates how many of the components have grades already, and for each one of them calculates the portion
        for(i =0 ; i< grades_arr.length; ++i){
            if(grades_arr[i].grade != null){
                available = true;
                ++num_available;
                grades_arr[i].portion = grades_arr[i].weight * grades_arr[i].grade; 
            }
        }
    
        var portions_sum = 0;
        //first condition: if components have some of them who already have grades 
        if(available == true){
            //adding up all portions together
            for(i =0 ; i< grades_arr.length; ++i){
                if(grades_arr[i].portion != null){
                    portions_sum += grades_arr[i].portion;
                }
            }
            //subtracting the sum of the target grade
            traget_grade -= portions_sum;
            // dividing the new target grade on the rest of the components (who dont have grades)
            traget_grade /= (grades_arr.length - num_available);
            //calculating the hypothetical grade 
            for(i =0 ; i< grades_arr.length; ++i){
                if(grades_arr[i].portion == null){
                    grades_arr[i].hypothetical_grade = Math.ceil((traget_grade/grades_arr[i].weight) * 100) / 100;
                    if(grades_arr[i].hypothetical_grade > 1){
                        grades_arr[i].hypothetical_grade = 1;
                    }
                    if(grades_arr[i].hypothetical_grade < 0){
                        grades_arr[i].hypothetical_grade = 0;
                    }
                }
            }
        
        }
        //second condition: if components DO NOT have grades
        else{
            // dividing the target grade on the all of the components 
            traget_grade /= grades_arr.length;
            //calculating the hypothetical grade
            for(i =0 ; i< grades_arr.length; ++i){
                grades_arr[i].hypothetical_grade = Math.ceil((traget_grade/grades_arr[i].weight) * 100) / 100;;
                if(grades_arr[i].hypothetical_grade > 1){
                    grades_arr[i].hypothetical_grade = 1;
                }
                if(grades_arr[i].hypothetical_grade < 0){
                        grades_arr[i].hypothetical_grade = 0;
                }
            }
        }
    
        var final_grade = final_grade_func(grades_arr);
        ////console.log(grades_arr);
        ////console.log(final_grade[1]);
    
    
        //if final grade is less than target fix hypothetical grades
        while(final_grade[1] < traget_grade_orig){
            grades_arr = fixing_func(grades_arr,traget_grade_orig);
            final_grade = final_grade_func(grades_arr);
            ////console.log(final_grade);
            if(final_grade[0] == true){ break;}
        }
    
        ////console.log(grades_arr);
        ////console.log(final_grade_func(grades_arr)[1]);
        return [grades_arr, final_grade_func(grades_arr)[1]];
    }

    var grades_func_2 = function(target,grades){
        var traget_grade_orig = target;
        var traget_grade = traget_grade_orig;
        var grades_arr = grades;
        //console.log("SECOND: ");
        //console.log([target,grades]);
        var available = false; 
        var num_available = 0;
        //calculates how many of the components have grades already, and for each one of them calculates the portion
        for(i =0 ; i< grades_arr.length; ++i){
            if(grades_arr[i].grade != null){
                available = true;
                ++num_available;
                grades_arr[i].portion = grades_arr[i].weight * grades_arr[i].grade; 
            }
        }
    
        var portions_sum = 0;
        //first condition: if components have some of them who already have grades 
        if(available == true){
            //adding up all portions together
            for(i =0 ; i< grades_arr.length; ++i){
                if(grades_arr[i].portion != null){
                    portions_sum += grades_arr[i].portion;
                }
            }
            //subtracting the sum of the target grade
            traget_grade -= portions_sum;
            // dividing the new target grade on the rest of the components (who dont have grades)
            //traget_grade /= (grades_arr.length - num_available);
            for(i =0 ; i< grades_arr.length; ++i){
                if(grades_arr[i].grade == null){
                    grades_arr[i].hypothetical_target = traget_grade * grades_arr[i].weight * 0.01;
                }
            }
        
            //calculating the hypothetical grade 
            for(i =0 ; i< grades_arr.length; ++i){
                if(grades_arr[i].portion == null){
                    grades_arr[i].hypothetical_grade = Math.ceil((grades_arr[i].hypothetical_target/grades_arr[i].weight) * 100) / 100;
                    if(grades_arr[i].hypothetical_grade > 1){
                        grades_arr[i].hypothetical_grade = 1;
                    }
                    if(grades_arr[i].hypothetical_grade < 0){
                        grades_arr[i].hypothetical_grade = 0;
                    }
                }
            }
        
        }
        //second condition: if components DO NOT have grades
        else{
            // dividing the target grade on the all of the components 
            //traget_grade /= grades_arr.length;
            for(i =0 ; i< grades_arr.length; ++i){
                if(grades_arr[i].grade == null){
                    grades_arr[i].hypothetical_target = traget_grade * grades_arr[i].weight * 0.01;
                }
            }
            //calculating the hypothetical grade
            for(i =0 ; i< grades_arr.length; ++i){
                grades_arr[i].hypothetical_grade = Math.ceil((grades_arr[i].hypothetical_target/grades_arr[i].weight) * 100) / 100;;
                if(grades_arr[i].hypothetical_grade > 1){
                    grades_arr[i].hypothetical_grade = 1;
                }
                if(grades_arr[i].hypothetical_grade < 0){
                        grades_arr[i].hypothetical_grade = 0;
                }
            }
        }
    
        var final_grade = final_grade_func(grades_arr);
        ////console.log(grades_arr);
        ////console.log(final_grade[1]);
    
    
        //if final grade is less than target fix hypothetical grades
        while(final_grade[1] < traget_grade_orig){
            grades_arr = fixing_func(grades_arr,traget_grade_orig);
            final_grade = final_grade_func(grades_arr);
            if(final_grade[0] == true){ break;}
        }
    
        ////console.log(grades_arr);
        ////console.log(final_grade_func(grades_arr)[1]);
        return [grades_arr, final_grade_func(grades_arr)[1]];
    
    }

    //adds up all portions and returns the final grade
    var final_grade_func = function(grades_arr){

        var final_grade = 0;
        var all_available = true;
        var all_ones = true;
        for(i =0 ; i< grades_arr.length; ++i){
            if(grades_arr[i].grade != null){
                final_grade += grades_arr[i].portion;
            }
            else{
                all_available = false;
                final_grade += grades_arr[i].weight * grades_arr[i].hypothetical_grade;
                if(grades_arr[i].hypothetical_grade <=0.99 ){
                    all_ones = false;
                }
            }
        }
    
        if( all_ones == true || all_available == true){
            return [true,final_grade];
        }
        return [false,final_grade];
    }

    //adds to each hypothetical grade 0.01
    var fixing_func = function(grades_arr,traget_grade_orig){
        var final_grade;
        var copyArr = grades_arr.slice();
        for(i =0 ; i< grades_arr.length; ++i){
            if(grades_arr[i].grade == null){
                if(grades_arr[i].hypothetical_grade == 1){
                    continue;
                }
                else{
                    grades_arr[i].hypothetical_grade += 0.01;
                    grades_arr[i].hypothetical_grade = Math.round(grades_arr[i].hypothetical_grade * 100) /100;
                    ////console.log("After round: "+grades_arr[i].hypothetical_grade);
                    if(grades_arr[i].hypothetical_grade > 1){
                        grades_arr[i].hypothetical_grade = 1;
                    }
                    if(grades_arr[i].hypothetical_grade < 0){
                        grades_arr[i].hypothetical_grade = 0;
                    }
                    copyArr = grades_arr.slice();
                    final_grade = final_grade_func(copyArr);
                    if(final_grade[1] > traget_grade_orig){
                        return grades_arr;
                    }
                    
                }
            }
        
        }
    
        return grades_arr;
    }

    $("#run").on("click",function(){
        /*
        var traget_grade_orig = 90;
        var traget_grade = traget_grade_orig;
        var grades_arr = [  {name: "Assignment" , weight: 20, grade: 0.8, portion: null, hypothetical_grade: null, hypothetical_target: null},
                            {name: "Midterm" , weight: 30, grade: null, portion: null, hypothetical_grade: null, hypothetical_target: null},
                            {name: "Exam" , weight: 30, grade: null, portion: null, hypothetical_grade: null, hypothetical_target: null},
                            {name: "Essay" , weight: 20, grade: null, portion: null, hypothetical_grade: null, hypothetical_target: null}
                        ];
        */
        $("#results").remove();
        
        var arr = [];
        $(".name").each(function(index){
            ////console.log($( this ).text());
            arr.push({ name: $( this ).text(), portion: null, hypothetical_grade: null, hypothetical_target: null});
        });
        $(".weight").each(function(index){
            var text = $( this ).text();
            arr[index].weight = Number(text.substring(text.length-3,text.length-1));
            if( text.substring(text.length-3,text.length-1) == "00"){
                arr[index].weight = 100;
            }
            //console.log("ABOOOODDDDD   :"+text.substring(text.length-3,text.length-1));
        });
        $(".grade").each(function(index){
            var text = $( this ).text();
            if(text.search("grade") < 0 ){
                arr[index].grade = Number(text.substring(text.length-3,text.length-1))*0.01;
                
            }
            else{
                arr[index].grade = null;
            }
        });
        var target = $("#target").val();

        var results1 = grades_func_1(target,arr);
        
        //console.log(results1);
        
        $("body").append("<div id='results'></div>");
        $("#results").append("<h3>First Combination:</h3>");
        $("#results").append("<table class='calendar' id='first_comb'></table>");
        $("#first_comb").append("<tr><th>Component</th><th>Weight</th><th>Grade</th></tr>");
        var all_hundred = true;
        for(i= 0; i < results1[0].length; ++i){
            //console.log("2");
            if(results1[0][i].grade == null){
                //$("#results").append("<p>&nbsp;"+results1[0][i].name+": (weight: "+results1[0][i].weight+"%)</p><p>&nbsp;&nbsp;&nbsp;Hypothetical Grade: "+results1[0][i].hypothetical_grade*100+"%</p>");
                $("#first_comb").append("<tr><td>"+results1[0][i].name+"</td> <td>"+results1[0][i].weight+"%</td><td>"+(results1[0][i].hypothetical_grade*100).toFixed(1)+"% (Hypothetical)</td></tr>");
                if(results1[0][i].hypothetical_grade*100 != 100){
                    all_hundred = false;
                }
            }
            else{
                //$("#results").append("<p>&nbsp;"+results1[0][i].name+": (weight: "+results1[0][i].weight+"%)</p><p>&nbsp;&nbsp;&nbsp;Actual Grade: "+results1[0][i].grade*100+"%</p>");
                $("#first_comb").append("<tr><td>"+results1[0][i].name+"</td><td>"+results1[0][i].weight+"%</td><td>"+(results1[0][i].grade*100).toFixed(1)+"% (Actual)</td></tr>");

            }
        }
        
        //$("#results").append("<h4>&nbsp;Hypothetical final grade: "+ results1[1].toFixed(1)+"%</h4>");
        if(all_hundred){
            $("#first_comb").append("<tr><th>Final Grade</th><th>100%</th><th>"+results1[1].toFixed(1)+"% (Maximum)</th></tr>");
        }else{
            $("#first_comb").append("<tr><th>Final Grade</th><th>100%</th><th>"+results1[1].toFixed(1)+"%</th></tr>");
        }
        
        var results2 = grades_func_2(target,arr);
        $("#results").append("<br><h3>Second Combination:</h3>"); 
        $("#results").append("<table class='calendar' id='second_comb'></table>");
        $("#second_comb").append("<tr><th>Component</th><th>Weight</th><th>Grade</th></tr>");
        for(i= 0; i < results2[0].length; ++i){
            if(results2[0][i].grade == null){
                //$("#results").append("<p>&nbsp;"+results2[0][i].name+": (weight: "+results2[0][i].weight+"%)</p><p>&nbsp;&nbsp;&nbsp;Hypothetical Grade: "+results2[0][i].hypothetical_grade*100+"%</p>");
                $("#second_comb").append("<tr><td>"+results2[0][i].name+"</td> <td>"+results2[0][i].weight+"%</td><td>"+(results2[0][i].hypothetical_grade*100).toFixed(1)+"% (Hypothetical)</td></tr>");

            }
            else{
                //$("#results").append("<p>&nbsp;"+results2[0][i].name+": (weight: "+results2[0][i].weight+"%)</p><p>&nbsp;&nbsp;&nbsp;Actual Grade: "+results2[0][i].grade*100+"%</p>");
                $("#second_comb").append("<tr><td>"+results2[0][i].name+"</td><td>"+results2[0][i].weight+"%</td><td>"+(results2[0][i].grade*100).toFixed(1)+"% (Actual)</td></tr>");

            }
        }
        //$("#results").append("<h4>&nbsp;Hypothetical final grade: "+ results2[1].toFixed(1)+"%</h4><br>");
        $("#second_comb").append("<tr><th>Final Grade</th><th>100%</th><th>"+results2[1].toFixed(1)+"%</th></tr>");
    });
    
    //edit each component
    $(".edit").each(function(index){
        $( this ).on("click", function(){
            $( this ).text("");
            //console.log($(this).parent().find(".grade").text());
            ////console.log($(this).parent().find(".grade").text().replace(/^\D+|\D+$/g, ""));
            
            var original_grade = $(this).parent().find(".grade").text();
            var old_grade  =  Number(original_grade.substring(original_grade.length-3,original_grade.length-1));
            $(this).parent().find(".grade").empty();
            $(this).parent().find(".grade").append('New Grade: <input type="number" name="grade" class="small_input" id="grade" max="100" min="1" value="'+old_grade+'"> %  &nbsp;&nbsp;OR &nbsp;&nbsp;Remove Grade: <input type="checkbox"  id="remove_grade"> ');
            
            
            var old_name = $(this).parent().find(".name").text();
            $(this).parent().find(".name").empty();
            $(this).parent().find(".name").append('New Name: <input type="text" name="component_name" class="small_input" placeholder="Assignment, Exam, Essay,... " id="component_name" value="'+old_name+'">');

            $(this).parent().find(".time").empty();
            $(this).parent().find(".time").append('New Date: <input type="date" class="small_input" name="due_date_1" id="due_date">');

            $(this).parent().find(".update_span").remove();
            $(this).parent().append('<span class="update_span"><button type="button" class="update small_input"> Update</button><br><br><span>');
            
            update();
        });
    });
    
    var update = function(){
        $(".update_span").each(function(index){
            $( this ).on("click", function(){
                var parent = $(this).parent();
                
                parent.find(".edit").text(" [edit]");
                
                var new_grade =  Number(parent.find("#grade").val());
                if( parent.find("#remove_grade").prop('checked') ){
                    //console.log("YES");
                    new_grade = null;
                    parent.find(".grade").empty();
                    parent.find(".grade").text("No grade given")
                }else{
                    //console.log("NO");
                    parent.find(".grade").empty();
                    parent.find(".grade").text("Grade: "+new_grade+"%")
                }
                
                var new_name =  parent.find("#component_name").val();
                parent.find(".name").empty();
                parent.find(".name").text(new_name)
                
                var new_date =  parent.find("#due_date").val();
                if(new_date !=""){
                    parent.find(".time").empty();
                    parent.find(".time").text("Due Date: "+new_date)
                }
                else{
                    new_date = null;
                    parent.find(".time").empty();
                    parent.find(".time").text("No date given")
                }
                var component_id = parent.find("#component_id").val();
                parent.find(".update_span").remove();
                //console.log("POST --> grade:"+ new_grade+", component name: "+ parent.find(".name").text()+", course name: "+parent.find("#course_name").val());
                //console.log(component_id);
                
                var new_stuff = {name : new_name, grade : new_grade , date: new_date, id: component_id };
                current();
                $.post("/updateComponent", new_stuff);
                
            });
        
        });
    
    }
    
    //display current grade
    var current = function(){
        $("#current_grade").empty();
        var arr_all=[] ;
        $(".component").each(function(index){
            if($(this).find(".grade").text().replace(/^\D+|\D+$/g, "") == ""){
                arr_all.push([Number($(this).find(".weight").text().replace(/^\D+|\D+$/g, "")),null]);
            }else{
                arr_all.push([Number($(this).find(".weight").text().replace(/^\D+|\D+$/g, "")),Number($(this).find(".grade").text().replace(/^\D+|\D+$/g, ""))*0.01]);
            }
        });
    
        var current_grade = 0;
        var sum_weights = 0;
        for(i=0; i<arr_all.length; ++i){
            if(arr_all[i][1] != null){
                current_grade += arr_all[i][0]*arr_all[i][1];
                sum_weights += arr_all[i][0];
            }
        }
        $("#current_grade").text("Current Grade: "+ current_grade.toFixed(1)+" / "+sum_weights);
        //console.log((current_grade).toFixed(1)+" / "+sum_weights);
    }
    
    //Adding events
    var num_events = 1;

    $("#plus_events").on("click", function(){
         ++num_events;
         $("#events_div").append('\
         <div id="table_'+num_events+'">\
                <table >\
                  <tr>\
                    <td>Event '+num_events+':</td>\
                    <td> \
                      <input type="text" name="event_'+num_events+'" placeholder="First day of classes, break, exam period..." id="event_'+num_events+'">\
                    </td>\
                  </tr>\
                  <tr>\
                    <td>Event Date:</td>\
                    <td> \
                      <input type="radio" name="date_type_'+num_events+'" class="period">Period (e.g. April 10 - April 25) <br>\
                    </td>\
                  </tr>\
                  <tr>\
                    <td> </td>\
                    <td>\
                      <input type="radio" name="date_type_'+num_events+'" class="one_date">One Day (e.g. April 10)\
                    </td>\
                  </tr>\
                </table><br>\
              </div>');
         $(".one_date").each(function(index){
            $(this).unbind("change");
         });
         $(".period").each(function(index){
            $(this).unbind("change");
         });
         date_types_func();
         $("html, body").animate({ scrollTop: $(document).height() }, 500);
    });

    $("#minus_events").on("click", function(){
        $("#table_"+num_events+"").remove();
        --num_events;
        $("html, body").animate({ scrollTop: $(document).height() }, 1);
    });

    var date_types_func = function(){
        $(".one_date").each(function(index){
            var parent = $(this).parent().parent().parent();
            $(this).change(function(){
                if($(this).prop('checked')){
                    //console.log("ADDED one_date");
                    parent.find(".period_actual").remove();
                    index = Number(index)+Number(1);
                    parent.append('<tr class="one"><td></td><td><input type="date", name="actual_date_'+index+'" , id="actual_date_'+index+'"></td></tr>');
                    parent.find(".period_actual").remove();
                }
                else{
                    parent.find(".one").remove();
                }
            });
        });

        $(".period").each(function(index){
            var parent = $(this).parent().parent().parent();
            $(this).change(function(){
                if($(this).prop('checked')){
                    //console.log("ADDED period");
                    parent.find(".one").remove();
                    index = Number(index)+Number(1);
                    parent.append('<tr class="period_actual"><td></td><td>Start date: <input type="date", name="actual_period_start_'+index+'" , id="actual_period_start_'+index+'"></td></tr>');
                    parent.append('<tr class="period_actual"><td></td><td>End date: <input type="date", name="actual_period_end_'+index+'" , id="actual_end_start_'+index+'"></td></tr>');
                    parent.find(".one").remove();
                }
                else{
                    parent.find(".one").remove();
                }
            });
        });
   }
    
    $("#add_events").on("click", function(){
        $("#form").append('<input type="hidden" name="num_events" value='+num_events+'>');
        $("#form").submit();
    });
    
    //edit events
    
    
    $("#edit_events").on("click", function(){
        $( this ).text("");
        
        $(this).parent().parent().find("ul").append("<button class='green update_all_events'>Update All</button>");
        $(this).parent().parent().find("ul").append("<button class='red delete_all_events'>Delete All</button>");
        
        $(".event").each(function(index){
            $(this).find(".data").each(function(index){
                //console.log($(this).text());
            });
            
            var old_name = $(this).find(".event_span").find(".data").text();
            $(this).find(".event_span").empty();
            $(this).find(".event_span").append('New Event Name: <input type="text" class="small_input new_event_name"  value="'+old_name+'">');
            
            if($(this).find(".date_span").length > 0){
                var old_date = $(this).find(".date_span").find(".data").text();
                $(this).find(".date_span").empty();
                $(this).find(".date_span").append('New Event Date: <input type="date" class="small_input new_event_date"  value="'+old_date+'">');
            }else{
                var old_start = $(this).find(".start_span").find(".data").text();
                $(this).find(".start_span").empty();
                $(this).find(".start_span").append('New Start Date: <input type="date" class="small_input new_event_start"  value="'+old_start+'">');
                
                var old_end = $(this).find(".end_span").find(".data").text();
                $(this).find(".end_span").empty();
                $(this).find(".end_span").append('New End Date: <input type="date" class="small_input new_event_end"  value="'+old_end+'">');
            
            }
            $(this).append("<br><button class='red delete_event'>Delete</button>");
        });
        
        
        $(".delete_event").on("click", function(){
            $(this).parent().find(".event_id").val()
            $.post("/deleteEvent",{id:$(this).parent().find(".event_id").val() },function(data){
                console.log(data);
            });
            $(this).parent().parent().remove();
        });
        
        
        $(".delete_all_events").on("click", function(){
            var parent = $(this).parent().parent();
            $(this).parent().parent().empty();
            parent.append("<b> All events are now deleted </b><br><br>")
            
            $.post("/deleteAllEvents",function(data){
                console.log(data);
            });
        });
        
        $(".update_all_events").on("click", function(){
            var arr = [];
            $(".event").each(function(index){
                var new_name = $(this).find(".event_span").find(".new_event_name").val();
                $(this).find(".event_span").empty();
                $(this).find(".event_span").append('<b>Event:</b> <span class="data">'+new_name+'</span>');
            
                if($(this).find(".date_span").length > 0){
                    var new_date = $(this).find(".date_span").find(".new_event_date").val();
                    $(this).find(".date_span").empty();
                    $(this).find(".date_span").append('<b>Date:</b> <span class="data">'+new_date+'</span> ');
                }else{
                    var new_start = $(this).find(".start_span").find(".new_event_start").val();
                    $(this).find(".start_span").empty();
                    $(this).find(".start_span").append('<b>Start Date:</b> <span class="data">'+new_start+'</span>');
                
                    var new_end = $(this).find(".end_span").find(".new_event_end").val();
                    $(this).find(".end_span").empty();
                    $(this).find(".end_span").append('<b>End Date:</b> <span class="data">'+new_end+'</span>');
            
                }
                $(this).find(".delete_event ~ br").remove();
                $(this).find(".delete_event").remove();
                
                arr.push({"name" : new_name, "date" : new_date, "start" : new_start, "end" : new_end, "id" : $(this).find(".event_id").val() });
            });
            
            $( this ).parent().parent().find("#edit_events").append("[edit]");
            $(this).parent().find(".delete_all_events").remove();
            $(this).remove();
            
            
            console.log(arr);
            $.post("/updateTermDates",{data: JSON.stringify(arr)},function(data){
                console.log(data);
            });

        });
        
    });
    

    /*Code*/

    


    
    
    
    current();
    date_types_func();
});
