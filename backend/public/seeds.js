const axios = require('axios').default;
const auth = require('../routes/auth');

async function createItem(i) {
    return axios.post('http://localhost:3000/api/items', {
    item: {
        title: "test"+ i, description: "test"+ i, image: "test"+ i, tagList: ["test" + i]
    }}, {
        headers: {
          'Authorization': `Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYmMyZmNkNzJkMTM0MDA1NDEzNzQzOSIsInVzZXJuYW1lIjoiaXNoYXkiLCJleHAiOjE2NjIzOTQzMzUsImlhdCI6MTY1NzIxMDMzNX0.eiX4yEUyhNnGUg5JuRIrNaCN3WN4MgOmbCQ6E0n2rGc` 
        }
    })
}


async function run() {
    console.log("finised");
    for (let i = 0; i <100; i++) {
        console.log("creating item: " + i);
        await createItem(i);
        conso
        console.log("finished creating item: " + i);
    }
}

run().then(()=> {
    console.log("finised");
}).catch(e => {
    console.log("error " + e);
});

