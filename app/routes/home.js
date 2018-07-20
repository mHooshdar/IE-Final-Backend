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
};