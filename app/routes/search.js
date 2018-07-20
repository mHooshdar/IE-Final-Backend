module.exports = function(app, db) {
  // cetrgories
  app.get('/categories', (req, res) => {
    db.query('select * from category', function(err, results) {
      if (err) res.send(err);
      categoriesResponseJson=[];
      results.forEach(element => {
        if(!element.parentCategory){
          categoriesResponseJson.push({
            id: element.id,
            name: element.name,
            subCategory: []
          });
        }
        else{
          if(element.id < 100){
            parentId = Math.floor(element.id / 10) - 1;
            categoriesResponseJson[parentId].subCategory.push({
              id: element.id,
              name: element.name,
              subCategory: []
            })
          }
          else{
            parentParentId = Math.floor(element.id / 100) - 1;
            parentId = Math.floor(element.id / 10);
            categoriesResponseJson[parentParentId].subCategory.forEach(parent => {
              if(parent.id == parentId){
                parent.subCategory.push({
                  id: element.id,
                  name: element.name,
                })
              }
            })
          }
        }
      });
      res.send(categoriesResponseJson);
    })
  });

  //get products
  // not filter yet
  app.get('/products', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    productsResponseJson = []
    db.query('select * from product', function(err, results) {
      if (err) res.send(err);
      results.forEach(element => {
        productsResponseJson.push({
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
          productsResponseJson.forEach(product => {
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
        res.send(productsResponseJson);
      })
    })
  });
};