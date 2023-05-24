require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sendEmail = require("./utils/sendEmail");
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const sch={
    email: String
}

const monmodel = mongoose.model("NGCUSTOMERS", sch);

app.post("/api/trip-list", async (req, res) => {
    const { email } = req.body;
    const { name } = req.body;
    try {
        const document = await monmodel.findOne({email: email});
        if (document) {
          res.status(200).json({ success: true, message: "Email Exist" });
        } else {
          const data = new monmodel({
            email: email,
            name: name
          });
          const val = await data.save();
      
          const send_to = email;
          const sent_from = process.env.EMAIL_USER;
          const reply_to = email;
          const subject = 'NAKED GROUND Subscription';
          const message = `
            <h1>You Subscribed!</h1>
            <p>Congratulations  ${name}, ${email} is subscribed!</p>
            <h2>NAKED GROUND</h2>
          `;
      
          await sendEmail(subject, message, send_to, sent_from, reply_to);
          res.status(200).json({ success: true, message: "Email Sent" });
        }
      } catch (error) {
        console.error('Failed to query the database.', error);
        res.status(500).json(error.message);
      }
});

app.use((req, res, next)=>{
    console.log(req.path,req.method)
    next()
})


mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log(`Connected to MongoDB`);
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port `,process.env.PORT);
        });          
    }).catch((err)=>{
        console.log(err)
    })

app.use(express.json())
