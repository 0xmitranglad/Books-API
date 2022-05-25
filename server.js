const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const _ = require('underscore'); 
const db = require('./db.js');

let books = [];
let nextId = 1;

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

    db.book.create(body)
        .then((book) => {
            console.log(`promise obj after successful table creation: ${body}`);
            res.json(book.toJSON());
        }, (err) => {
            res.status(400).send();
        });
});

//Retrive books
app.get('/books', (req, res) => {
    res.json(books);
});

//Retrive books with :id
app.get('/books/:id', (req, res) => {
    let bookId = parseInt(req.params.id, 10);

    db.book.findByPk(bookId).then((book) => {
        !!book ? res.json(book.toJSON()) : res.status(404).send();
    }, (err) => {
        res.status(500).send();
    });
});

//Update
app.put('/books/:id', (req, res) => {
    let bookId = parseInt(req.params.id, 10);
    let matched = _.findWhere(books, {id: bookId});
    let valideAttributes = {};
    let body = _.pick(
        req.body,
        'name',
        'author',
        'language',
        'publisher',
        'edition',
        'publishYear'
    );

    if(!matched) {
        return res.status(404).send;
    }

    if (body.hasOwnProperty('name') && _.isString(body.name) && body.name.trim().length > 0) {
        valideAttributes.name = body.name;
    } else if (body.hasOwnProperty('name')) {
        return res.status(400).send();
    }
    
    _.extend(matched, valideAttributes);
    res.json(matched);
});

//Delete book
app.delete('/books/:id', (req, res) => {
    let bookId = parseInt(req.params.id, 10);
    let matched = _.findWhere(books, {id: bookId});

    if(!matched) {
        res.status(404).json({ "error": "Book not found"});
    } else {
        books = _.without(books, matched);
        res.json(matched);
    }    
});


//Getting Live
db.sequelize.sync({force: true}).then(() => {
    app.listen(PORT, (req, res) => {
        console.log(`Listening on port: ${PORT}!`);
    });
});

