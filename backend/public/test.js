require("../models/User");
require("../models/Item");
require("../models/Comment");

const mongoose = require("mongoose");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");
const User = mongoose.model("User");

const MONGODB_URI = "mongodb://localhost/anythink-market"

async function main() {
    let query = {};
    let limit = 100;
    let offset = 0;
    
    mongoose.connect(MONGODB_URI);
    mongoose.set("debug", true);
    
    let str = "title0";
    
    
    let seller = await User.findOne({ username: "test0"});
    if (seller) {
        query.seller = seller._id;
    }
    
    let items = await Item.find(query)
    .limit(Number(limit))
    .skip(Number(offset))
    .sort({ createdAt: "desc" })
    .exec();
    items = items.filter(item => {
        return item.title===str;
    });
    
    return items;
}


main().then(()=> {
    console.log("finished");
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});