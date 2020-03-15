const express = require("express")()
const fetch = require("node-fetch")

let maxNumCached = 0
let responsesCached = []

express.get("/loop/:upperNum", async (req, res) => {
  try {
    const begin = Date.now()

    let upperNum = parseInt(req.params.upperNum)

    if (maxNumCached >= upperNum) {
      return res.json({
        requestTime: `${(Date.now() - begin) / 1000} seconds`,
        posts: responsesCached.slice(0, upperNum)
      })
    }

    const returnedPosts = []

    for (let i = 1; i <= upperNum; i++) {
      returnedPosts.push(
        await fetch(`https://jsonplaceholder.typicode.com/photos/${i}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        }).then(promise => promise.json())
      )
    }

    if (upperNum > maxNumCached) {
      maxNumCached = upperNum
      responsesCached = returnedPosts
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

    let upperNum = parseInt(req.params.upperNum)

    if (maxNumCached >= upperNum) {
      return res.json({
        requestTime: `${(Date.now() - begin) / 1000} seconds`,
        posts: responsesCached.slice(0, upperNum)
      })
    }

    const promises = []

    for (let i = 1; i <= upperNum; i++) {
      promises.push(
        fetch(`https://jsonplaceholder.typicode.com/photos/${i}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        }).then(promise => promise.json())
      )
    }

    const fetchAll = await Promise.allSettled(promises)

    if (upperNum > maxNumCached) {
      maxNumCached = upperNum
      responsesCached = fetchAll
    }

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
