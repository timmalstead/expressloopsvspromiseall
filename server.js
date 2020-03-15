const express = require("express")()
const fetch = require("node-fetch")

express.get("/loop/:upperNum", async (req, res) => {
  try {
    const begin = Date.now()

    const returnedPosts = []

    for (let i = 1; i <= parseInt(req.params.upperNum); i++) {
      returnedPosts.push(
        await fetch(`https://jsonplaceholder.typicode.com/photos/${i}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        }).then(promise => promise.json())
      )
    }

    return res.json({
      requestTime: `${(Date.now() - begin) / 1000} seconds`,
      posts: returnedPosts
    })
  } catch (err) {
    return res.json({ error: err.message })
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

    return res.json({
      requestTime: `${(Date.now() - begin) / 1000} seconds`,
      posts: fetchAll
    })
  } catch (err) {
    return res.json({ error: err.message })
  }
})

express.listen(8000, err =>
  console.log(err || "Node.js/Express Server Running")
)
