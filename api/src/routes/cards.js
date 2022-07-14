var express = require('express')
var router = express.Router();


// There is gonna need to be some authentication here
const { models, schemas } = require('../database');
const { Card } = models;
const { CardCRUDValidation } = require("../middleware");


router.get('/', CardCRUDValidation.search, async function(req, res){
    // Get and return cards from database
    Card.find(req.body)
        .then((found)=>{
            res.send(found);
        })
        .catch((err)=>{
            throw err;
        })
});

router.post('/', CardCRUDValidation.create, async function(req, res){
    // Create new card
    const newCard = new Card(req.body);
    newCard.save(function (err) {
        if (err) throw err;
        res.status(201).send("Created!");
    });
});

router.put('/:id', CardCRUDValidation.update, async function(req, res){
    // Update card at
    // TODO
    res.status(401);
})

router.delete('/:id', CardCRUDValidation.delete, async function(req, res){
    Card.deleteOne({_id: req.params.id}, function (err) {
        if (err) throw err;
        res.send("Deleted!");
    });
});

module.exports = router
