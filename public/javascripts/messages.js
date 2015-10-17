
$(function(){
    $("#convo").scrollTop($('#convo').prop('scrollHeight'));
    
    $("#pdf").on("click",function() {
        /*var pdf = new jsPDF('p','pt','a4');
        console.log(document.body);
        pdf.addHTML(document.body,function() {
            console.log("DEBUG");
            setTimeout(function(){
                pdf.save('web.pdf');
            },1000);
            //pdf.save('web.pdf');
        });
        */
        window.alert("To save it as PDF: \n - Click change destination \n - Choose save as PDF \n - Click the blue 'save' button \n NB: long conversations will take longer time to save");
        window.print();
    });
    
});
