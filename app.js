const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodepro1",
});

con.connect();

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  const query =
    "select * from admin where email='" +
    email +
    "' and password='" +
    password +
    "'";

  con.query(query, (error, result, index) => {
    console.log(result);
    if (result.length > 0) {
      localStorage.setItem('admin', true)
      res.redirect("/dashboard");
    } else {
      res.redirect("/");
    }
  });
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/addstaff", (req, res) => {
  res.render("addstaff");
});

app.get("/viewstaff", (req, res) => {
  if (localStorage.getItem('admin')) {
    const query = "select * from staff";
    con.query(query, (error, result, index) => {
      if (error) throw error;
      res.render("viewstaff", { result });
    });
  }
  else{
    res.redirect('/')
  }
});

app.post("/addstaff", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  const query =
    "insert into staff(name,email,password)values('" +
    name +
    "','" +
    email +
    "','" +
    password +
    "')";

  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/viewstaff");
  });
});

app.get("/update/:id", (req, res) => {
  const id = req.params.id;
  const query = "select * from staff where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.render("updatestaff", { result });
    console.log(result);
  });
});

app.post("/update/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const query =
    "update staff set name='" +
    name +
    "',email='" +
    email +
    "' , password='" +
    password +
    "' where id=" +
    id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/viewstaff");
  });
});

app.get("/delete/:id", (req, res) => {
  var id = req.params.id;

  const query = "delete from staff where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/viewstaff");
  });
});

// Task

app.get("/addtask", (req, res) => {
  if (localStorage.getItem('admin')) {
    const query = "select * from staff";
    console.log(query);
    con.query(query, (error, result, index) => {
      console.log(result);
      if (error) throw error;
      res.render("addtask", { result });
    });
  }
  else{
    res.redirect('/')
  }
});

app.post("/addtask", (req, res) => {
  var taskname = req.body.taskname;
  var startdate = new Date().toISOString().slice(0, 10);
  var enddate = new Date(req.body.enddate).toISOString().slice(0, 10);
  var totalday = Math.ceil(
    (new Date(req.body.enddate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  var staffname = req.body.name;

  const query =
    "INSERT INTO task (taskname, startdate, enddate, totalday,staffname) VALUES ('" +
    taskname +
    "','" +
    startdate +
    "','" +
    enddate +
    "','" +
    totalday +
    "','" +
    staffname +
    "')";

  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/viewtask");
  });
});

app.get("/viewtask", (req, res) => {
  if (localStorage.getItem('admin'))
  {
    const query = "select * from task";
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.render("viewtask", { result });
  });
  }
  else{
    res.redirect('/')
  }
});

app.get("/updatetask/:id", (req, res) => {
  const id = req.params.id;
  const query = "select * from task where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.render("updatetask", { result });
    console.log(result);
  });
});

app.post("/updatetask/:id", (req, res) => {
  const id = req.params.id;
  const task = req.body.taskname;
  var startdate = new Date().toISOString().slice(0, 10);
  var enddate = new Date(req.body.enddate).toISOString().slice(0, 10);
  var totalday = Math.ceil(
    (new Date(req.body.enddate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const query =
    "update task set taskname='" +
    task +
    "' ,startdate='" +
    startdate +
    "', enddate='" +
    enddate +
    "', totalday='" +
    totalday +
    "' where id=" +
    id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/viewtask");
  });
});

app.get("/deleteTask/:id", (req, res) => {
  var id = req.params.id;
  var query = "delete from task where id=" + id;

  con.query(query, function (error, result, index) {
    if (error) throw error;
    res.redirect("/viewtask");
  });
});

// Manage Task

app.get("/managetask", (req, res) => {
  if (localStorage.getItem('admin'))
  {
    var sql = "select * from task where status='Decline'";
  con.query(sql, function (error, result, index) {
    if (error) throw error;
    res.render("managetask", { result });
  });
  }
  else{
    res.redirect('/')
  }
});

app.get("/manageedit/:id", (req, res) => {
  const id = req.params.id;
  // const query = "select * from task where id=" + id;
  const query1 = "select name from staff";
  con.query(query1, (error, result, index) => {
    if (error) throw error;
    res.render("manageedit", { result });
    // con.query(query1, (error, result1, index) => {
    //   if (error) throw error;
    //   res.render("manageedit", { result1 });
    //   console.log(result);
    // });
    console.log(result);
  });
});

app.post("/manageedit/:id", (req, res) => {
  console.log("1")
  const id = req.params.id;
  const name = req.body.name;
  // const task = req.body.taskname;
  // var startdate = new Date().toISOString().slice(0, 10);
  // var enddate = new Date(req.body.enddate).toISOString().slice(0, 10);
  // var totalday = Math.ceil(
  //   (new Date(req.body.enddate) - new Date()) / (1000 * 60 * 60 * 24)
  // );

  const query =
    "update task set staffname='" +
    name +
    "' , taskname='" 
    // +
    // task +
    // "' ,startdate='" +
    // startdate +
    // "', enddate='" +
    // enddate +
    // "', totalday='" +
    // totalday +
    "' where id=" +
    id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/managetask");
  });
});

app.get("/managedel/:id", (req, res) => {
  var id = req.params.id;
  var query = "delete from task where id=" + id;

  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/managetask");
  });
});

// Status

app.get("/status", function (req, res) {
  if (localStorage.getItem('admin'))
{
  var query = "select * from task where status='Accept'";
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.render("status", { result });
  });
}
else{
  res.redirect('/')
}
});

// User Side

app.get("/home", (req, res) => {
  const query = "select * from task";

  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.render("home", { result });
  });
});

app.get("/user", (req, res) => {
  res.render("user");
});

app.post("/user", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  const query =
    "SELECT * FROM staff WHERE email='" +
    email +
    "' AND password='" +
    password +
    "'";
  con.query(query, (error, result, index) => {
    if (error) throw error;
    if (result.length == 1) {
      localStorage.setItem("staff", JSON.stringify(result[0]));

      res.redirect("/assigntask");
    } else {
      res.redirect("/user");
    }
  });
});

// Assign Task

app.get("/assigntask", (req, res) => {
  let data = localStorage.getItem("staff");
  data = JSON.parse(data);
  const query = "SELECT * FROM task WHERE staffname='" + data.name + "'";
  con.query(query, (error, result, fields) => {
    if (error) throw error;
    res.render("assigntask", { result });
  });
});

// app.get('/userregister',(req,res) => {
//     res.render('userregister');
// })

// app.post('/userregister',(req,res) => {
//     var name = req.body.name;
//     var email = req.body.email;
//     var password = req.body.password;
//     const query = "insert into user(name,email,password)values('"+name+"','"+email+"','"+password+"')";
//     con.query(query,(error,result,index) => {
//         if(error) throw error;
//         res.redirect('user');
//     })
// })

// Accept

app.get("/accepttask/:id", (req, res) => {
  var id = req.params.id;
  const query = "update task set status='Accept' where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/assigntask");
  });
});

app.get("/acceptview", (req, res) => {
  let data = localStorage.getItem("staff");
  data = JSON.parse(data);
  const query =
    "select * from task where status='Accept' AND staffname= '" +
    data.name +
    "'";
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.render("acceptview", { name: data, result });
  });
});

// Decline

app.get("/declinetask/:id", (req, res) => {
  var id = req.params.id;
  const query = "update task set status='Decline' where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/assigntask");
  });
});

app.get("/declineview", (req, res) => {
  let data = localStorage.getItem("staff");
  data = JSON.parse(data);
  const query =
    "select * from task where status='Decline' AND staffname='" +
    data.name +
    "' ";
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.render("declineview", { result });
  });
});

// Padding

app.get("/padding", (req, res) => {
  let data = localStorage.getItem("staff");
  data = JSON.parse(data);
  const query =
    "select * from task where status='Accept' AND staffname='" +
    data.name +
    "'";
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.render("padding", { result });
  });
});

// Running

app.get("/running/:id", (req, res) => {
  var id = req.params.id;
  const query = "update task set work='Running' where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/padding");
  });
});

app.get("/running", (req, res) => {
  let data = localStorage.getItem("staff");
  data = JSON.parse(data);
  var query = "select * from task where work='Running' AND staffname='" + data.name + "'";
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.render("running", { result });
  });
});

// completed

app.get("/complete/:id", (req, res) => {
  var id = req.params.id;
  const query = "update task set work='Completed' where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/complete");
  });
});

app.get("/complete", (req, res) => {
  let data = localStorage.getItem("staff");
  data = JSON.parse(data);
  var query = "select * from task where work='Completed' AND staffname='" + data.name + "'";
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.render("complete", { result });
  });
});

app.listen(5000);
