var express = require('express');
var router = express.Router();
var fs = require("fs");
var sqlite3 = require('sqlite3');
var fs_x = require('fs-extra');
sqlite3.verbose();

var db2 = null;

var last_file = null;
fs_x.removeSync('./tmp');

fs.readdir("/Users/"+process.env.LOGNAME+"/Library/Application Support/MobileSync/Backup", function(err, files){
    if(err){
        console.log(err)
    }else{
        var index = files.indexOf('.DS_Store');
        if (index > -1) {
            files.splice(index, 1);
        }
        
        last_file = files[0];
        
        var last = new Date(fs.statSync("/Users/"+process.env.LOGNAME+"/Library/Application Support/MobileSync/Backup/"+files[0]).ctime);
        var max_time = last.getTime();
        
        for(i=1 ; i< files.length;++i){
            var new_last = new Date(fs.statSync("/Users/"+process.env.LOGNAME+"/Library/Application Support/MobileSync/Backup/"+files[i]).ctime);
            if(max_time < new_last.getTime()){
                max_time = new_last.getTime();
                last_file = files[i];
            }
        }
        /*
        fs_x.copy("/Users/"+process.env.SUDO_USER+"/Library/Application Support/MobileSync/Backup/"+last_file+"/3d0d7e5fb2ce288813306e4d4636395e047a3d28", './tmp/messages.db', function (err) {
          if (err) {
            console.log("error copying file - TELL ABOOD");
            console.log(err);
          }else{
            console.log("COPY SUCCESS!");
            db2 = new sqlite3.Database('tmp/messages.db');
            
          }
          
        });
        */
        //console.log("/Users/"+process.env.LOGNAME+"/Library/Application Support/MobileSync/Backup/"+last_file+"/3d0d7e5fb2ce288813306e4d4636395e047a3d28");
        db2 = new sqlite3.Database("/Users/"+process.env.LOGNAME+"/Library/Application Support/MobileSync/Backup/"+last_file+"/3d0d7e5fb2ce288813306e4d4636395e047a3d28");
        /*
        fs_x.copy("/Users/"+process.env.USER+"/Desktop/Abood.zip", './tmp/messages.db', function (err) {
          if (err) {console.log("error copying file - TELL ABOOD")}
          console.log("COPY SUCCESS!");
          
        });
        */
        
    }

});

// /
router.get('/', function(req, res) {

    var renderMessages = function(err, messages) {
        if (err) {
            console.log(err);
            messages = [];
        }
    

        res.render("viewMessages.jade", {title: "Inbox", messages: messages});
    
    }

    db2.serialize(function() {
        db2.all("select *, max(max_1) as max_2 from \
                    (select * from\
                        (select text,handle_id, max(date) as max_1, datetime(date + strftime('%s', '2001-01-01 00:00:00'),'unixepoch', 'localtime') as time from message group by handle_id order by date desc) as messages\
                    inner join\
                        (select ROWID, id as number, service from handle) as handles\
                    on messages.handle_id = handles.ROWID)\
                group by number\
                order by max_2 DESC\
                ;"
                ,renderMessages);
        });
        
});


//messages/:user
router.get('/messages/:id', function(req, res) {
    var convo_id = req.params.id;
    
    var firstStep = function(err, handles) {
        if (err) {
            messages = [];
            console.log(err);
            console.log("DEBUG1");
        }
        
        db2.serialize(function() {
            db2.all("select ROWID from handle where id = ? \
                    ",handles[0].number, secondStep);
        });
    }
    
    var secondStep = function(err, numbers) {
        if (err) {
            messages = [];
            console.log(err);
            console.log("DEBUG2");
        }
        
        //console.log("numbers: "+numbers);
        if (numbers.length == 1){
            db2.serialize(function() {
                db2.all("select * \
                         from\
                            (SELECT datetime(date + strftime('%s', '2001-01-01 00:00:00'),'unixepoch', 'localtime') as time ,date_delivered,date,date_read, message.is_from_me, message.handle_id as ROWID_2, message.text FROM message WHERE message.handle_id = ? order by ROWID)\
                         natural join\
                            (select ROWID as ROWID_2, id as number, service  from handle)\
                        ",numbers[0].ROWID,renderMessages);
            });
        }else{
            db2.serialize(function() {
                db2.all("select * \
                         from\
                            (SELECT datetime(date + strftime('%s', '2001-01-01 00:00:00'),'unixepoch', 'localtime') as time ,date_delivered,date,date_read, message.is_from_me, message.handle_id as ROWID_2, message.text FROM message WHERE message.handle_id = ? OR message.handle_id = ? order by ROWID )\
                         natural join\
                            (select ROWID as ROWID_2, id as number, service  from handle)\
                        ",numbers[0].ROWID, numbers[1].ROWID,renderMessages);
            });
        }
    }

    var renderMessages = function(err, messages) {
        if (err) {
            messages = [];
            console.log(err);
            console.log("DEBUG3");
        }
        //console.log(messages);
        res.render("specificMessage.jade", {title: "Messages", messages : messages }); 
        
    }
    
    db2.serialize(function() {
            db2.all("select ROWID, id as number from handle where ROWID =? \
                    ",convo_id, firstStep);
            console.log("select ROWID, id as number from handle where ROWID ="+convo_id);
    });
    
    

});




module.exports = router;
