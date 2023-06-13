if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Review = require('./models/review.js');
const dbUrl = process.env.DB_URL;

// mongodb+srv://our-first-user:<password>@cluster1.xvqycbj.mongodb.net/?retryWrites=true&w=majority

// 'mongodb://localhost:27017/yay-or-nay'
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// }

//HOME PAGE

// app.get('/', (req, res) => {
//     res.render('home');
// });

app.get('/', catchAsync(async (req, res) => {
    const reviews = await Review.find({});
    res.render('reviews/index', { reviews });

}));

app.get('/login', (req, res) => {
    res.render('users/login');
});

app.get('/register', (req, res) => {
    res.render('users/register');
});


app.get('/reviews', catchAsync(async (req, res) => {
    const reviews = await Review.find({});
    res.render('reviews/index', { reviews });

}));

app.get('/reviews/yay', (req, res) => {
    res.render('reviews/yay');
});

app.get('/reviews/nay', (req, res) => {
    res.render('reviews/nay');
});

//insert validateReview, before catchAsync
app.post('/reviews', catchAsync(async (req, res, next) => {
    const review = new Review(req.body.review);
    await review.save();
    if (review.nay === true) {
        res.render('reviews/nayform', { review });
    } else {
        res.render('reviews/yayform', { review });
    }
}));

app.get('/reviews/:id', catchAsync(async (req, res) => {
    const review = await Review.findById(req.params.id);
    res.render('reviews/show', { review });
}));
//have to check if redundant
app.get('/reviews/:id/yayform', catchAsync(async (req, res) => {
    const review = await Review.findById(req.params.id);
    res.render('reviews/yayform', { review });

}));
//have to check if redundant
app.get('/reviews/:id/nayform', catchAsync(async (req, res) => {
    const review = await Review.findById(req.params.id);
    res.render('reviews/nayform', { review });

}));

//insert validateReview, before catchAsync
app.put('/reviews/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, { ...req.body.review });
    res.render('../socials');
}));

app.delete('/reviews/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.redirect('/reviews');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});