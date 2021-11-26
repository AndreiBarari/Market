if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
};

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const localStragety = require('passport-local');

const farmRoute = require('./routes/farms');
const productRoute = require('./routes/products');
const userRoute = require('./routes/users');

const User = require('./models/user');

const MongoDBStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/farm-market';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const secret = process.env.SECRET || 'secret';

const store = new MongoDBStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', function (e) {
    console.log("Session error", e)
})

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 *24 * 7,
        maxAge: 1000 * 60 * 60 *24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStragety(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
 res.locals.success = req.flash('success');
 res.locals.error = req.flash('error');

    res.locals.CurrentUser = req.user;
    next();
})

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/'));




// farm route
app.use('/farms', farmRoute);
// product route
app.use('/farms/:id/products', productRoute);
// user route
app.use('/', userRoute);

app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
});

app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    if (!err.message) err.message = 'Unexpected Error'
    res.status(statusCode).render('error', {
        err
    })
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
});