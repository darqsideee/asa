require('dotenv').config();
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(session({secret:'secret',resave:false,saveUninitialized:true}));

const USERS_FILE = path.join(__dirname,'users.json');
const NAME_FILE = path.join(__dirname,'name-change.json');

if(!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE,'{}');
if(!fs.existsSync(NAME_FILE)) fs.writeFileSync(NAME_FILE,'{}');

function readUsers(){return JSON.parse(fs.readFileSync(USERS_FILE));}
function writeUsers(data){fs.writeFileSync(USERS_FILE,JSON.stringify(data,null,2));}
function readName(){return JSON.parse(fs.readFileSync(NAME_FILE));}
function writeName(data){fs.writeFileSync(NAME_FILE,JSON.stringify(data,null,2));}

// --- routes ---
app.post('/api/register',(req,res)=>{
    let {email,name,pass}=req.body;
    let users=readUsers();
    if(users[email]) return res.json({success:false,error:'Uživatel existuje'});
    users[email]={email,name,pass};
    writeUsers(users);
    req.session.user=email;
    res.json({success:true,user:{email,name}});
});
app.post('/api/login',(req,res)=>{
    let {email,pass}=req.body;
    let users=readUsers();
    if(!users[email] || users[email].pass!==pass) return res.json({success:false,error:'Chybné údaje'});
    req.session.user=email;
    res.json({success:true,user:{email,name:users[email].name}});
});
app.post('/api/logout',(req,res)=>{
    req.session.destroy(()=>res.json({success:true}));
});

app.post('/api/change-name',(req,res)=>{
    let userEmail = req.session.user;
    if(!userEmail) return res.json({success:false,error:'Nejste přihlášen'});
    let {newName}=req.body;
    let users = readUsers();
    let nameChange = readName();
    const now = Date.now();
    const SEVEN_DAYS = 7*24*60*60*1000;
    if(nameChange[userEmail] && (now - nameChange[userEmail]) < SEVEN_DAYS){
        let daysLeft = Math.ceil((SEVEN_DAYS - (now - nameChange[userEmail])) / (1000*60*60*24));
        return res.json({success:false,error:`Změna jména již proběhla, zbývá ${daysLeft} dní`});
    }
    users[userEmail].name = newName;
    nameChange[userEmail] = now;
    writeUsers(users);
    writeName(nameChange);
    res.json({success:true});
});

app.get('/api/name-info',(req,res)=>{
    let userEmail = req.session.user;
    if(!userEmail) return res.json({daysLeft:0});
    let nameChange = readName();
    const now = Date.now();
    const SEVEN_DAYS = 7*24*60*60*1000;
    let daysLeft = 0;
    if(nameChange[userEmail] && (now - nameChange[userEmail]) < SEVEN_DAYS){
        daysLeft = Math.ceil((SEVEN_DAYS - (now - nameChange[userEmail])) / (1000*60*60*24));
    }
    res.json({daysLeft});
});

app.use(express.static('.'));
app.listen(process.env.PORT||3000,()=>console.log('Server běží na portu',process.env.PORT||3000));
