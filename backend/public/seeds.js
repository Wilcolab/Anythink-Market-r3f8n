const axios = require('axios').default;
const mongoose = require("mongoose");
require('../models/User');
require('../models/Item');


const User = mongoose.model("User");
const Item = mongoose.model("Item");
const isProduction = process.env.NODE_ENV === "production";

process.env.MONGODB_URI = "mongodb://localhost:27017"

if (!process.env.MONGODB_URI) {
    console.warn("Missing MONGODB_URI in env, please add it to your .env file");
}


async function connectToMongo(){
    mongoose.connect(process.env.MONGODB_URI);
    if (isProduction) {
    } else {
        mongoose.set("debug", true);
    }
    
}

async function createUser(username, email, password) {
    
    let user = new User();
    user.username = username;
    user.email = email;
    user.setPassword(password);
    
    user.save()
    .then(function() {
        console.log("user saved: " + user)
        return { user: user.toAuthJSON() };
    })
    .catch(e => console.log(e));
}


async function addItemToUser(userId, item) {
    User.findById(userId)
    .then(function(user) {
        if (!user) {
        }
        
        item.seller = user;
        
        return item.save().then(function() {
            console.log("item saved: " + item);
        });
    })
    .catch(e => console.log("error: " + e));
}


async function run() {
    console.log("start");
    await connectToMongo()

    for (let i = 0; i <100; i++) {
        console.log("creating user: " + i);
        let user = await createUser("user"+i, "user"+i+"@test.com", "1234");

        for (let j = 0; j <100; j++) {
            
            
            console.log("creating item: " + j);
            var item = new Item({item: {title: "test" + j, description: "test" + j, image: "test" + j, tagList: ["test" + j]}});
            await addItemToUser(user, item)
            console.log("finished creating item: " + j);
        }
    }
}

run().then(()=> {
    
    console.log("finised");
}).catch(e => {
    console.log("error " + e);
});

