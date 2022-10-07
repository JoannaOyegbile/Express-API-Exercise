const {Schema, model} = require('mongoose');
const router = require('express').Router();

const infoSchema = new Schema({
    seriesName:{type:String, required:true},
    pages: String,
})

const booksSchema = new Schema({

    movieTitle:{type:String, required:true},
    author:{type:String, required:true},
    genre:{type:String, required:true},
    releaseDate:{type:Number, required:true},
    description:[String],
    information:[infoSchema]
})

const booksModel = model("books", booksSchema);

router.get("/getAll", (req, res, next) => {
    booksModel.find({}).then(books =>{
        res.status(200).json(books);
    }).catch(next);
})

router.get("/getOne/:id", (req, res, next) =>{
    booksModel.findById({"_id":req.params.id}).then(book =>{
        res.status(200).json(book);
    }).catch(next);
})

router.get("/getByBookName/:bookTitle", (req, res, next) =>{
    booksModel.findOne({"bookTitle":req.params.bookTitle}).then(book =>{
        if(book){
            res.status(200).json(book);
        }else{
            res.status(400).json(new Error("Invalid Book Name").stack);
        }
    }).catch(next);
})

router.get("/getByGenre/:genre", (req, res, next) =>{
    booksModel.findOne({"genre":req.params.genre}).then(book =>{
        if(book){
            res.status(200).json(booksModel);
        }else{
            res.status(400).json(new Error("Invalid genre").stack);
        }
    }).catch(next);
})

router.put("/create", (req, res, next) => {
    booksModel.create(req.body).then(book =>{
        res.status(201).json(book);
    }).catch(next);
})

router.post("/update/:id", (req, res, next) => {
    booksModel.findByIdAndUpdate({"_id":req.params.id}, req.body).then((Old) =>{
        booksModel.findById({"_id":req.params.id}).then((New) =>{
            res.status(200).json({Old, New});
        })
        
    }).catch(next);
})

router.delete("/delete/:id", (req, res, next) =>{
    booksModel.deleteOne({"_id":req.params.id}).then(r =>{
        res.status(200).json(r);
    }).catch(next);
})

module.exports = {moviesModel, router};