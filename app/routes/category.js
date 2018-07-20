module.exports = function(app, db) {
  // category page
  app.get('/brandsList', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    brandsListResponseJson = []
    db.query('select * from brand', function(err, results) {
      if (err) res.send(err);
      results.forEach(element => {
        brandsListResponseJson.push({
          id: element.id,
          brandName: element.brandName,
          src: host + element.src,
        });
      });
      res.send(brandsListResponseJson);
    })
  });

  //favorite products
  app.get('/favoriteProducts', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    favoriteProductsResponseJson = []
    db.query('select * from product', function(err, results) {
      if (err) res.send(err);
      results.forEach(element => {
        favoriteProductsResponseJson.push({
          id: element.id,
          percent: element.discount,
          brandName: element.brandName,
          productName: element.productName,
          price: element.price,
          src: "",
          src2: "",
        });
      });

      db.query('select * from product inner join product_image on product.id = product_image.productId', function(err2, results2) {
        if (err2) res.send(err2);
        results2.forEach(element2 => {
          favoriteProductsResponseJson.forEach(product => {
            if(product.id == element2.productId){
              if(product.src==""){
                product.src = host + element2.src;
              }
              if(product.src==product.src2 || product.src2==""){
                product.src2 = host + element2.src;
              }
              // product.src.push(host + element2.src);
            }
          });
        });
        res.send(favoriteProductsResponseJson);
      })
    })
  });

  //new products
  app.get('/newProducts', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    newProductsResponseJson = []
    db.query('select * from product', function(err, results) {
      if (err) res.send(err);
      results.forEach(element => {
        newProductsResponseJson.push({
          id: element.id,
          percent: element.discount,
          brandName: element.brandName,
          productName: element.productName,
          price: element.price,
          src: "",
          src2: "",
        });
      });

      db.query('select * from product inner join product_image on product.id = product_image.productId', function(err2, results2) {
        if (err2) res.send(err2);
        results2.forEach(element2 => {
          newProductsResponseJson.forEach(product => {
            if(product.id == element2.productId){
              if(product.src==""){
                product.src = host + element2.src;
              }
              if(product.src==product.src2 || product.src2==""){
                product.src2 = host + element2.src;
              }
              // product.src.push(host + element2.src);
            }
          });
        });
        res.send(newProductsResponseJson);
      })
    })
  });

  //linked products
  app.get('/linkedProducts', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    linkedProductsResponseJson = []
    db.query('select * from product', function(err, results) {
      if (err) res.send(err);
      results.forEach(element => {
        linkedProductsResponseJson.push({
          id: element.id,
          percent: element.discount,
          brandName: element.brandName,
          productName: element.productName,
          price: element.price,
          src: "",
          src2: "",
        });
      });

      db.query('select * from product inner join product_image on product.id = product_image.productId', function(err2, results2) {
        if (err2) res.send(err2);
        results2.forEach(element2 => {
          linkedProductsResponseJson.forEach(product => {
            if(product.id == element2.productId){
              if(product.src==""){
                product.src = host + element2.src;
              }
              if(product.src==product.src2 || product.src2==""){
                product.src2 = host + element2.src;
              }
              // product.src.push(host + element2.src);
            }
          });
        });
        res.send(linkedProductsResponseJson);
      })
    })
  });
}