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
    await mongoose.connect(process.env.MONGODB_URI);
    mongoose.set("debug", true);
    
}

async function createUser(username, email, password) {
    
    let user = new User();
    user.username = username;
    user.email = email;
    user.setPassword(password);
    
    let uu = await user.save();
    console.log("user saved: " + uu);
}


async function addItemToUser(userId, item) {
    let user = await User.findById(userId);
    if (!user) {
    }
        
    item.seller = user;
    
    await item.save();
}


async function run() {
    console.log("start");
    await connectToMongo()
    for (let i = 0; i <100; i++) {
        console.log("creating user: ");
        let user = await createUser("uuser"+i, "uuser@test.com"+i, "1234"+i);
        for (let j = 0; j <100; j++) {
            console.log("creating item: " + j);
            var item = new Item({item: {title: "test" + j, description: "test" + j, image: "test" + j, tagList: ["test" + j]}});
            await addItemToUser(user, item)
            console.log("user" +i+ " finished creating item: " + j);
        }
    }
}

run().then(()=> {
    console.log("finised");
}).catch(e => {
    console.log("error " + e);
});

