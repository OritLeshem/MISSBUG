import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BUG_KEY = 'bugDB'
_createBugs()

export const bugService = {
  query,
  get,
  remove,
  save,
  getEmptyBug,
  getDefaultFilter,
}

function query(filterBy = getDefaultFilter()) {
  return storageService.query(BUG_KEY)
    .then(bugs => {
      if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        bugs = bugs.filter(bug => regex.test(bug.title))
      }
      if (filterBy.severity) {
        bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
      }
      return bugs
    })
}

function get(bugId) {
  return storageService.get(BUG_KEY, bugId)

}

function remove(bugId) {
  return storageService.remove(BUG_KEY, bugId)
}

function save(bug) {
  if (bug._id) {
    return storageService.put(BUG_KEY, bug)
  } else {
    return storageService.post(BUG_KEY, bug)
  }
}

function getEmptyBug(title = '', severity = '') {
  return { title, severity }
}

function getDefaultFilter() {
  return { title: '', severity: '' }
}

function _createBugs() {
  let bugs = utilService.loadFromStorage(BUG_KEY)
  if (!bugs || !bugs.length) {
    bugs = []
    bugs.push(_createBug('bug1', 3))
    bugs.push(_createBug('bug2', 10))
    bugs.push(_createBug('bug3', 1))

    utilService.saveToStorage(BUG_KEY, bugs)
  }
}

function _createBug(title, severity = 2) {
  const bug = getEmptyBug(title, severity)
  bug._id = utilService.makeId()
  return bug
}