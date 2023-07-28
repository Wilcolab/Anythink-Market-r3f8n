var mongoose = require("mongoose");
require("../models/User")
require("../models/Item")
require("../models/Comment")
var User = mongoose.model("User");
var Item = mongoose.model("Item");
var Comment = mongoose.model("Comment");


const connection = process.env.MONGODB_URI;
mongoose.connect(connection);


//TODO: seeds script should come here, so we'll be able to put some data in our local env
async function seedDatabase() {
    for (let i = 0; i < 100; i++) {
      // add user
      const user = { username : `user${i}`, email: `user${i}@gmail.com` };
      const options = { upsert: true, new: true };
      const createdUser = await User.findOneAndUpdate(user, {}, options);
      
      // add item to user
      const item = {
        slug: `slug${i}`,
        title: `title ${i}`,
        description: `description ${i}`,
        seller: createdUser,
      };
      const createdItem = await Item.findOneAndUpdate(item, {}, options);
      
      // add comments to item
      if (!createdItem?.comments?.length) {
        let commentIds = [];
        for (let j = 0; j < 100; j++) {
          const comment = new Comment({
            body: `body ${j}`,
            seller: createdUser,
            item: createdItem,
          });
          await comment.save();
          commentIds.push(comment._id);
        }
        createdItem.comments = commentIds;
        await createdItem.save();
      }
    }
  }


seedDatabase()
  .then(() => {
  console.log("Finished DB seeding");
  process.exit(0);
})
.catch((err) => {
  console.log(`Error while running DB seed: ${err.message}`);
  process.exit(1);
});