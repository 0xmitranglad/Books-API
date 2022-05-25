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
    let query = req.query;
    let where = {};

    if(query.hasOwnProperty('author') && query.author.length > 0) {
        where.author = {
            $like: '%' + query.author + '%'
        };
    }

    db.book.findAll({where: where}).then((books) => {
        res.json(books);
    }, (err) => {
        console.log('Book not found' + err.message);
        res.status(500).send();
    });
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

    let attributes = {};
    let body = _.pick(
        req.body,
        'name',
        'author',
        'language',
        'publisher',
        'edition',
        'publishYear'
    );


    if (body.hasOwnProperty('name')) {
        attributes.name = body.name;
    }
    
    db.book.findByPk(bookId).then((book) => {

        if(book) {

            book.update(attributes).then((book) => {
                res.json(book.toJSON());
            }, (err) => {
                res.status(400).send(err);
            });

        } else {
            res.status(404).send();
        }
    }, () => {
        res.status(500).send();
    });
});

//Delete book
app.delete('/books/:id', (req, res) => {
    let bookId = parseInt(req.params.id, 10);
    db.book.destroy({
        where: {id: bookId}
    }).then( (delBook) => {
        if(delBook === 0) {
            res.status(404).json({ err: 'Book not found' });
        } else {
            res.status(204).send();
        }
    }, () => {
        res.status(500).send();
    })  
});


//Getting Live
db.sequelize.sync().then(() => {
    app.listen(PORT, (req, res) => {
        console.log(`Listening on port: ${PORT}!`);
    });
});

