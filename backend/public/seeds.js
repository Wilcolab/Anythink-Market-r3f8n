const axios = require('axios').default;
const mongoose = require("mongoose");
require('../models/User');
require('../models/Item');
require('../models/Comment');


const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");
const isProduction = process.env.NODE_ENV === "production";

//process.env.MONGODB_URI = "mongodb://localhost:27017"
process.env.MONGODB_URI="mongodb://localhost/anythink-market"

if (!process.env.MONGODB_URI) {
    console.warn("Missing MONGODB_URI in env, please add it to your .env file");
}


async function connectToMongo(){
    await mongoose.connect(process.env.MONGODB_URI);
    //mongoose.set("debug", true);
    return 0;
}

async function createOrGetUser(username, email, password) {
    let user = new User();
    user.username = username;
    user.email = email;
    user.setPassword(password);
    let uu = await user.save();
    //console.log("user saved: " + JSON.stringify(uu.toAuthJSON()));
    console.log("user saved: " + username)
    return uu;
}


async function addCommentToItem(user, item){
    let user = await User.findById(userId);
    if (user)
        console.log("user found");
    else
        console.log("user is undefined");
    let comment = new Comment({body: "body"});
    comment.item = item;
    comment.seller = user;
    await comment.save();
    console.log("added comment to item");
    return 0;
}


async function addItemToUser(userId, item) {
    //console.log("looking for user: " + userId)
    let user = await User.findById(userId);
    if (user)
        console.log("user found");
    else
        console.log("user is undefined");
    item.seller = user;
    let res = await item.save();
    console.log("added item to user");
    return res;
}


async function run() {
    console.log("start");
    await connectToMongo()
    for (let i = 0; i < 100; i++) {
        console.log("creating user: " + i);
        const username = "test" + i;
        const email = username + "@test.com";
        const pass = "abcd1234"
        let user = await createOrGetUser(username, email, pass);
        for (let j = 0; j <100; j++) {
            console.log("creating item: " + j);
            let item = new Item({
                title: "title" + j, description: "", image: "", tagList: []
            });
            item = await addItemToUser(user, item)
            console.log("user" + i + " finished creating item: " + j);
            await addCommentToItem(item, user)
        }
        console.log("finished creating user " + i);
    }
    return 0;
}

run().then(()=> {
    console.log("finised");
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});