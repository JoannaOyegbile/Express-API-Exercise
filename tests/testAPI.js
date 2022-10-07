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

    this.beforeAll("Test Data", async function() {
        await booksModel.deleteMany({});
        await booksModel.create(TestBook);
    })

    this.afterAll("Shut Down", function(){
        server.close();
        mongoose.connection.close();
    })

    it("/getAll", function() {
        chai.request(server).get("/mongoose/getAll").end((err,res) => {
            chai.expect(err).to.be.null;
            chai.expect(res.status).to.equal(200);

            chai.expect(res.body.length).to.equal(1);

            chai.expect(res.body[0].bookTitle).to.equal(TestBook.bookTitle);
            chai.expect(res.body[0].author).to.equal(TestBook.author);
            chai.expect(res.body[0].genre).to.equal(TestBook.genre);
            chai.expect(res.body[0].releaseDate).to.equal(TestBook.releaseDate);
            chai.expect(res.body[0].description).to.equal(TestBook.description);
        })
    })


})