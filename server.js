const express = require("express")()
const fetch = require("node-fetch")

let maxNumCached = 0
let responsesCached = []

express.get("/loop/:upperNum", async (req, res) => {
  try {
    const begin = Date.now()

    const upperNum = parseInt(req.params.upperNum)

    if (maxNumCached >= upperNum) {
      return res.json({
        requestTime: `${(Date.now() - begin) / 1000} seconds`,
        posts: responsesCached.slice(0, upperNum)
      })
    }

    const returnedPosts = []

    for (let i = maxNumCached + 1 || 1; i <= upperNum; i++) {
      returnedPosts.push(
        await fetch(`https://jsonplaceholder.typicode.com/photos/${i}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        }).then(promise => promise.json())
      )
    }

    maxNumCached = upperNum
    responsesCached = [...responsesCached, ...returnedPosts]

    return res.json({
      requestTime: `${(Date.now() - begin) / 1000} seconds`,
      posts: responsesCached
    })
  } catch (err) {
    return res.json({ error: err.message })
  }
})

express.get("/promise/:upperNum", async (req, res) => {
  try {
    const begin = Date.now()

    const upperNum = parseInt(req.params.upperNum)

    if (maxNumCached >= upperNum) {
      return res.json({
        requestTime: `${(Date.now() - begin) / 1000} seconds`,
        posts: responsesCached.slice(0, upperNum)
      })
    }

    const promises = []

    for (let i = maxNumCached + 1 || 1; i <= upperNum; i++) {
      promises.push(
        fetch(`https://jsonplaceholder.typicode.com/photos/${i}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        }).then(promise => promise.json())
      )
    }

    const fetchAll = await Promise.allSettled(promises)

    maxNumCached = upperNum
    responsesCached = [...responsesCached, ...fetchAll]

    return res.json({
      requestTime: `${(Date.now() - begin) / 1000} seconds`,
      posts: responsesCached
    })
  } catch (err) {
    return res.json({ error: err.message })
  }
})

express.listen(8000, err =>
  console.log(err || "Node.js/Express Server Running")
)
