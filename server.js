
const bodyParser = require('body-parser')
const express = require('express')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Pranay:REDcherry@cluster0.csuem.gcp.mongodb.net/test?authSource=admin&replicaSet=atlas-142jk5-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true";
const fetch = require("node-fetch");
const PORT = process.env.PORT || 3000;
const app = express();
const delay = require('delay');
var nodemailer = require('nodemailer');

 var pass,email;
 global.email1;
 global.status1;
 global.count=0;
 global.count1=0;

 global.checkuser;

 global.res1;

const router = express.Router();
// app.use(cors());
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(cors({
origin: ['http://localhost:4200','http://localhost:4200'],
credentials: true
}));

app.use(cookieParser());
app.use(session({
  secret: 'ssshhhhh',  
  saveUninitialized: true,
  resave: true,
}));
app.use(bodyParser.json());



const validatePayloadMiddleware = (req, res, next) => {
  if(req.body) {
    console.log("right");
    next();
  }else {
    console.log("wrong");
  }
}
 

let sess;
 global.checkuser;
 global.checkpass;
 app.get('/',function(req,res)
 {
    sess = req.session;
    if(sess.email) {
        console.log("userin");
        
    }
  // res.sendFile('index.html');
    res.send("Hello server");
 })
var status;
app.get('/getchattopic',function(req,res)
 {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("chattopic");
    dbo.collection("topics").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log("dsdd",result.length);
      var city=[]
      for(var i=0;i<result.length;i++)
      {
        console.log(result[i]["topic"]);
        city.push(result[i]["topic"])

      }
      console.log("hello",city)
      db.close();

      res.json({
        message:city
      })
    });
  });
 })


 app.get('/getwebinardata',function(req,res)
 {
   global.city =[]

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("webinar");
    dbo.collection("webinardetails").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      global.city.push(result)

      db.close(); 
      res.json({
        message:city
      })
    });
  });
  
 })


 app.post('/webinar',function(req,res)
{
 MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   var dbo = db.db("webinar");
   var myobj = { topic: req.body.topic, description:req.body.description, startdate: req.body.startdate, enddate: req.body.enddate, platform: req.body.platform, urlconnect:req.body.urlconnect, moredetails: req.body.moredetails, purl: req.body.prurl };
   dbo.collection("webinardetails").insertOne(myobj, function(err, res) {
     if (err) throw err;
     console.log("1 document inserted");
     global.count5 =1
     db.close();
   });
   console.log(global.count5)
 if( global.count5 == 1)
 {
  res.json({
    email: "sucesss"
  })
 }
 });
 

})

 app.post('/chattopic',function(req,res)
 {
    console.log("ddd",req.body.email)
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("chattopic");
      var myobj = { email:req.body.email ,topic: '{ "title":"'+req.body.topic+'", "subtitle":"'+req.body.description+'", "email":"'+req.body.email+'"}' };
      dbo.collection("topics").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
      res.json({
        message:"success"
      })
    });
 })

app.post('/login',validatePayloadMiddleware,function(req,res)
{
    console.log("se1", session);
    console.log("id",req.sessionID);
    console.log("reqhead",req.headers);
    console.log("sessemail",req.session);
    console.log(req.cookies);
    console.log(req.body);
    console.log(req.body.email);
    console.log("reqhead1",req.headers);
    

   
    MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("TestR");
    
    dbo.collection("user").findOne({email:req.body.email}, function(err, res) {
      if (err) throw err;
      console.log("res.email",res);
      // console.log("res.status",res.status);
      if(res == null)
      {
        global.checkuser=false;
        global.checkpass=false;
        console.log('globalcheck',global.checkuser);
            }
            else
            {
              
              if(res.password == req.body.password){
                global.checkpass=true;
                global.checkuser=true;
                pass = res.password;
                email = res.email;
                status = res.status;
              }
              else {
                pass = res.password;
                email = res.email;
                status = res.status;
                global.checkuser=true;
                global.checkpass=false;
              }
              
              console.log('globalcheck',global.checkuser);
              console.log('globalpass',global.checkpass);
            }

            


          db.close();


      });
      
});


  setTimeout(() => {
    console.log("check global",global.checkuser)

    if(global.checkuser==false ){
    res.json({
      message:false,
      pass1: "nopass",
      email1: "noemail"

    })
  }
  else if(global.checkpass== false && global.checkuser==true){
    res.json({
      message:false,
      pass1: "wrongpass",
      email1: email
    })
  }
  else{
      req.session.email = req.body.email;
      req.session.save();
      res.json({
        message:true,
        pass1: pass,
        email1: email,
        status: status
      })
  }

  },1000 )
  
  
});

app.get('/dashboard',(req,res) => {
  // sess = req.session;
  
  console.log(req.session);
  console.log("reqhead",req.headers);
  console.log("id",req.sessionID);
  console.log(req.cookies);

  console.log("xzxzxxzxz",req.session.email,req.session,req.headers,req.sessionID,req.cookies)
  if(req.session.email) {

      // console.log("sess",sess.cookie.email);
   console.log(req.session);
  console.log("reqhead",req.headers);
  console.log("id",req.sessionID);
  console.log(req.cookies);

  console.log("xzxzxxzxz",req.session.email)
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TestR");
  
        dbo.collection("user").findOne({email:req.session.email}, function(err, res) {
          if (err) throw err;
          // console.log("res.email",res);
          console.log("res.status",res.status);
          status = res.status
        })
      });
      setTimeout(() => {
        res.json({"email1": req.session.email, "user" : true,"status": status });
      },500);
      
  }
  else {
    res.json({"email1": "no email", "user" : false,"status": "no user" });
  }
});

app.get('/logout',(req,res) => {
  console.log("logout");
  req.session.destroy((err) => {
    console.log("logout");
      if(err) {
          return console.log(err);
          
      }
      // res.redirect('/');
  });

});

app.get('/output',function(req,res){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TestR");
    dbo.collection("OnlineCompiler").findOne({email:"a@gmail.com"}, function(err, res) {
      if (err) throw err;
      console.log(res);
      global.res1 = res.output
      console.log(global.res1)
      global.count1=1;

      db.close();
    });

  });
  (async () => {

    await delay(3000);
  
    // Executed 100 milliseconds later
    console.log("check global",global.res1)
    res.json({
      message:global.res1
    })
  
  })();
  
})
 app.post('/setcode',function(req,res){
var email = req.body.email;
console.log(req.body.email)

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  // Insert document in TestR
  var dbo = db.db("TestR");
  var myobj = { code:req.body.email,email:"a@gmail.com"};

    dbo.collection("output").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
  
});
res.status(200).send({"message":"Data recieved"})
 });


 app.post('/forgotpassword',function(req,res){
  var transporter = nodemailer.createTransport({
                 service: 'gmail',
                 auth: {
                     user: 'maheshkunder24@gmail.com',
                     pass: 'REDcherry'
                   },
                   tls: {
                     rejectUnauthorized: false
                 }
               });
               
               var mailOptions = {
                 from: 'maheshkunder24@gmail.com',
                 to: req.body.email,
                 subject: 'Verification mail',
                html:`<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd"><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body style="margin: 0; padding: 10px;"> <table border="0" cellspacing="0" cellpadding="0" width="100%"> <tr> <td align="center"> <table border="0" bgcolor="#EEF1F5" cellspacing="0" cellpadding="0" width="604"> <tr> <td align="center" style="border-top: 4px solid #5558AF; padding: 20px 0 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 24px; color: #5558af;"> Smart Educare </td></tr><tr> <td align="center" style="padding: 20px;"> <h3 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 600; margin: 0;">Welcome to smarteducare</h3> </td></tr><tr> <td align="center" style="padding: 0 162px"> <table border="0" bgcolor="#FFFFFF" cellspacing="0" cellpadding="0" width="280"> <tr> <td width="10">&nbsp;</td><td align="center" style="padding: 20px 0;" width="260"> </td><td width="10">&nbsp;</td></tr><tr> <td width="10">&nbsp;</td><td align="center" style="max-width: 260px; overflow: hidden;" width="260"> <h3 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 600; margin: 0;">Really Good Interface</h3> </td><td width="10">&nbsp;</td></tr><tr> <td width="10">&nbsp;</td><td align="center" style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 20px; padding: 10px 0; max-width: 260px; max-height: 20px; overflow: hidden;" width="260">650+ quiz </td><td width="10">&nbsp;</td></tr><tr> <td width="10">&nbsp;</td><td align="center" style="border-top: 1px solid #E2E7EC; color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 20px; padding: 10px 0px; max-width: 260px; max-height: 60px; overflow: hidden;" width="260">New Challenges added every moment </td><td width="10">&nbsp;</td></tr></table> </td></tr></table> <table bgcolor="#EEF1F5" border="0" cellpadding="0" cellspacing="0" width="604"> <tr> <td align="center" style="padding: 5px 162px 40px"> <table border="0" cellspacing="0" cellpadding="0" width="280"> <tr> <td align="center" bgcolor="#5558AF" style="border: 2px solid #5558AF;" width="280"><!--[if mso]> <v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" target="_blank" style="v-text-anchor:middle; width:272px; height:36px" strokecolor="#5558AF" fillcolor="#5558AF"> <w:anchorlock/> <center style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #FFF; text-decoration: none">Open Microsoft Teams</center> </v:rect><![endif]--> </td></tr></table> </td></tr></table> <table bgcolor="#EEF1F5" border="0" cellpadding="0" cellspacing="0" width="604"> <tr> <td align="center" valign="top" bgcolor="#E2E7EC" style="border-right: 4px solid #EEF1F5; border-bottom: 4px solid #EEF1F5; padding: 10px 30px 40px; font-size: 12px; line-height: 20px;" height="380" width="300"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" valign="middle" width="220" height="220"> <img src="https://statics.teams.skype.com/icons/img_teams_channels.png" alt="Bring your team together" width="220"> </td></tr></table> <h4 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 20px; margin: 0;">Bring your team together</h4> <p style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">Create an open, collaborative workspace for your team. Use channels to organize conversations by topic, area, or anything else.</p></td><td align="center" valign="top" bgcolor="#E2E7EC" style="border-bottom: 4px solid #EEF1F5; padding: 10px 28px 40px; font-size: 12px; line-height: 20px;" height="380" width="300"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" valign="middle" width="220" height="220"> <img src="https://statics.teams.skype.com/icons/img_chat.png" alt="Chat 1:1 with groups" width="220"> </td></tr></table> <h4 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 20px; margin: 0;">Chat 1:1 and with groups</h4> <p style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">Outside of open team conversations, chat privately and share files and notes with anyone in your organization.</p></td></tr><tr> <td align="center" valign="top" bgcolor="#E2E7EC" style="border-right: 4px solid #EEF1F5; padding: 10px 32px 40px; font-size: 12px; line-height: 20px;" height="380" width="300"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" valign="middle" width="220" height="220"> <img src="https://statics.teams.skype.com/icons/img_videocalling.png" alt="Make video calls and schedule online meetings" width="220"> </td></tr></table> <h4 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 20px; margin: 0;">New age of coding</h4> <p style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">Challenges that make you different</p></td><td align="center" valign="top" bgcolor="#E2E7EC" style="padding: 10px 32px 40px; font-size: 12px; line-height: 20px;" height="380" width="300"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" valign="middle" width="220" height="220"> <img src="https://statics.teams.skype.com/icons/img_tabs.png" alt="Team files, notes, and apps in one place" width="220"> </td></tr></table> <h4 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 20px; margin: 0;">Team files, notes, and apps in one place</h4> <p style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">Your team's tools are organized and integrated i</p></td></tr></table> <table bgcolor="#EEF1F5" cellspacing="0" cellpadding="0" border="0" width="604"> <tr> <td align="center" style="padding: 30px 162px;"> <table border="0" cellspacing="0" cellpadding="0" width="280"> <tr> <td align="center" bgcolor="#5558AF" style="border: 2px solid #5558AF;" width="280"><!--[if mso]> <v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" target="_blank" style="v-text-anchor:middle; width:272px; height:36px;" strokecolor="#5558AF" fillcolor="#5558AF"> <w:anchorlock/> <center style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #FFF; text-decoration: none">Open Microsoft Teams</center> </v:rect><![endif]--> <a href="`+'http://localhost:4200/fpassword?email='+req.body.email+''+`" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #FFF; padding: 10px 0px; display: block; text-decoration: none;" onclick="myFunction()">Change Password</a> <script>function myFunction(){window.open()}</script> </td></tr></table> </td></tr></table> <table bgcolor="#EEF1F5" cellspacing="0" cellpadding="0" border="0" width="604"> <tr> <td height="2" width="30">&nbsp;</td><td height="2" style="border-top: 2px solid #E2E7EC">&nbsp;</td><td height="2" width="30">&nbsp;</td></tr></table> <table bgcolor="#EEF1F5" cellspacing="0" cellpadding="0" border="0" width="604"> <tr> <td colspan="6" align="center" style="padding: 0 0 30px"> <h3 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: normal; margin: 0">Get it now! Take it with you wherever you go.</h3> </td></tr><tr> <td width="150">&nbsp;</td><td align="right" width="56" style="padding: 3px 0"> <img src="https://statics.teams.microsoft.com/evergreen-assets/icons/icn_windows.png" alt="Microsoft Teams - Windows" height="16" width="16"> </td><td width="96" style="border-right: 2px solid #E2E7EC; color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px;">&nbsp;&nbsp;Windows </td><td align="right" width="36" style="padding: 3px 0"> <img src="https://statics.teams.skype.com/icons/icn_apple.png" alt="Microsoft Teams - iOS" height="16" width="16"> </td><td width="116" style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px;">&nbsp;&nbsp;iOS </td><td width="150">&nbsp;</td></tr><tr> <td width="150">&nbsp;</td><td align="right" width="56" style="padding: 3px 0"> <img src="https://statics.teams.skype.com/icons/icn_apple.png" alt="Microsoft Teams - Windows" height="16" width="16"> </td><td width="96" style="border-right: 2px solid #E2E7EC; color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px;">&nbsp;&nbsp;Mac </td><td align="right" width="36" style="padding: 3px 0"> <img src="https://statics.teams.skype.com/icons/icn_android.png" alt="Microsoft Teams - Android" height="16" width="16"> </td><td width="116" style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px;">&nbsp;&nbsp;Android </td><td width="150">&nbsp;</td></tr><tr> <td width="150">&nbsp;</td><td width="56">&nbsp;</td><td width="96" style="border-right: 2px solid #E2E7EC;">&nbsp;</td><td align="right" width="36" style="padding: 3px 0"> <img src="https://statics.teams.microsoft.com/evergreen-assets/icons/icn_windows.png" alt="Microsoft Teams - Windows Phone" height="16" width="16"> </td><td width="116" valign="middle" style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px;">&nbsp;&nbsp;Windows Phone </td><td width="150">&nbsp;</td></tr></table> <table bgcolor="#EEF1F5" cellspacing="0" cellpadding="0" border="0" width="604"> <tr> <td height="2" width="30">&nbsp;</td><td height="2" style="border-top: 2px solid #E2E7EC;">&nbsp;</td><td height="2" width="30">&nbsp;</td></tr></table> </td></tr>`

               };
               
               transporter.sendMail(mailOptions, function(error, info){
                 if (error) {
                   console.log(error);
                 } else {
                   console.log('Email sent: ' + info.response);
 
                   res.json({
                     email: "sent"
                   })
                 }
               });
         
   
  })
 
 
  app.post('/updatepassword',function(req,res){
 
   MongoClient.connect(url, function(err, db) {
     if (err) throw err;
     var dbo = db.db("TestR");
     console.log(req.body.password);
     console.log(req.body.email);
 
     dbo.collection("user").updateOne({email: req.body.email},{$set: {password: req.body.password}}, function(err, res) {
       if (err) throw err;
       console.log("1 document updated");
       result = true;
       db.close();
 
       
     });
   });
   
   var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                      user: 'maheshkunder24@gmail.com',
                      pass: 'REDcherry'
                    },
                    tls: {
                      rejectUnauthorized: false
                  }
                });
                
                var mailOptions = {
                  from: 'maheshkunder24@gmail.com',
                  to: req.body.email,
                  subject: 'Password Has Been Changed',
                  text: 'Your password has been changed '
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
  
                    res.json({
                      email: "sent"
                    })
                  }
                });
          
    
   })
  
 
  app.post('/checkuserverification',function(req,res)
  {
   MongoClient.connect(url, function(err, db) {
     if (err) throw err;
     var dbo = db.db("TestR");
     
     dbo.collection("user").findOne({email:req.body.email},{status:true}, function(err, res) {
       if (err) throw err;
       console.log("res.email",res);
       if(res === null)
       {
 global.checkuser=false
       }
       else
       {
         global.checkuser=true
 
       }
 
       
 
 
      db.close();
 
 
  });
 
  (async () => {
 
   await delay(1000);
 
   // Executed 100 milliseconds later
   console.log("check global",global.checkuser)
 
   if(global.checkuser === true)
   {
 res.json({
   message:true
 })
   }
 
   if(global.checkuser === false)
   {
     res.json({
       message:false
     })
   }
 
 })();
 
 
       
     });
 
 
  })
 
  app.post('/checkuser',function(req,res)
  {
   MongoClient.connect(url, function(err, db) {
     if (err) throw err;
     var dbo = db.db("TestR");
     
     dbo.collection("user").findOne({email:req.body.email}, function(err, res) {
       if (err) throw err;
       console.log("res.email",res);
       if(res === null)
       {
 global.checkuser=false
       }
       else
       {
         global.checkuser=true
 
       }
 
       
 
 
      db.close();
 
 
  });
 
  (async () => {
 
   await delay(1000);
 
   // Executed 100 milliseconds later
   console.log("check global",global.checkuser)
 
   if(global.checkuser === true)
   {
 res.json({
   message:true
 })
   }
 
   if(global.checkuser === false)
   {
     res.json({
       message:false
     })
   }
 
 })();
 
 
       
     });
 
 
  })
  app.post('/enroll',function(req,res)
 {
   var email;
     console.log(req.body);
     console.log(req.body.name);
     console.log(req.body.lname);
     console.log(req.body.email);
     console.log(req.body.password);
 
     MongoClient.connect(url, function(err, db) {
         if (err) throw err;
         // Insert document in TestR
         var dbo = db.db("TestR");
         var myobj = { fname: req.body.name, lname:req.body.lname,email:req.body.email,password:req.body.password, status: false};
       
           dbo.collection("user").insertOne(myobj, function(err, res) {
               if (err) throw err;
               console.log("1 document inserted");
               db.close();
             });
 
             // NOde Mailer
 
             var transporter = nodemailer.createTransport({
                 service: 'gmail',
                 auth: {
                     user: 'maheshkunder24@gmail.com',
                     pass: 'REDcherry'
                   },
                   tls: {
                     rejectUnauthorized: false
                 }
               });
               
               var mailOptions = {
                 from: 'maheshkunder24@gmail.com',
                 to: req.body.email,
                 subject: 'Verification mail',
                 html:`<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd"><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body style="margin: 0; padding: 10px;"> <table border="0" cellspacing="0" cellpadding="0" width="100%"> <tr> <td align="center"> <table border="0" bgcolor="#EEF1F5" cellspacing="0" cellpadding="0" width="604"> <tr> <td align="center" style="border-top: 4px solid #5558AF; padding: 20px 0 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 24px; color: #5558af;"> Smart Educare </td></tr><tr> <td align="center" style="padding: 20px;"> <h3 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 600; margin: 0;">Welcome to smarteducare</h3> </td></tr><tr> <td align="center" style="padding: 0 162px"> <table border="0" bgcolor="#FFFFFF" cellspacing="0" cellpadding="0" width="280"> <tr> <td width="10">&nbsp;</td><td align="center" style="padding: 20px 0;" width="260"> </td><td width="10">&nbsp;</td></tr><tr> <td width="10">&nbsp;</td><td align="center" style="max-width: 260px; overflow: hidden;" width="260"> <h3 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 600; margin: 0;">Really Good Interface</h3> </td><td width="10">&nbsp;</td></tr><tr> <td width="10">&nbsp;</td><td align="center" style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 20px; padding: 10px 0; max-width: 260px; max-height: 20px; overflow: hidden;" width="260">650+ quiz </td><td width="10">&nbsp;</td></tr><tr> <td width="10">&nbsp;</td><td align="center" style="border-top: 1px solid #E2E7EC; color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 20px; padding: 10px 0px; max-width: 260px; max-height: 60px; overflow: hidden;" width="260">New Challenges added every moment </td><td width="10">&nbsp;</td></tr></table> </td></tr></table> <table bgcolor="#EEF1F5" border="0" cellpadding="0" cellspacing="0" width="604"> <tr> <td align="center" style="padding: 5px 162px 40px"> <table border="0" cellspacing="0" cellpadding="0" width="280"> <tr> <td align="center" bgcolor="#5558AF" style="border: 2px solid #5558AF;" width="280"><!--[if mso]> <v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" target="_blank" style="v-text-anchor:middle; width:272px; height:36px" strokecolor="#5558AF" fillcolor="#5558AF"> <w:anchorlock/> <center style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #FFF; text-decoration: none">Open Microsoft Teams</center> </v:rect><![endif]--> </td></tr></table> </td></tr></table> <table bgcolor="#EEF1F5" border="0" cellpadding="0" cellspacing="0" width="604"> <tr> <td align="center" valign="top" bgcolor="#E2E7EC" style="border-right: 4px solid #EEF1F5; border-bottom: 4px solid #EEF1F5; padding: 10px 30px 40px; font-size: 12px; line-height: 20px;" height="380" width="300"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" valign="middle" width="220" height="220"> <img src="https://statics.teams.skype.com/icons/img_teams_channels.png" alt="Bring your team together" width="220"> </td></tr></table> <h4 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 20px; margin: 0;">Bring your team together</h4> <p style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">Create an open, collaborative workspace for your team. Use channels to organize conversations by topic, area, or anything else.</p></td><td align="center" valign="top" bgcolor="#E2E7EC" style="border-bottom: 4px solid #EEF1F5; padding: 10px 28px 40px; font-size: 12px; line-height: 20px;" height="380" width="300"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" valign="middle" width="220" height="220"> <img src="https://statics.teams.skype.com/icons/img_chat.png" alt="Chat 1:1 with groups" width="220"> </td></tr></table> <h4 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 20px; margin: 0;">Chat 1:1 and with groups</h4> <p style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">Outside of open team conversations, chat privately and share files and notes with anyone in your organization.</p></td></tr><tr> <td align="center" valign="top" bgcolor="#E2E7EC" style="border-right: 4px solid #EEF1F5; padding: 10px 32px 40px; font-size: 12px; line-height: 20px;" height="380" width="300"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" valign="middle" width="220" height="220"> <img src="https://statics.teams.skype.com/icons/img_videocalling.png" alt="Make video calls and schedule online meetings" width="220"> </td></tr></table> <h4 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 20px; margin: 0;">New age of coding</h4> <p style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">Challenges that make you different</p></td><td align="center" valign="top" bgcolor="#E2E7EC" style="padding: 10px 32px 40px; font-size: 12px; line-height: 20px;" height="380" width="300"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" valign="middle" width="220" height="220"> <img src="https://statics.teams.skype.com/icons/img_tabs.png" alt="Team files, notes, and apps in one place" width="220"> </td></tr></table> <h4 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 20px; margin: 0;">Team files, notes, and apps in one place</h4> <p style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">Your team's tools are organized and integrated i</p></td></tr></table> <table bgcolor="#EEF1F5" cellspacing="0" cellpadding="0" border="0" width="604"> <tr> <td align="center" style="padding: 30px 162px;"> <table border="0" cellspacing="0" cellpadding="0" width="280"> <tr> <td align="center" bgcolor="#5558AF" style="border: 2px solid #5558AF;" width="280"><!--[if mso]> <v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" target="_blank" style="v-text-anchor:middle; width:272px; height:36px;" strokecolor="#5558AF" fillcolor="#5558AF"> <w:anchorlock/> <center style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #FFF; text-decoration: none">Open Microsoft Teams</center> </v:rect><![endif]--> <a href="`+'http://localhost:4200/verified?email='+req.body.email+''+`" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #FFF; padding: 10px 0px; display: block; text-decoration: none;" onclick="myFunction()">Verify</a> <script>function myFunction(){window.open()}</script> </td></tr></table> </td></tr></table> <table bgcolor="#EEF1F5" cellspacing="0" cellpadding="0" border="0" width="604"> <tr> <td height="2" width="30">&nbsp;</td><td height="2" style="border-top: 2px solid #E2E7EC">&nbsp;</td><td height="2" width="30">&nbsp;</td></tr></table> <table bgcolor="#EEF1F5" cellspacing="0" cellpadding="0" border="0" width="604"> <tr> <td colspan="6" align="center" style="padding: 0 0 30px"> <h3 style="color: #16233A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: normal; margin: 0">Get it now! Take it with you wherever you go.</h3> </td></tr><tr> <td width="150">&nbsp;</td><td align="right" width="56" style="padding: 3px 0"> <img src="https://statics.teams.microsoft.com/evergreen-assets/icons/icn_windows.png" alt="Microsoft Teams - Windows" height="16" width="16"> </td><td width="96" style="border-right: 2px solid #E2E7EC; color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px;">&nbsp;&nbsp;Windows </td><td align="right" width="36" style="padding: 3px 0"> <img src="https://statics.teams.skype.com/icons/icn_apple.png" alt="Microsoft Teams - iOS" height="16" width="16"> </td><td width="116" style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px;">&nbsp;&nbsp;iOS </td><td width="150">&nbsp;</td></tr><tr> <td width="150">&nbsp;</td><td align="right" width="56" style="padding: 3px 0"> <img src="https://statics.teams.skype.com/icons/icn_apple.png" alt="Microsoft Teams - Windows" height="16" width="16"> </td><td width="96" style="border-right: 2px solid #E2E7EC; color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px;">&nbsp;&nbsp;Mac </td><td align="right" width="36" style="padding: 3px 0"> <img src="https://statics.teams.skype.com/icons/icn_android.png" alt="Microsoft Teams - Android" height="16" width="16"> </td><td width="116" style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px;">&nbsp;&nbsp;Android </td><td width="150">&nbsp;</td></tr><tr> <td width="150">&nbsp;</td><td width="56">&nbsp;</td><td width="96" style="border-right: 2px solid #E2E7EC;">&nbsp;</td><td align="right" width="36" style="padding: 3px 0"> <img src="https://statics.teams.microsoft.com/evergreen-assets/icons/icn_windows.png" alt="Microsoft Teams - Windows Phone" height="16" width="16"> </td><td width="116" valign="middle" style="color: #535C6D; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px;">&nbsp;&nbsp;Windows Phone </td><td width="150">&nbsp;</td></tr></table> <table bgcolor="#EEF1F5" cellspacing="0" cellpadding="0" border="0" width="604"> <tr> <td height="2" width="30">&nbsp;</td><td height="2" style="border-top: 2px solid #E2E7EC;">&nbsp;</td><td height="2" width="30">&nbsp;</td></tr></table> </td></tr>`
 
               };
               
               transporter.sendMail(mailOptions, function(error, info){
                 if (error) {
                   console.log(error);
                 } else {
                   console.log('Email sent: ' + info.response);
                 }
               });
         
         
       });
     res.status(200).send({"message":"Data recieved"})
 })
 
 
 app.post('/update',function(req,res)
 {
 global.email1=req.body.email;
   MongoClient.connect(url, function(err, db) {
     if (err) throw err;
     var dbo = db.db("TestR");
     
     dbo.collection("user").updateOne({email: req.body.email},{$set: {status: true}}, function(err, res) {
       if (err) throw err;
       console.log("1 document updated");
       result = true;
       db.close();
 
       
     });
   });
   
 
   res.status(200).send({"message":"Data updated"})
 
 });
 
 app.get('/result', (req, res) => {
 console.log("global email",global.email1);
     MongoClient.connect(url, function(err, db) {
       if (err) throw err;
       var dbo = db.db("TestR");
       
       dbo.collection("user").findOne({email:global.email1}, function(err, res) {
         if (err) throw err;
         console.log(res["status"]);
        global.status1 = res["status"];
        db.close();
 
        global.count=1;
 
 
    });
 
   
         
       });
 
       if(count==1)
       {
         console.log("hello",global.status1);
 
         res.json({
           status:global.status1
         })
       }
 
  
 
     });     
 
     app.post('/getQuiz',(req,res) => {
      var qs;
      console.log("get quiz");
      MongoClient.connect(url, function(err, db) {
       if (err) throw err;
       // Insert document in TestR
       var dbo = db.db("quizdata");
       // var myobj = { code:req.body.email,email:"a@gmail.com"};
     
         dbo.collection("cprogram").findOne({"subject":"cprogramming"}, function(err, res) {
             if (err) throw err;
             console.log("res ques",res.quiz)
            //  console.log("res",res.options[0][0])
             qs=res.pubmanual;
             console.log("1 document read");
             db.close();
           });
           setTimeout(() => {
             res.json({
               message:false,
               q: qs
             })
           },5000);
       
     });
   
    })
    app.post("/putquiz", (req,res) => {
      console.log(req.body);
      var i = req.body.no - 1;
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        // Insert document in TestR
        var dbo = db.db("quizdata");

          dbo.collection("cprogram").updateOne({ "subject" : "cprogramming"},{$push: {   //sorting
            quiz: {
              $each: [req.body],
              $position: i}
          }},function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
      res.status(200).send({"message":"Data inserted"})
    
     });
    });
    app.post("/putexp", (req,res) => {
      console.log(req.body);
      var i = req.body.no - 1;
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        // Insert document in TestR
        var dbo = db.db("labmanual");
        // var myobj = { exp:req.body,email:"a@gmail.com"};
        // var mine = {"manual1":{"program": {"exp":{"no":77}}}};
        // var mine1 = {exp:{"no":1}};
        // var test = {test:req.body}
        // var update1 = {"manual1": {"program":{"exp":{programs: req.body}}}};
        // updateObj.$push["name."+i] = req.body;{ "subject" : "cprogramming" }
        // {$push : {"test.$[element]":req.body}},
        //   {arrayFilters: [ { element: 2 } ]}
        
          dbo.collection("cprogram").updateOne({ "subject" : req.body.programming},{$push: {   //sorting
            manual: {
              $each: [req.body],
              $position: i}
          }},function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
      res.status(200).send({"message":"Data inserted"})
    
     });
    });
    app.post("/putprog", (req,res) => {
      var i = req.body.eno;
      var j = req.body.pno -1;
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("labmanual");
        dbo.collection("cprogram").update(
          { "subject" : req.body.programming,"manual.no": i},
          { $push: { "manual.$.prog": {
            $each : [req.body],
            $position : j
          } } },function(err, res) {
            if (err) throw err;
            db.close();
          });
      });
      setTimeout(() => {
        console.log("iamman1");
        res.json({
          message:true,
        })
      },1000);
    });
    app.post("/updateexp", (req,res) => {  //update of exp name only expno can be used as primary key
      var i = req.body.eno;
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("labmanual");
        dbo.collection("cprogram").updateOne(
          { "subject" : req.body.programming,"manual.no": i},
          { $set: { "manual.$.name" : req.body.updname } },
          function(err, res) {
            if (err) throw err;
            db.close();
          });
      });
      setTimeout(() => {
        console.log("iamman1");
        res.json({
          message:true,
        })
      },1000);
    });
    app.post("/updatequiz", (req,res) => {  //update of exp name only expno can be used as primary key
      // var i = req.body.no;
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("quizdata");
        dbo.collection("cprogram").updateOne(
          { "subject" : "cprogramming"},
          {$set: {quiz : req.body} },
          function(err, res) {
            if (err) throw err;
            db.close();
          });
      });
      setTimeout(() => {
        console.log("iamman1");
        res.json({
          message:true,
        })
      },1000);
    });
    app.post("/updateprog", (req,res) => {  //update of exp name only expno can be used as primary key
      var eno = req.body.eno;
      var pno = req.body.pno;
      console.log("eno",eno,"pno",pno);
      console.log(req.body);
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("labmanual");
        dbo.collection("cprogram").updateOne(
          { "subject" : req.body.programming},
          { $set: { "manual.$[i].prog.$[j].title" : req.body.title,
          "manual.$[i].prog.$[j].desc" : req.body.desc,
          "manual.$[i].prog.$[j].ip_format" : req.body.ip_format,
          "manual.$[i].prog.$[j].cons" : req.body.cons,
          "manual.$[i].prog.$[j].op_format" : req.body.op_format,
          "manual.$[i].prog.$[j].tc_ip" : req.body.tc_ip,
          "manual.$[i].prog.$[j].tc_op" : req.body.tc_op,
          "manual.$[i].prog.$[j].expl" : req.body.expl,
          "manual.$[i].prog.$[j].tcip" : req.body.tcip,
          "manual.$[i].prog.$[j].tcop" : req.body.tcop}},
          { arrayFilters: [{"i.no" : eno },{ "j.pno" : pno}] },
          function(err, res) {
            if (err) throw err;
            db.close();
          });
          
        })
        setTimeout(() => {
          console.log("iamman");
          res.json({
            message:true,
          })
        },1000);
    });
    app.post("/getmanual", (req,res) => {
      var man=[];
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        // Insert document in TestR
        var dbo = db.db("labmanual");
        dbo.collection("cprogram").findOne({"subject":req.body.key},function(err, res) {
          if (err) throw err;
          console.log(res);
          man = res.manual;
          console.log(man);
          db.close();
        });
    
      });
      setTimeout(() => {
        console.log("iamman",man);
        res.json({
          message:true,
          manual: man
        })
      },5000);
    });
    app.get("/getquizbook", (req,res) => {
      var man=[];
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        // Insert document in TestR
        var dbo = db.db("quizdata");
        dbo.collection("cprogram").findOne({"subject":"cprogramming"},function(err, res) {
          if (err) throw err;
          console.log(res);
          man = res.quiz;
          console.log(man);
          db.close();
        });
    
      });
      setTimeout(() => {
        console.log("iamman",man);
        res.json({
          message:true,
          manual: man
        })
      },5500);
    });
    app.post("/getpubman", (req,res) => {
      var man=[];
      console.log(req.body.key);
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        // Insert document in TestR
        var dbo = db.db("labmanual");
        dbo.collection("cprogram").findOne({"subject":req.body.key},function(err, res) {
          if (err) throw err;
          console.log(res);
          man = res.pubmanual;
          console.log(man);
          db.close();
        });
    
      });
      setTimeout(() => {
        console.log("iamman",man);
        res.json({
          message:true,
          manual: man
        })
      },5000);
    });
    app.post("/delete_exp",(req,res)=>{
      var k = req.body.key;
      console.log(k);
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        
        var dbo = db.db("labmanual");
        dbo.collection("cprogram").update({ "subject" : req.body.programming},{$pull:{   //sorting
         manual:{key:k}
         }},function(err, res) {
          if (err) throw err;
          console.log("1 document delete");
          db.close();
      });
    });
      
    setTimeout(() => {
      console.log("iamman1");
      res.json({
        message:true,
      })
    },1000);
    
    });
    app.post("/delete_prog",(req,res)=>{
      var i = req.body.eno;
      var k = req.body.pkey;
      console.log(k);
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        
        var dbo = db.db("labmanual");
        dbo.collection("cprogram").update({ "subject" : req.body.programming, "manual.no": i},{ $pull:{   //sorting
         "manual.$.prog":{pkey:k}
         }},function(err, res) {
          if (err) throw err;
          console.log("1 document delete");
          db.close();
      });
    });
    setTimeout(() => {
      console.log("iamman1");
      res.json({
        message:true,
      })
    },1000);
    
    });
    app.post("/delete_tc",(req,res)=>{
      var i = req.body.eno;
      var j = req.body.pno;
      var ind = req.body.ind -1;
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        
        var dbo = db.db("labmanual");
        dbo.collection("cprogram").updateOne({ "subject" : "cprogramming"},
        { $pop: { "manual.$[i].prog.$[j].tcip": ind,
        "manual.$[i].prog.$[j].tcop": ind}},
        { arrayFilters: [{"i.no" : i },{ "j.pno" : j}] },function(err, res) {
          if (err) throw err;
          console.log("1 document delete");
          db.close();
      });
    });
    setTimeout(() => {  
      console.log("iamman1");
      res.json({
        message:true,
      })
    },1000);
    
    });
    // app.post("/progtc",(req,res)=>{
    //   var i = req.body.eno;

    //   MongoClient.connect(url, function(err, db) {
    //     if (err) throw err;
        
    //     var dbo = db.db("labmanual");
    //     dbo.collection("cprogram").findOne({ "subject" : "cprogramming"},function(err, res) {
    //       if (err) throw err;
    //       console.log("sss",res.pubmanual);
    //       console.log("1 document fetched");
    //       db.close();
    //   });
    // });
    // setTimeout(() => {
    //   console.log("iamman1");
    //   res.json({
    //     message:true,
    //   })
    // },1000);
    
    // });
    app.post("/publish_man",(req,res)=>{
     var key = req.body.pop();
     console.log(key)
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        
        var dbo = db.db("labmanual");
        dbo.collection("cprogram").updateOne({ "subject" : key},{ $set:{pubmanual : req.body}},function(err, res) {
          if (err) throw err;
          console.log("1 document delete");
          db.close();
      });
      });
    
      
      setTimeout(() => {
        console.log("iamman1");
        res.json({
          message:true,
        })
      },1000);
    
    });
    app.post("/publish_quizbook",(req,res)=>{
     
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        
        var dbo = db.db("quizdata");
        dbo.collection("cprogram").updateOne({ "subject" : "cprogramming"},{ $set:{pubmanual : req.body}},function(err, res) {
          if (err) throw err;
          console.log("1 document published");
          db.close();
      });
      });
    
      
      setTimeout(() => {
        console.log("iamman1");
        res.json({
          message:true,
        })
      },1000);
    
    });
    


 app.listen(PORT,function()
 {
     console.log("sunn raha hu me new version2")
 });
 
