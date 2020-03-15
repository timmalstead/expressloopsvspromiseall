const express = require("express")()
const fetch = require("node-fetch")

express.get("/loop/:upperNum", async (req, res) => {
  try {
    const begin = Date.now()

    const returnedPosts = []

    for (let i = 1; i <= parseInt(req.params.upperNum); i++) {
      const fetched = await fetch(
        `https://jsonplaceholder.typicode.com/photos/${i}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        }
      )
      const read = await fetched.json()
      returnedPosts.push(read)
    }

    const end = Date.now()

    return res.json({
      timeOfRequest: `${(begin - end) / 1000} seconds`,
      posts: returnedPosts
    })
  } catch (err) {
    res.status(400)
    return res.json({ body: { error: err.message } })
  }
})

express.get("/promise/:upperNum", async (req, res) => {
  try {
    const begin = Date.now()

    const promises = []

    for (let i = 1; i <= parseInt(req.params.upperNum); i++) {
      promises.push(
        fetch(`https://jsonplaceholder.typicode.com/photos/${i}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        }).then(promise => promise.json())
      )
    }

    const fetchAll = await Promise.allSettled(promises)

    const end = Date.now()

    return res.json({
      timeOfRequest: `${(begin - end) / 1000} seconds`,
      posts: fetchAll
    })
  } catch (err) {
    res.status(400)
    return res.json({ body: { error: err.message } })
  }
})

express.listen(8000, err =>
  console.log(err || "Node.js/Express Server Running")
)
