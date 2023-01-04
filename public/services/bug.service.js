
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    get,
    remove,
    save,
    getDefaultFilter,
    getDefaultSort

}

function query(filterBy = getDefaultFilter(), sortBy = getDefaultSort()) {
    const queryParams = `?title=${filterBy.title}&severity=${filterBy.severity}&pageIdx=${filterBy.pageIdx}&createdAt=${sortBy.createdAt}`
    return axios.get(BASE_URL + queryParams)
        .then(res => res.data)
}

function get(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    const url = (bug._id) ? BASE_URL + `${bug._id}` : BASE_URL
    const method = (bug._id) ? 'put' : 'post'
    return axios[method](url, bug).then(res => res.data)
    // let queryParams = `?title=${bug.title}&severity=${bug.severity}`
    // if (bug._id) queryParams += `&_id=${bug._id}`
    // return axios.get(BASE_URL + 'save' + queryParams).then(res => res.data)
}

function getDefaultFilter() {
    return { title: '', severity: '', pageIdx: 0 }
}

function getDefaultSort() {
    return { createdAt: -1, desc: 1, severity: 0 }
}

