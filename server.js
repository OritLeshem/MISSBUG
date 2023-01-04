var colors = require('colors')
const express = require('express')
const bugService = require('./services/bug.service.js')
const userService = require('./services/user.service.js')
const cookieParser = require('cookie-parser')

const fs = require('fs')

const app = express()

// App configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// Real Routing in express

// List bugs
app.get('/api/bug', (req, res) => {
  const filterBy = req.query
  bugService.query(filterBy).then((bugs) => {
    res.send(bugs)
  })
    .catch(err => {
      console.log('error:', err)
      res.status(400).send('cant get bugs')
    })
})

// Update bug
app.put('/api/bug/:bugId', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('user Cannot update bug - no validation')

  const bug = req.body
  bug._id = req.params.bugId
  console.log(bug)
  console.log(req.body)
  bugService.save(bug, loggedinUser).then((savedBug) => {
    console.log(savedBug)
    res.send(savedBug)
  })
    .catch(err => {
      console.log('error:', err)
      res.status(400).send('cant update bug')
    })
})

// create bug
app.post('/api/bug', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('user Cannot add bug - no validation')

  const bug = req.body
  bugService.save(bug, loggedinUser).then((savedBug) => {
    res.send(savedBug)
  })
    .catch(err => {
      console.log('error:', err)
      res.status(400).send('cant add bug')
    })
})
// get By id
app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  // var visitedBugs = req.cookies.visitedBugs || []
  // if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

  // if (visitedBugs.length > 3) return res.status(401).send('wait for a bit')

  bugService.get(bugId).then((bug) => {
    // res.cookie('visitedBugs', visitedBugs)
    res.send(bug)
  }).catch(err => {
    console.log('error:', err)
    res.status(400).send('cant get bug')
  })
})

// Remove bug
app.delete('/api/bug/:bugId/', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('user Cannot delete bug - no validation ')

  const { bugId } = req.params
  console.log(bugId)
  bugService.remove(bugId, loggedinUser).then(() => {
    res.send({ msg: 'bug removed successfully', bugId })
  })
    .catch(err => {
      console.log('error:', err)
      res.status(400).send('cant delete bug')
    })
})


//USER API
//list
app.get('/api/user', (req, res) => {
  const filterBy = req.query
  userService.query(filterBy).then((users) => {
    res.send(users)
  })
    .catch(err => {
      console.log('error:', err)
      res.status(400).send('cant get users')
    })
})

// get By id user
app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params
  userService.get(userId).then((user) => {
    res.send(user)
  }).catch(err => {
    console.log('error:', err)
    res.status(400).send('cant get bug')
  })
})
// LOGIN
app.post('/api/user/login', (req, res) => {
  const { username, password } = req.body
  userService.login({ username, password })
    .then((user) => {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    })
    .catch(err => {
      console.log('Error:', err)
      res.status(400).send('Cannot login')
    })
})

// SIGNUP

app.post('/api/user/signup', (req, res) => {
  console.log('signup server!!')
  const { fullname, username, password } = req.body
  userService.signup({ fullname, username, password })
    .then((user) => {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    })
    .catch(err => {
      console.log('Error:', err)
      res.status(400).send('Cannot signup')
    })
})

// LOGOUT
app.post('/api/user/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('Logged out')
})

app.delete('/api/user/:userId/', (req, res) => {

  const { userId } = req.params
  console.log(userId)
  userService.remove(userId).then(() => {
    res.send({ msg: 'user removed successfully', userId })
  })
    .catch(err => {
      console.log('error:', err)
      res.status(400).send('cant delete user')
    })
})


app.listen(3030, () => console.log('Server ready at port 3030!'.rainbow))

