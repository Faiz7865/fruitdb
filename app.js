const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")

mongoose.connect("mongodb+srv://mhfaeez:tayyab@cluster0.vmo1wxy.mongodb.net/fruitsDB")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log(err);
    })

const fruitsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        min: 5,
        max: 10,
    },
    rating: String,
});

const Fruit = mongoose.model("Fruit", fruitsSchema);

const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    region: String,
})

const Person = mongoose.model("Person", personSchema);

app.get("/", (req, res) => {
    Fruit.find()
        .then((fruit) => {
            res.render("index", { fruits: fruit });
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/")
        })
});

app.post("/", (req, res) => {
    const deleteBtn = req.body.removeBtn;

    Fruit.findOneAndDelete({ _id: deleteBtn })
        .then(() => {
            res.redirect("/")
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/")
        })
})

app.get("/addfruits", (req, res) => {
    res.render("newfruit");
})
app.post("/addfruits", (req, res) => {
    const name = req.body.fruitName;
    const value = req.body.fruitValue;
    const rating = req.body.review;

    const newFruit = new Fruit({ name, value, rating });
    Fruit.find()
        .then((fruits) => {
            if (fruits) {
                const fountItem = fruits.some((item) => item.name === name)
                if (fountItem) {
                    console.log(`${name} is already saved please store another fruit`);
                    res.redirect("/");
                } else (
                    newFruit.save()
                        .then(() => {
                            res.redirect("/")
                        })
                        .catch((err) => {
                            console.log(err);
                            res.redirect("/")
                        })
                )
            }
        })
})


app.listen(port, () => {
    console.log("Server is runnning on port " + port);
});
