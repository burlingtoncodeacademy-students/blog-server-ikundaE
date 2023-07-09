const router = require('express').Router();
const dbPath = './api/blog.json';
const { v4: uuid_v4 } = require("uuid")
const { save, read } = require("../helpers/read_write")

//GET all blog posts
router.get('/', (_, res) => {
    try {
        const allComments = read(dbPath)
        res.status(200).json(allComments)
        /* res.render("index.pug", {
            allComments: allComments
          }); */
    } catch (err) {
        res.status(500).json({
            message: `${err}`
        })
    }
})

//GET one element by it's post_id
router.get("/:post_id", (req, res) => {
    try {
        let id = parseInt(req.params.post_id)
        let db = read(dbPath)
        const comment = db.find((comment) => comment.post_id === id);

        if (!comment) throw Error(`Post id don't exists`)

        res.status(200).json("Title: " + comment.title + ", Author: " + comment.author)
    } catch (err) {
        res.status(500).json({
            message: `${err}`
        })
    }
})

//create a new post comment
router.post("/create", (req, res) => {
    try {
        const db = read(dbPath)
        //const generatedID = db.length + 1
        const highestPostId = Math.max(...db.map(entry => entry.post_id)); // Get the highest post_id from the existing data
        const post_id = highestPostId + 1; // Generate the new post_id by adding one to the highest post_id

        if (Object.keys(req.body).length < 3) {
            throw Error("Please provide all content")
        }
        //let post_id = generatedID
        let newEntry = {post_id, ...req.body}

        db.push(newEntry)
        save(db, dbPath)
        console.log(newEntry)

        res.status(200).json({
            message: `New post created`,
            data: newEntry
        })

    } catch (err) {
        res.status(500).json({
            message: `${err}`
        })
    }
})

//update an existing comment
router.put("/update/:post_id", (req, res) => {
    try {
        let id = parseInt(req.params.post_id)
        const db = read(dbPath)
        let foundId = db.findIndex(post => post.post_id === id)

        if (foundId === -1) throw Error(`${id} not found`)

        db[foundId].title = req.body.title ?? db[foundId].title
        db[foundId].author = req.body.author ?? db[foundId].author
        db[foundId].body = req.body.body ?? db[foundId].body

        save(db, dbPath)

        res.status(200).json({
            message: `Updated data at index of ${foundId}`,
            data: db[foundId]
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            message: `${err}`
        })
    }
})

//remove or delete an existing post
router.delete("/delete/:post_id", (req, res) => {

    try {
        let id = parseInt(req.params.post_id)
        let db = read(dbPath)

        const updatedDB = db.filter(post => post.post_id !== id)
        if (db.length === updatedDB.length) throw Error(`${id} not found`)

        save(updatedDB, dbPath)

        res.status(200).json({
            message: `Database updated`
        })

    } catch (err) {
        res.status(500).json({
            message: `${err}`
        })
    }

})
module.exports = router;