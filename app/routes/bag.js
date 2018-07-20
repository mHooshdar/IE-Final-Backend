module.exports = function(app, db) {
  //get order products
  app.get('/orderProducts/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    getOrderProductResponse = []
    db.query("select * from product a inner join order_product b on a.id = b.productId inner join orderTable c on c.id = b.orderId inner join user_order d on d.orderId = c.id where d.userId='" + req.params.id + "'", function(err, results) {
      if (err) res.send(err);
      console.log(results);
      results.forEach(element => {
        db.query("select * from product inner join product_size on product.id = product_size.productId and product.id='" + element.productId + "'", function(err2, results2) {
          if (err2) res.send(err2);
          var temp = {
            size: "",
            color: "",
            src: ""
          };
          temp.size = results2[0].size;
          db.query("select * from product a inner join product_color b on a.id = b.productId inner join color c on b.colorId = c.id where a.id='" + element.productId + "'", function(err3, results3) {
            if (err3) res.send(err3);
            temp.color = results3[0].title;
            db.query("select * from product inner join product_image on product.id = product_image.productId and product.id='" + element.productId + "'", function(err4, results4) {
              if (err4) res.send(err4);
              temp.src = host + results4[0].src;
              getOrderProductResponse.push({
                id: element.productId,
                orderId: element.orderId,
                brandName: element.brandName,
                productName: element.name,
                price: element.price,
                color: "",
                size: "",
                src: "",
                percent: element.discount,
                numberOfProduct: element.quantity
              });
              getOrderProductResponse[getOrderProductResponse.length - 1].size = temp.size;
              getOrderProductResponse[getOrderProductResponse.length - 1].color = temp.color;
              getOrderProductResponse[getOrderProductResponse.length - 1].src = temp.src;
              if(results[results.length - 1] == element){
                res.send(getOrderProductResponse);
              }
            });
          });
        })
      });
    })
  });

  //delete order products
  app.delete('/orderProducts/:orderId/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    db.query("delete from order_product where orderId='" + req.params.orderId + "' and productId = '" + req.params.id + "'", function(err, results) {
      if (err) res.send(err);
      if(results.affectedRows == 1){
        res.send({
          success: true,
          desc: "سفارش مورد نظر با موفقیت پاک شد"
        })
      }
      else{
        res.send({
          success: false,
          desc: "خطا در پاک کردن سفارش"
        })
      }
    })
  });

  //delete order
  app.delete('/order/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    db.query("delete from orderTable where id='" + req.params.id + "'", function(err, results) {
      if (err) res.send(err);
      if(results.affectedRows == 1){
        res.send({
          success: true,
          desc: "سفارش مورد نظر با موفقیت پاک شد"
        })
      }
      else{
        res.send({
          success: false,
          desc: "خطا در پاک کردن سفارش"
        })
      }
    })
  });
}