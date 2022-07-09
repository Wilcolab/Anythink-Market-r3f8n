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
    return 0;
}

async function createOrGetUser(username, email, password) {
    
    let user = new User();
    user.username = username;
    user.email = email;
    user.setPassword(password);
    let uu = await user.save();
    
    return uu.toAuthJSON();
}


async function addItemToUser(userId, item) {
    
    let user = await User.findById(userId);
    item.seller = user;
    await item.save();
    return 0;
}


async function run() {
    console.log("start");
    await connectToMongo()
    for (let i = 0; i < 1; i++) {
        console.log("creating user: " + i);
        const username = "test";
        const email = username + "@test.com";
        const pass = "abcd1234"
        let user = await createOrGetUser(username, email, pass);
        for (let j = 0; j <3; j++) {
            console.log("creating item: " + j);
            await addItemToUser(user)
            console.log("user" +i+ " finished creating item: " + j);
        }
        console.log("finished creating user " + i);
    }
    return 0;
}

run().then(()=> {
    console.log("finised");
}).catch(e => {
    console.log("error " + e);
    process.exit(1);
});