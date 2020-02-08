const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const db = require("../models/index");

//donor list table
router.post("/", function(req, res, next) {
  try {
    db.Donor.findAll({
      attributes: ['idNo','name', /* what are these? -> "id", "firstName", "lastName",*/ "contactNo", "email", "dnc", 'postalCode'],
      include: [
        {
          model: db.Donation,
          as: "donations",
          attributes: ['donationAmount']
        },
        {
          model: db.Salutation,
          nested: true
        }
      ]
    }).then(donor => {
      res.json(donor);
    });
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get("/sums", function(req, res, next) {
  db.Donation.sum("donationAmount").then(sum => {
    res.json(sum);
  });
});

router.put("/updatedonors/:id", (req, res) => {
  console.log("hello world");
  db.Donor.update(
    {
      email: req.body.email
    },
    {
      where: {
        id: req.params.id
      }
    }
  ).then(result => res.json(result));
});

//donor details
router.post("/details", function(req, res, next) {
  // GET selected donor of idNo.
  var ic_number =  req.body.donorIdNo;
  
  db.Donor.findAll({
    attributes: [
      "idNo",
      "name",
      "contactNo",
      "email",
      "dnc",
      [Sequelize.fn("SUM", Sequelize.col("donationAmount")),"totalAmountDonated"]
    ],
    where: {
      idNo: ic_number
    },
    include: [
      {
        model: db.Donation,
        as: "donations",
        attributes: []
      }
    ],
    group: ["Donor.id"]
  }).then( donorResponse => {
    res.status( 200 ).json(donorResponse);
  })
  .catch( error => {
    res.status( 400 ).send( error )
  });

        //,
        
//       })
//       .then(donorObj => {
//         res.json({
//           data: donorObj
//         });
//       });
//   } catch (err) {
//     res.status(500).json(err);
//   }
});

module.exports = router;
