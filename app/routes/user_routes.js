module.exports = function(app, db) {

  
  // home page parts
  app.get('/index', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    homePageResponseJson = {
      banners: [
        {
          bannerURL: host + "/images/index/male.jpg",
          bannerLink: "مردانه",
        },
        {
          bannerURL: host +  "/images/index/female.jpg",
          bannerLink: "زنانه",
        },
        {
          bannerURL: host +  "/images/index/kids.jpg",
          bannerLink: "بچه گانه",
        },
      ],
      aboutUsText: "بهترین ها را از ما خرید کنید",
      promotions: [
        {
          text: ""
        },
      ],
    }
    res.send(homePageResponseJson);
  });

  // search page
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

  //product page
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
              console.log(results5);
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
};