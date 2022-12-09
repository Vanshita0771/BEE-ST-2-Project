const express=require('express');
const bodyparser=require('body-parser');
const mysql=require('mysql');
const app=express();
app.set('view engine','ejs')
var con=mysql.createConnection({host:"localhost",user:"root",password:"",database:"fashionparadise"});
con.connect(function(err){
  if(err)
   throw err;

})

app.use(bodyparser.urlencoded({extended:true}));

app.get('/',function(req,res){
    res.sendFile(__dirname+"/login.html");
})
app.get('/register',function(req,res){
    res.sendFile(__dirname+"/register.html");
})

app.post('/main',(req,res)=>{
  const data_={
    username:req.body.username,
    password:req.body.password,
    person:(req.body.person).toUpperCase()
  }
 
   if(data_.person=='ADMIN'){ 
     const sql=`select * from admin where username="${data_.username}" and password="${data_.password}"`;
     con.query(sql,(err,result)=>{
      if(err)
       throw err;
      if(result.length==0)
        res.render('resultLogin',{res:"Invalid Admin"});
      else{
         con.query('select * from users',function(err,result){
          if(err)
          throw err; 
         
          res.render('usersdetails',{result:result});
          console.log(result);
         }) 
       
      }
      
   })
   }
   if(data_.person=='USER'){ 
    const sql=`select * from users where username="${data_.username}" and password="${data_.password}"`;
    con.query(sql,(err,result)=>{
     if(err)
      throw err;
     if(result.length==0)
       res.render('resultLogin',{res:"Invalid Username Or Password"});
     else{
         res.render('data',{result:data_});
         app.get('/profile',function(req,res){
           res.render('profile',{result:result});
         })
     }
  })
}
})

app.post("/",(req,res)=>{
    var data={
        username:req.body.username,
        password:req.body.password,
        name:req.body.name,
        country:req.body.country,
        phoneno:Number.parseInt(req.body.phoneno)
    }
    const sql=`select * from users where username="${data.username}"`;
   
    con.query(sql,(err,result)=>{
       if(err)
        throw err;
       if(result.length==0)
       {
         con.query(`insert into users set ?`,data,(err)=>{
         if(err) 
           throw err;
         })
         res.sendFile(__dirname+"/login.html");
       }
       else{
          res.sendFile(__dirname+"/accountExist.html");
       }
       
    })
   
})

app.get('/change',function(req,res){
  res.sendFile(__dirname+'/changePassword.html');
})

app.post('/mainpage',function(req,res){
   const data={
    username:req.body.username,
    oldpassword:req.body.oldpassword,
    newpassword:req.body.newpassword,
   }
  // res.send(data);
   const sql=`update users set password="${data.newpassword}" where username="${data.username}"`;
   con.query(sql,(err,result)=>{
    if(err)
     throw err;
   })
   res.redirect('/');
  
    
})
app.listen(3090);