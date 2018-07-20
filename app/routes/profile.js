module.exports = function(app, db) {

  //get user detail
  app.get('/user/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    userResponseJson = {}
    db.query("select * from user where id='" + req.params.id + "'", function(err, results) {
      if (err) res.send(err);
      results.forEach(element => {
        userResponseJson ={
          id: element.id,
          src: element.avatarURL,
          name: element.name,
          city: element.city,
          phoneNumber: element.phoneNumber,
          homePhone: element.homePhone,
          date: element.date,
          cardNumber: element.cardNumber,
        };
      });
      res.send(userResponseJson);
    })
  });

  //change password
  app.put('/changePassword/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    changePasswordResponseJson = {}
    db.query("select * from user where id='" + req.params.id + "' and password='" + req.body.password + "'", function(err, results) {
      if (err) res.send(err);
      if(Object.keys(results).length != 0){
        db.query("update user set password = '" + req.body.newPassword + "' where id='" + req.params.id + "'", function(err2, results2) {
          if (err2) res.send(err2);
          res.send({
            success: true,
            desc: "رمز با موفقیت عوض شد"
          });
        });
      }
      else{
        res.send({
          success: false,
          desc: "رمز وارد شده نادرست است"
        });
      }
    })
  });

  //change user detail
  app.put('/user/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    if(!req.body.name){
      req.body.name = "";
    }
    if(!req.body.city){
      req.body.city = "";
    }
    if(!req.body.phoneNumber){
      req.body.phoneNumber = "";
    }
    if(!req.body.homePhone){
      req.body.homePhone = "";
    }
    if(!req.body.cardNumber){
      req.body.cardNumber = "";
    }
    if(!req.body.date){
      req.body.date = "";
    }
    db.query("select * from user where id='" + req.params.id + "' and password='" + req.body.password + "'", function(err, results) {
      if (err) res.send(err);
      if(Object.keys(results).length != 0){
        db.query("update user set name = '" + req.body.name + "'" + ", city = '" + req.body.city + "'" + ", phoneNumber = '" + req.body.phoneNumber + "'" + ", homePhone = '" + req.body.homePhone + "'" + ", cardNumber = '" + req.body.cardNumber + "'" + ", date = '" + req.body.date + "'"+ " where id='" + req.params.id + "'", function(err2, results2) {
          if (err2) res.send(err2);
          res.send({
            success: true,
            desc: "اطلاعات کاربر با موفقیت به روز رسانی شد"
          });
        });
      }
      else{
        res.send({
          success: false,
          desc: "رمز وارد شده نادرست است"
        });
      }
    })
  });

  //get addresses
  app.get('/addresses/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    addressesResponseJson = []
    db.query("select * from user a inner join user_address b on a.id = b.userId inner join address c on b.addressId = c.id where a.id='" + req.params.id + "'", function(err, results) {
      if (err) res.send(err);
      results.forEach(element => {
        addressesResponseJson.push({
          id: element.id,
          name: element.name,
          phoneNumber: element.phoneNumber,
          homePhone: element.homePhone,
          address: element.addressText,
          zipCode: element.zipCode,
        });
      });
      res.send(addressesResponseJson);
    })
  });

  //delete addresses
  app.delete('/addresses/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    db.query("delete from address where id='" + req.params.id + "'", function(err, results) {
      if (err) res.send(err);
      if(results.affectedRows == 1){
        res.send({
          success: true,
          desc: "آدرس مورد نظر با موفقیت پاک شد"
        })
      }
      else{
        res.send({
          success: false,
          desc: "خطا در پاک کردن آدرس"
        })
      }
    })
  });

  //update addresses
  app.put('/addresses/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    db.query("update address set addressText = '" + req.body.address + "'" + " where id='" + req.params.id + "'", function(err, results) {
      if (err) res.send(err);
      if(results.affectedRows == 1){
        res.send({
          success: true,
          desc: "آدرس مورد نظر با موفقیت به روز رسانی شد"
        })
      }
      else{
        res.send({
          success: false,
          desc: "خطا در به روز رسانی آدرس"
        })
      }
    })
  });

   //add addresses
   app.post('/addresses/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    db.query("insert into address (addressText) values ('" + req.body.address + "')", function(err, results) {
      if (err) res.send(err);
      var lastAddressId = results.insertId;
      db.query("insert into user_address (addressId, userId) values (LAST_INSERT_ID(), '" + req.params.id + "')", function(err2, results2) {
        if (err2) res.send(err2);
        res.send({
          success: true,
          id: lastAddressId,
          desc: "آدرس جدید اضافه شد"
        });
      })
    })
  });

  //get orders
  app.get('/orders/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    getOrdersResponse = []
    db.query("select * from orderTable, user_order where orderTable.id = user_order.orderId and user_order.userId = '" + req.params.id + "'", function(err, results) {
      if (err) res.send(err);
      results.forEach(element => {
        getOrdersResponse.push({
          id: element.id,
          date: element.deliveryTime,
          price: element.totalPrice,
          state: element.status,
          // paymentType: element.paymentType,
          // address: element.address,
          // products: element.products,
        });
      });
      res.send(getOrdersResponse);
    })
  });
};