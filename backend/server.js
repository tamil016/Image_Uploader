const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/images', imageRoutes);

mongoose.connect("mongodb+srv://sndmail2tamil:tamilarasan123@cluster0.thhr83t.mongodb.net/", {
    //mongodb+srv://sndmail2tamil:tamilarasan123@cluster0.thhr83t.mongodb.net/
    //"mongodb+srv://tamilarasan:tamildbmongo@cluster0.iq4ja72.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(err => console.error('Failed to connect to MongoDB', err));
