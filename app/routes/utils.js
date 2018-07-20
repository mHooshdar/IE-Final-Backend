module.exports = function(app, db) {
  // register
  app.post('/register', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    db.query("select * from user where username='" + req.body.username + "' and password='" + req.body.password + "'", function(err, results) {
      if (err) res.send(err);
      if(results[0]){
        res.send({
          success: "false",
          desc: "کاربر موجود است"
        });
      }
      else{
        db.query("insert into user (username, password) values('" + req.body.username + "', '" + req.body.password + "')", function(err2, results2) {
          if (err2) res.send(err2);
          req.session.userId = results2.insertId;
          res.send({
            success: "true",
            username: req.body.username,
            desc: "کاربر با موفقیت ثبت نام شد"
          });
        });
      }
    })
  });

  //login
  app.post('/login', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    db.query("select * from user where username='" + req.body.username + "' and password='" + req.body.password + "'", function(err, results) {
      if (err) res.send(err);
      
      if(results[0]){
        req.session.userId = results.insertId;
        res.send({
          success: "true",
          username: req.body.username,
          desc: "کاربر با موفقیت وارد شد"
        });
      }
      else{
        res.send({
          success: "false",
          desc: "نام کاربری یا رمز عبور غلط است."
        });
      }
    })
  });
};