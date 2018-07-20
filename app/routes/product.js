
module.exports = function(app, db) {
  //getinformation
  app.get('/information/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    inofrmationResponseJson = []
    db.query("select * from information where productId='" + req.params.id + "'", function(err, results) {
      if (err) res.send(err);
      results.forEach(element => {
        inofrmationResponseJson.push({
          id: element.id,
          key: element.key,
          value: element.value,
        });
      });
      res.send(inofrmationResponseJson);
    })
  });

  //get product
  app.get('/product/:id', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    productDetailResponseJson = {}
    db.query("select * from product where id='" + req.params.id + "'", function(err, results) {
      if (err) res.send(err);
      results.forEach(element => {
        productDetailResponseJson = {
          id: element.id,
          percent: element.discount,
          price: element.price,
          srcs: [],
          features: [],
          sizes: [],
          brandName: element.brandName,
          productName: element.name,
          colors: [],
        };
      });
      db.query("select * from product inner join product_image on product.id = product_image.productId and product.id='" + req.params.id + "'", function(err2, results2) {
        if (err2) res.send(err2);
        results2.forEach(element2 => {
          productDetailResponseJson.srcs.push(host + element2.src);
        });
        db.query("select * from product inner join product_feature on product.id = product_feature.productId and product.id='" + req.params.id + "'", function(err3, results3) {
          if (err3) res.send(err3);
          results3.forEach(element3 => {
            productDetailResponseJson.features.push(element3.feature);
          });
          db.query("select * from product inner join product_size on product.id = product_size.productId and product.id='" + req.params.id + "'", function(err4, results4) {
            if (err4) res.send(err4);
            results4.forEach(element4 => {
              productDetailResponseJson.sizes.push(element4.size);
            });
            db.query("select * from product a inner join product_color b on a.id = b.productId inner join color c on b.colorId = c.id where a.id='" + req.params.id + "'", function(err5, results5) {
              if (err5) res.send(err5);
              results5.forEach(element5 => {
                productDetailResponseJson.colors.push({
                  title: element5.title,
                  color: element5.color,
                });
              });
              res.send(productDetailResponseJson);
            });
          })
        })
      })
    })
  });
}