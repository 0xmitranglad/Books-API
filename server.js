const express = require('express');
const app = express();
const PORT = 3000;

const bodyParser = require('body-parser');
const _ = require('underscore');

let books = [{
    id: 1,
    name: 'Game of thrones',
    author: 'George Martin',
    language: 'English',
    publisher: 'Voyager Books',
    edition: 'Dance of Dragons',
    publishYear: '2011'
},
{
    id: 2,
    name: 'Game of thrones',
    author: 'George Martin',
    language: 'English',
    publisher: 'Voyager Books',
    edition: 'Dance of Dragons',
    publishYear: '2011'
}];

app.use(bodyParser.json());

//Create 
app.post('/', (req, res) => {

});

//Retrive books
app.get('/books', (req, res) => {
    res.json(book);
});

//Retrive books with :id
app.get('/books/:id', (req, res) => {
    let bookId = parseInt(req.params.id, 10);
    let matched;

    books.forEach((book) => {
        if(bookId === book.id) {
            matched = book;
        }
    });
    matched ? res.json(matched) : res.status(404).send();
});

//Update
app.put('/', (req, res) => {

});

//Delete
app.delete('/', (req, res) => {

});


//Getting Live
app.listen(PORT, (req, res) => {
    console.log(`Listening on port: ${PORT}!`);
});