const express = require("express");
const ejs = require("ejs");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000


app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("views", path.join(__dirname, "/views/"));

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

var products = [
    {name:'Black Dress Shoes', price: 15.00, category: 'shoes', image: 'https://cdn.shopify.com/s/files/1/0419/1525/files/1024x1024-Men-Executive-Blac-211122_1024x1024_crop_bottom.jpg?v=1637710457'},
    {name:'Gold Sneakers', price: 15.00, category: 'shoes', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXFIG0vPRrehLkKAIwdfRN6lbhVLoEEBrQ3wXEt4NQIK6EBK-gO0e2jLSYDN9JPBy-dFo&usqp=CAU'},
    {name:'Red Heels', price: 25.00, category: 'shoes', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9tRkyMxKVaz0z5sGgVBFV_pQIh851PkI_Cg&usqp=CAU'},
    {name:'Black Heels', price: 27.00, category: 'shoes', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN2QgEbc24SJatissK9pyefOG8fuyB-lciJw&usqp=CAU'},
    {name:'Brown Watch 1919 CHRONOTIMER', price: 6733.62, category: 'accessories', image: 'https://k8q7r7a2.stackpathcdn.com/wp-content/uploads/2018/05/Porsche-design-1919-Chronotimer-Flyback-Brown-and-Leather-Baselworld-2018-1.jpg'},
    {name:'Grey Baby Romper', price: 18.00, category: 'baby', image: 'https://cdn.shopify.com/s/files/1/0261/5450/0154/products/BB0433SolidButtonCottonUnisexRomper_4_900x.jpg?v=1595486449'},
    {name:'Red Robot Toy', price: 22.00, category: 'toys', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQBtvsj9KiNUgIRxC8yavECUk8h-ZvRrwrUQ&usqp=CAU'},
    {name:'Orange Rain Coat', price: 32.00, category: 'clothing', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa62eFshZlY94DGn0kJwwpeHJKoAUBK426Hg&usqp=CAU'},
    {name:'Black T-Shirt', price: 12.00, category: 'clothing', image: 'https://cdn.shopify.com/s/files/1/0232/3963/products/black-tshirt-man_grande.jpg'},
    {name:'Orange Baby Romper', price: 25.00, category: 'baby', image: 'https://cdn.shopify.com/s/files/1/2550/3694/products/C35A2086_1296x.jpg?v=1597407363'},
    {name:'Navy Tennis Shoes', price: 15.00, category: 'shoes', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlC89SmVXASMDqeOEaRAd58WQ9foCh4U0kkw&usqp=CAU'},
    {name:'Blue Sneakers', price: 16.99, category: 'shoes', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj6Zyb6ZdZiKNUH6mfrr1Udk0oGJHGRPkDWQ&usqp=CAU'},
    {name:'Black Dining Chairs', price: 216.75, category: 'home', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXAjU5DPrMn-Vo0EQgGAiRsnHQK0fhp0j4fQ&usqp=CAU'},
    {name:'Purple Desk', price: 46.50, category: 'home', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5XfkIfbL9ELpn0yIugnm4YIZIp_q5Uy1SFw&usqp=CAU'},
    {name:'Red Baby Bib', price: 20.00, category: 'baby', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJdu7Msmh9oB9IZw2RsnSrN5_QOebYvU4I0A&usqp=CAU'},
    {name:'Yellow Dress', price: 25.00, category: 'clothing', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7K6ns3VLSfmQzcATqaOE0BtCC3sKQU4z-KA&usqp=CAU'},
    {name:'Purple Action Figure', price: 15.00, category: 'toys', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlXOz3z_Jd8WR590sSIjSYUgd3L_Q_xajqiQ&usqp=CAU'},
    {name:'Pink 4x4 Kids Jeep', price: 225.00, category: 'toys', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPzAfP5ts1q97CR-S1-nn9c-sr_pXJaDXRjA&usqp=CAU'},
    {name:'Red Studded Purse', price: 35.00, category: 'accessories', image: 'https://media.istockphoto.com/photos/women-is-holding-handbag-near-luxury-car-picture-id1271796113?b=1&k=20&m=1271796113&s=170667a&w=0&h=9vvvXq3GIokXs66KpwgKfJoIDYyQW9TEBXOWZSXhzX0='},
    {name:'Yellow Iphone 11 Leather Case', price: 36.30, category: 'accessories', image: 'https://cdn.shopify.com/s/files/1/1806/3989/products/yellowiphone11case_ad71aad5-c9c2-450c-973b-c6dbf0384153.jpg?v=1593111608'}
]

app.get("/", (req,res) => {
    res.render("index", {});
})

app.get("/shop", (req,res) => {
    res.render("shop", {});
});

app.get("/aboutus", (req,res) => {
    res.render("aboutus", {});
});

app.get("/stores", (req,res) => {
    res.render("stores", {});
});

app.get("/deals", (req,res) => {
    res.render("deals", {});
});

app.get("/getProducts", (req,res) => {
    res.send(products);
})

// app.listen("3000", () => {
//     console.log("Server running on PORT: 3000");
// })
// Heroku dynamically assigns your app a port. Heroku adds the port to the env.
//PORT 3000 is for local Dev Enviromnet.
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}` );
})
