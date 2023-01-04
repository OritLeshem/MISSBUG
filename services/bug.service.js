const fs = require('fs');
var bugs = require('../data/bug.json')
const colors = require('colors')


module.exports = {
  query,
  get,
  save,
  remove

}

function query(filterBy) {
  let filteredBugs = bugs
  if (filterBy.title) {
    const regex = new RegExp(filterBy.title, 'i')
    filteredBugs = filteredBugs.filter(bug => regex.test(bug.title))
  }
  // if (filterBy.severity) {
  //   filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.severity)
  // }
  // if (filterBy.createdAt === '1') {
  //   filteredBugs.sort((a, b) => a.createdAt - b.createdAt)

  // }


  return Promise.resolve(filteredBugs)
}
function get(bugId) {
  const bug = bugs.find(bug => bug._id === bugId)
  return Promise.resolve(bug)
}
function remove(bugId, loggedinUser) {
  const idx = bugs.findIndex(bug => bug._id === bugId)
  if (idx === -1) return Promise.reject('No Such bug')
  const bug = bugs[idx]
  // console.log('creator id: ', bug.creator._id, 'loggedinUser._id', loggedinUser._id)
  if (bug.creator._id !== loggedinUser._id && !loggedinUser.isAdmin) return Promise.reject('Not your Car to update')
  if (bug.creator._id === loggedinUser._id || loggedinUser.isAdmin) {

    console.log('delete'.underline.red)
    bugs.splice(idx, 1)
  }
  return _writeBugsToFile()
}

function save(bug, loggedinUser) {
  console.log("removebugservise:", bug.creator._id, loggedinUser)
  if (bug._id) {
    const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
    if (!bugToUpdate) return Promise.reject('no such bug')

    if (bug.creator._id !== loggedinUser._id && !loggedinUser.isAdmin) return Promise.reject('Not your Car to update')
    if (bug.creator._id === loggedinUser._id || loggedinUser.isAdmin) {

      console.log('editttt'.underline.red)
      console.log(bug.creator._id, loggedinUser)
      bugToUpdate.title = bug.title
      bugToUpdate.severity = bug.severity
    }
  } else {
    bug._id = _makeId()
    bug.creator = loggedinUser
    bugs.push(bug)
  }
  return _writeBugsToFile().then(() => bug)
}


function _makeId(length = 5) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


function _writeBugsToFile() {
  return new Promise((res, rej) => {
    const data = JSON.stringify(bugs, null, 2)
    fs.writeFile('data/bug.json', data, (err) => {
      if (err) return rej(err)
      // console.log("File written successfully\n");
      res()
    });
  })
}






