const router = require('express').Router();

var books = [{
    id:0,
    bookTitle:"Naked in Death",
    author:"JD Robb",
    genre:"Crime",
    releaseDate:1995,
    description:["Here is the novel that started it all- the first book in J.D. Robb's number-one New York Times-bestselling In Death series, featuring New York homicide detective Lieutenant Eve Dallas and Roarke. It is the year 2058, and technology now completely rules the world. But New York City Detective Eve Dallas knows that the irresistible impulses of the human heart are still ruled by just one thing: passion. When a senator's daughter is killed, the secret life of prostitution she'd been leading is revealed. The high-profile case takes Lieutenant Eve Dallas into the rarefied circles of Washington politics and society. Further complicating matters is Eve's growing attraction to Roarke, who is one of the wealthiest and most influential men on the planet, devilishly handsome... and the leading suspect in the investigation."]

}]

var id = 0;

router.get("/getAll", (req, res) => {
    res.status(200).json(books);
})

router.get("/getOne/:id", (req, res, next) => {
    for (const b of books) {
        if (b.id == req.params.id){
            res.status(200).json(b);
            return;
        }
    }
})

router.get("/getByBookName/:bookTitle", (req, res, next) => {
    console.log(req.params.bookTitle);
     for (const b of books) {
         if (b.bookTitle == req.params.bookTitle){
             res.status(200).json(b);
             return;
         }
     }
     
     next(new Error("Invaild Book Name"));
})

router.get("/getByGenre/:genre", (req, res, next) => {
    for (const b of books) {
        if (b.genre == req.params.genre){
            res.status(200).json(b);
            return;
        }
    }
})

router.put("/create", (req, res, next) => {
    if (req.body.bookTitle && req.body.releaseDate){
        req.body.id = ++id;
        books.push(req.body);
        res.status(201).json(req.body);
    }else{
        next(new Error('Expected {"bookTitle":"{title}", "author":"{author}", "genre":"{genre}", "releaseDate":"{release date}", "description":"{book description}"}'));
    }
})


router.post("/update/:id", (req, res, next) => {

    const index = books.indexOf(books.find(b => b.id == req.params.id));

    if (index === -1){

        next(new Error('Invalid Index'));
    }else{
        
        books[index] = {...books[index], ...req.body};
        res.status(200).json(books[index]);
    }
})

router.delete("/delete/:id", (req, res, next) => {
    try{
        
        books = books.filter(b => (b.id != req.params.id));
        res.status(200).json(books);
    }catch (err){
        next(new Error("Index invaild"));
    }
})

module.exports = router;