const express = require('express'); 
const dotenv = require('dotenv'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const paymentRoute = require('./routes/payment'); 

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected successfully')) 
    .catch((e) => console.log(e)); 

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());


app.use("/auth", authRoutes);
app.use('/api/payment', paymentRoute);


app.listen(port, () => {
    console.log(`Server running on port ${port}`); 
});

app.use('/', (req, res) => {
    res.send('');
});
