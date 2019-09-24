const express = require('express');
const ejs = require('ejs');
const logger = require('morgan');
const bodyParser = require('body-parser');
const db = require('./cofig/db.js')
const app = express();



// Database connection
db.connect((err) => {
    if(err) throw err;
    else console.log('Connected to database..');
});
global.db = db;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(logger('dev'));

/*
	app.get('/comments', getComments)
	app.get('/comments/:slug', getCommentsBySlug)
	app.post('/comments', createComment)
	app.put('/comments/:id', updateComment)
	app.delete('/comments/:id', deleteComment)

 */

// show all comment
app.get('/', (req, res, next) => {

	let query = "SELECT * FROM comment ORDER BY date DESC";
	db.query(query, (err, results, fields) => {
		if (err) throw err
		else {

			res.render('index.ejs', {
				comment: results
			})
		}
	});

});

// Create comment
app.post('/', (req, res, next) => {
	const { name, slug, text } = req.body;

	const parentCommentId = parseInt(req.body.parentCommentId)

	let query = "INSERT INTO comment (name, slug, text) VALUES (?, ?, ?)"
	db.query(query, [name, slug, text], (err, results, fields) => {
		if (err) {throw err;}
		else {
			res.redirect('/')		}
	});
});


// show comment by slug
app.get('/comment/:slug', (req, res, next) => {
	const slug = req.params.slug;

	console.log('SLUG: ' + slug);
	let query = "SELECT * FROM comment WHERE slug = $1 ORDER OF date DESC";

	db.query(query, [slug], (err, results, fields) => {
		if (err) {
			throw err
		} else {
			response.status(200).json(results.rows)
		}
	});
});



app.listen(3000, (err) => {
    console.log(`Server is running on PORT: ${3000}`);
});