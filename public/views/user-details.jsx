const { useEffect, useState } = React
import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.js"
import { BugPreview } from "../cmps/bug-preview.jsx"


export function UserDetails({ user }) {
  const [userLoggedIn, setUserLoggedIn] = useState(userService.getLoggedinUser())
  const [userBugs, setUserBugs] = useState()
  const [users, setUsers] = useState([])
  useEffect(() => {
    loadUserBugs()
    loadUsers()
  })
  function loadUserBugs() {
    bugService.query().then(bugs => setUserBugs(bugs))

  }
  function loadUsers() {
    userService.query().then(setUsers)
  }

  function onRemoveUser(userId) {
    console.log(userId)
    userService.remove(userId)
      .then(() => {
        console.log('Deleted Succesfully!')
        const userToUpdate = users.filter(user => user._id !== userId)
        setUsers(userToUpdate)
        // showSuccessMsg('user removed')
      })
      .catch(err => {
        console.log('Error from onRemoveBug ->', err)
        // showErrorMsg('Cannot remove user')
      })
  }



  return <div>
    {userLoggedIn && <h2>{userLoggedIn.fullname} bugs:</h2>}
    <ul className="bug-list">
      {userBugs && userBugs.filter(bug => bug.creator.fullname === userLoggedIn.fullname)
        .map(bug => <li className="bug-preview" key={bug._id}><BugPreview bug={bug} /></li>)}
    </ul>
    <hr />
    <h2>user list</h2>
    {userLoggedIn.isAdmin && users && <ul>{users.map(user => <li
      key={user._id}>
      {user.fullname}
      <button onClick={() => onRemoveUser(user._id)}>remove user</button>
    </li>)}</ul>}

  </div>
}