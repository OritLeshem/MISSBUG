const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
// import { bugService } from '../services/bug.service.local.js'

import { showErrorMsg } from '../services/event-bus.service.js'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.get(bugId)
            .then(bug => {
                setBug(bug)
            })
            .catch(err => {
                showErrorMsg('Cannot load bug')
            })
    }, [])

    if (!bug) return <h1>loadings....</h1>
    return bug && <div>
        <h3>Bug Details 🐛</h3>
        <h4>{bug.title}</h4>
        <h4>Bugs details</h4>
        <h4>{bug.description}</h4>
        <h4>{bug.createdAt}</h4>
        <h4>creator:{bug.creator.fullname}</h4>
        <p>Severity: <span>{bug.severity}</span></p>
        <Link to="/bug">Back to List</Link>
    </div>

}

