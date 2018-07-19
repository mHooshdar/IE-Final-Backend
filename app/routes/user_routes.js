module.exports = function(app, db) {

  
  // home page parts
  app.get('/index', (req, res) => {
    host =  req.protocol + "://" + req.get('host');
    retsponseJson = {
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
    res.send(retsponseJson);
  });

  app.get('/categories', (req, res) => {
    db.query('select * from category', function(err, results) {
      if (err) res.send(err);
      retsponseJson=[];
      results.forEach(element => {
        if(!element.parentCategory){
          retsponseJson.push({
            id: element.id,
            name: element.name,
            subCategory: []
          });
        }
        else{
          if(element.id < 100){
            parentId = Math.floor(element.id / 10) - 1;
            retsponseJson[parentId].subCategory.push({
              id: element.id,
              name: element.name,
              subCategory: []
            })
          }
          else{
            parentParentId = Math.floor(element.id / 100) - 1;
            parentId = Math.floor(element.id / 10);
            retsponseJson[parentParentId].subCategory.forEach(parent => {
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
      res.send(retsponseJson);
    })
  });
};