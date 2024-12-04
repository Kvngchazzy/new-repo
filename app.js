const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
// const mongoose = require('mongoose');
const { Testimonial, Email, Event } = require('./models/eventDB');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const eventRouter = require('./router/eventRoute');
const testimonialRouter = require('./router/testimonialRoute');
const emailRouter = require('./router/emailRoute');
const authRouter = require('./router/authRoute');
const authMiddleWare = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const { getEvents } = require('./controllers/event');
const pool = require('./config/Db');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(methodOverride("_method"))
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
bodyParser.urlencoded({ extended: true })
app.use(fileUpload({ useTempFiles: true }));


app.get('/', async(req, res) => {
  const getTestimonialQuery = 'SELECT * FROM testimonials'
  try{
    const testimonials = await pool.query(getTestimonialQuery)
    // console.log(testimonials);
    res.render('index',{ testimonial: testimonials.rows});
  }catch(e){
    console.log(e.message)
  }
});

app.get('/about', (req, res) => {
    res.render('about');
});
  
app.get('/login', (req, res) => {
      res.render("login");
  });

app.get("/events",async (req, res)=> {
  try {
    const getEventQuery = 'SELECT * FROM events';
    const event = await pool.query(getEventQuery);
    res.render("events", { event: event.rows });
  } catch (err) {
    console.log(err.message);
  }
})
app.use("",authRouter);
app.use("/",emailRouter);
app.use("/",authMiddleWare, eventRouter);
app.use("/",authMiddleWare, testimonialRouter);
app.get("/admin",(req,res) => {
  res.render("admin");
})

// Connect to postgres
const start = async() => {
  try {
    // Test connection
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Error connecting to PostgreSQL:', err);
        } else {
            console.log('Connected to PostgreSQL:', res.rows[0]);
        }
    });
      app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
      });
  }
  catch(e){
      console.log(e.message)
  }
}
start()



