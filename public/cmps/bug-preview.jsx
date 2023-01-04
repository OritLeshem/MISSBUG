const { useState } = React
import { userService } from "../services/user.service.js"
export function BugPreview({ bug }) {
    const [userLoggedIn, setUserLoggedIn] = useState(userService.getLoggedinUser())


    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>{bug.description}</p>
        <h4>{bug.createdAt}</h4>
        <h4>{bug.creator.fullname}</h4>
    </article>
}