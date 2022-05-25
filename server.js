const express = require('express');
const app = express();
const PORT = 3000;

const bodyParser = require('body-parser');
const _ = require('underscore'); 

let books = [];
let nextId = 1;
// let books = [{
//     id: 1,
//     name: 'Game of thrones',
//     author: 'George Martin',
//     language: 'English',
//     publisher: 'Voyager Books',
//     edition: 'Dance of Dragons',
//     publishYear: '2011'
// },
// {
//     id: 2,
//     name: 'Game of thrones',
//     author: 'George Martin',
//     language: 'English',
//     publisher: 'Voyager Books',
//     edition: 'Dance of Dragons',
//     publishYear: '2011'
// }];

// {
//     "name": "Game of thrones",
//     "author": "George Martin",
//     "language": "English",
//     "publisher": "Voyager Books",
//     "edition": "Dance of Dragons",
//     "publishYear": "2011"
// }

app.use(bodyParser.json());

//Create books
app.post('/books', (req, res) => {

    let body = _.pick(
        req.body,
        'name',
        'author',
        'language',
        'publisher',
        'edition',
        'publishYear'
    );

    if(!_.isString(body.name) || body.name.trim().length === 0) {
        return res.status(400).send();
    }

    body.name = body.name.trim();

    body.id = nextId++;
    books.push(body);

    res.json(body);
});

//Retrive books
app.get('/books', (req, res) => {
    res.json(books);
});

//Retrive books with :id
app.get('/books/:id', (req, res) => {
    let bookId = parseInt(req.params.id, 10);
    let matched = _.findWhere(books, {id: bookId});
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