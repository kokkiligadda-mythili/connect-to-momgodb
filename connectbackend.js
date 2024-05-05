
var express = require('express');
var app = express();
var port = 3000;
app.get('/', (req, res) => {
res.sendFile(__dirname + '/index.html');
});
app.listen(port, () => {
console.log(`Server listening on ${port} `);
});
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/dbcon');
var nameSchema = new mongoose.Schema({
 name:String,
 dep:String,
 rollno:String,
 sem:Number,
 year:String,
 
});
var User = mongoose.model('User', nameSchema);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/addname', (req, res) => {
var myData = new User(req.body);
myData.save()
.then(User => {
   res.send(
    `<html>
            <head>
                <style>
                body{
                    background-color: black;
                color: white;

                }
                div{margin-top:200px;}
            h2{height:30px;}
            a{color:green;}
                </style>
            </head>
            <body>
            <div align="center">
                <font  size="15px">Hello</font><font size="25px"color="green"> ${User.name}</font>
                <h2 align="center">To see database&nbsp;  <a href="http://localhost:3000/users">click here</a> !...</h2>
                <h2 align="center">To Update Document&nbsp;  <a href="http://localhost:3000/update">click here</a> !...</h2>
                <h2 align="center">To Delete Document&nbsp;  <a href="http://localhost:3000/delete">click here</a> !...</h2>
            </div>
            </body>
        </html>`
   );
})  
.catch(err => {
res.status(400).send('unable to save to database');
});
})
app.get('/users', (req, res) => {
    User.find({}).exec()
        .then(User => {
            res.send(`<html>
                        <head>
                            <title>dbdata</title>
                            <style>
                            body{
                            background-color: black;
                            color: white;
                            }
                                table, th, td {
                                    border: 1px solid white;
                                    border-collapse: collapse;
                                    padding: 8px;
                                    width:1000px;
                                    margin-left:240px;  
                                }
                                h1{color:green;margin-top:50px;margin-left:500px;}
                            </style>
                        </head>
                        <body>
                            <h1>Data Retreived Successfully !...</h1>
                            <table>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Roll No</th>
                                    <th>Semester</th>
                                    <th>Year</th>
                                    
                                </tr>
                                
                                ${User.map(User => `
                                <tr>
                                    <td>${User.name}</td>
                                    <td>${User.dep}</td>
                                    <td>${User.rollno}</td>
                                    <td>${User.sem}</td>
                                    <td>${User.year}</td>
                                </tr>
                            `).join('')}
                            </table>
                        </body>
                    </html>`);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
});
app.get('/update', (req, res) => {
    User.find({}).exec()
        .then(User => {
            res.send(`<html>
                        <head>
                            <title>dbdata</title>
                            <style>
                            body{
                            background-color: black;
                            color: white;
                            }
                               input
                               {
                                width:400px;
                                height:30px;
                                border:none;
                                margin-left:520px;
                               }
                               input:hover
                               {
                                outline:none;
                                height:40px;
                               }
                               button
                               {
                                background-color:green;
                                width:80px;
                                border:none;
                                height:30px;
                                margin-left:650px;
                               }
                               button:hover
                               {
                                outline:none;
                               }
                                h1{color:green;margin-top:50px;margin-left:500px;}
                            </style>
                        </head>
                        <body>
                            <h1>Update Document !...</h1>
                            <form action="/update" method="POST">
                            <input type="text" name="name1" placeholder="Enter Name *"><br><br>
                            <input type="text" name="name" placeholder="New Name"><br><br>
                            <input type="text" name="dep" placeholder="New dep"><br><br>
                            <input type="text" name="rollno" placeholder="New Rollnumber"><br><br>
                            <input type="number" name="sem" placeholder="New Sem"><br><br>
                            <input type="number" name="year" placeholder="New Year"><br><br>
                            <button type="submit">Update</button>
                        </form>
                        
                        </body>
                    </html>`);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
});
app.post('/update', (req, res) => {
    const newName = req.body.name;
    const oldName = req.body.name1;
    const newdep = req.body.dep;
    const newrollno = req.body.rollno;
    const newsem = req.body.sem;
    const newyear = req.body.year;
    const predata = {};

    if (newName) predata.name = newName;
    if (newdep) predata.dep = newdep;
    if (newrollno) predata.rollno = newrollno;
    if (newsem) predata.sem = newsem;
    if (newyear) predata.year = newyear;

    User.findOneAndUpdate({ name: oldName }, { ...predata }, { new: true })
        .then(User => {
            if (User) {
                res.send(` 
                <html>
                    <head>
                        <title>dbdata</title>
                        <style>
                            body {
                                background-color: black;
                                color: white;
                            }
                            table, th, td {
                                border: 1px solid white;
                                border-collapse: collapse;
                                padding: 8px;
                                width: 1000px;
                                margin-left: 240px;  
                            }
                            h1 {
                                color: green;
                                margin-top: 50px;
                                margin-left: 500px;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Successfully updated ${oldName} data to &#x1F447;</h1>
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Roll No</th>
                                <th>Semester</th>
                                <th>Year</th>
                            </tr>
                            <tr>
                                <td>${User.name}</td>
                                <td>${User.dep}</td>
                                <td>${User.rollno}</td>
                                <td>${User.sem}</td>
                                <td>${User.year}</td>
                            </tr>
                        </table>
                    </body>
                </html>
                `);
            } else {
                res.send(`No user found with the name ${oldName}`);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
});


app.get('/delete', (req, res) => {
    User.find({}).exec()
        .then(User => {
            res.send(`<html>
                        <head>
                            <title>dbdata</title>
                            <style>
                            body{
                            background-color: black;
                            color: white;
                            }
                               input
                               {
                                width:400px;
                                height:30px;
                                border:none;
                                margin-left:520px;
                               }
                               button
                               {
                                background-color:green;
                                width:80px;
                                border:none;
                                height:30px;
                                margin-left:650px;
                               }
                               button:hover
                               {
                                outline:none;
                               }
                               input:hover
                               {
                                outline:none;
                                height:40px;
                               }
                                h1{color:green;margin-top:50px;margin-left:500px;}
                            </style>
                        </head>
                        <body>
                            <h1>Delete document!...</h1>
                            <form action="/delete" method="POST">
                            <input type="text" name="name" placeholder="Enter Name"><br><br>
                            <button type="submit">Delete</button>
                        </form>
                        
                        </body>
                    </html>`);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
});
app.post('/delete', (req, res) => {
    const newName = req.body.name;
    User.findOneAndDelete({ name: newName })
        .then(deletedUser => {
            if (deletedUser) {
                res.send(`Successfully deleted user with name ${deletedUser.name} and id ${deletedUser._id}`);
            } else {
                res.send(`No user found with the name ${newName}`);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
});


