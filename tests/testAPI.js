const mongoose = require("mongoose")
const chai = require("chai");
chai.use(require("chai-http"));

const server = require("../index.js");

const {booksModel} = require("../routes/mongoose.js");

describe("Books API", function() {

    const TestBook = {
        "bookTitle":"Naked in Death",
        "author":"JD Robb",
        "genre":"Crime",
        "releaseDate":1995,
        "description":["Here is the novel that started it all- the first book in J.D. Robb's number-one New York Times-bestselling In Death series, featuring New York homicide detective Lieutenant Eve Dallas and Roarke. It is the year 2058, and technology now completely rules the world. But New York City Detective Eve Dallas knows that the irresistible impulses of the human heart are still ruled by just one thing: passion. When a senator's daughter is killed, the secret life of prostitution she'd been leading is revealed. The high-profile case takes Lieutenant Eve Dallas into the rarefied circles of Washington politics and society. Further complicating matters is Eve's growing attraction to Roarke, who is one of the wealthiest and most influential men on the planet, devilishly handsome... and the leading suspect in the investigation."],
        "information":[]
    }

    this.beforeAll("Test Database", async function () {
        await mongoose.connection.close();
        await mongoose.connect("mongodb://127.0.0.1:27017");
    })

    this.beforeEach("Test Data", async function() {
        await booksModel.deleteMany({});
        await booksModel.create(TestBook);
    })

    this.afterAll("Shut Down", function(){
        server.close();
        mongoose.connection.close();
    })

    it.only("/getAll", function() {
        chai.request(server).get("/mongoose/getAll").end((err,res) => {
            chai.expect(err).to.be.null;
            chai.expect(res.status).to.equal(200);

            chai.expect(res.body.length).to.equal(1);

            chai.expect(res.body[0].bookTitle).to.equal(TestBook.bookTitle);
            chai.expect(res.body[0].author).to.equal(TestBook.author);
            chai.expect(res.body[0].genre).to.equal(TestBook.genre);
            chai.expect(res.body[0].releaseDate).to.equal(TestBook.releaseDate);
            chai.expect(res.body[0].description[0]).to.equal(TestBook.description[0]);
        })
    })

    it("/getOne/:id", function() {
        chai.request(server).get("/mongoose/getOne/:id").end((err,res) => {
            chai.expect(err).to.be.null;
            chai.expect(res.status).to.equal(200);

            chai.expect(res.body.length).to.equal(1);

            chai.expect(res.body.bookTitle).to.equal(TestBook.bookTitle);
            chai.expect(res.body.author).to.equal(TestBook.author);
            chai.expect(res.body.genre).to.equal(TestBook.genre);
            chai.expect(res.body.releaseDate).to.equal(TestBook.releaseDate);
            chai.expect(res.body[0].description[0]).to.equal(TestBook.description[0]);
        })
    })

    it("/create", function() {

        const newBook = {
            "bookTitle":"Naked in Death",
            "author":"JD Robb",
            "genre":"Crime",
            "releaseDate":1995,
            "description":["Here is the novel that started it all- the first book in J.D. Robb's number-one New York Times-bestselling In Death series, featuring New York homicide detective Lieutenant Eve Dallas and Roarke. It is the year 2058, and technology now completely rules the world. But New York City Detective Eve Dallas knows that the irresistible impulses of the human heart are still ruled by just one thing: passion. When a senator's daughter is killed, the secret life of prostitution she'd been leading is revealed. The high-profile case takes Lieutenant Eve Dallas into the rarefied circles of Washington politics and society. Further complicating matters is Eve's growing attraction to Roarke, who is one of the wealthiest and most influential men on the planet, devilishly handsome... and the leading suspect in the investigation."],
            "information":[]
        }

        chai.request(server).put("/mongoose/create").send(newBook).end((err,res) =>{
            chai.expect(err).to.be.null;
            chai.expect(res.status).to.equal(201);
             
            console.log(res.body)
            chai.expect(res.body).to.be.not.equal({});

            chai.expect(res.body.bookTitle).to.be.equal(newBook.bookTitle);
            chai.expect(res.body.author).to.be.equal(newBook.author);
            chai.expect(res.body.genre).to.be.equal(newBook.genre);
            chai.expect(res.body.releaseDate).to.be.equal(newBook.releaseDate);
            chai.expect(res.body.description[0]).to.be.equal(newBook.description[0]);
        })
    })

    it("/update" , function() {
        return new Promise((done) => {

            const updateBook = {
                bookTitle:"Reminders of Him",
                author:"Colleen Hoover",
                genre:"Romance",
                releaseDate:2022,
                description:["A troubled young mother yearns for a shot at redemption in this heartbreaking yet hopeful story from #1 New York Times bestselling author Colleen Hoover. After serving five years in prison for a tragic mistake, Kenna Rowan returns to the town where it all went wrong, hoping to reunite with her four-year-old daughter. But the bridges Kenna burned are proving impossible to rebuild. Everyone in her daughter’s life is determined to shut Kenna out, no matter how hard she works to prove herself. The only person who hasn’t closed the door on her completely is Ledger Ward, a local bar owner and one of the few remaining links to Kenna’s daughter. But if anyone were to discover how Ledger is slowly becoming an important part of Kenna’s life, both would risk losing the trust of everyone important to them. The two form a connection despite the pressure surrounding them, but as their romance grows, so does the risk. Kenna must find a way to absolve the mistakes of her past in order to build a future out of hope and healing."]
            }

            booksModel.findOne({}).then(b => {
                chai.request(server).post(`/mongoose/update/${b.id}`).send(updateBook).then((res) => {
                    chai.expect(res.status).to.equal(200);

                    chai.expect(res.body).to.have.property("New");
                    chai.expect(res.body).to.have.property("Old");

                    chai.expect(res.body.New.bookTitle).to.equal(updateBook.bookTitle);
                    chai.expect(res.body.Old.bookTitle).to.equal(TestBook.bookTitle);
    
                    chai.expect(res.body.New.author).to.equal(updateBook.author);
                    chai.expect(res.body.Old.author).to.equal(TestBook.author);

                    chai.expect(res.body.New.genre).to.equal(res.updateBook.Old.genre);
                    chai.expect(res.body.Old.genre).to.equal(TestBook.genre);
    
                    chai.expect(res.body.New.releaseDate).to.equal(res.updateBook.Old.releaseDate);
                    
                    chai.expect(res.body.New.description).to.equal(res.updateBook.Old.description);
                    
                    done();

                })
            })
        })



    })


})