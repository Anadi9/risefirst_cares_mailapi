const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const sendGrid = require('@sendgrid/mail');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change later to only allow our server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.post('/api/email', (req, res, next) => {

    console.log(req.body);

    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: process.env.EMAIL_TO,
        from: process.env.EMAIL_FROM,
        subject: 'Website User Message',
        text: req.body.message,
        html: `<html>
        <strong>Name: ${req.body.name}</strong><br/>
        <strong>Email: ${req.body.email}</strong><br/><br/>
        <strong>Message:</strong>
        <p>${req.body.message}</p>
        </html>`,
    }

    sendGrid.send(msg)
        .then(body => {

            res.status(200).json({
                success: true
            });

        })
        .catch(err => {

            console.log('error: ', err);
            res.status(404).json({
                success: false
            });

        });
});

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

const port = process.env.PORT || 5000


app.listen(port, () => {
    console.log("Server is running at 5000");
})