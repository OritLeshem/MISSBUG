const { useState, useEffect, useRef } = React
console.log('hello from filter')
import { bugService } from "../services/bug.service.js"


export function BugFilter({ onSetFilter, onSetSort }) {

  const [sortByToEdit, setSortByToEdit] = useState(bugService.getDefaultSort())
  const [filterByToEdit, setFilterByToEdit] = useState(bugService.getDefaultFilter())
  const elInputRef = useRef(null)

  useEffect(() => {
    elInputRef.current.focus()
  }, [])

  useEffect(() => {
    // update father cmp that filters change very type
    onSetFilter(filterByToEdit)
    onSetSort(sortByToEdit)
  }, [filterByToEdit, sortByToEdit])

  function handleChangeSort({ target }) {
    console.log(target.value)
    let { value, name: field, type } = target
    value = (type === 'checkbox') ? +value : value
    // if (target.value === 'createdAt') setSortByToEdit({ sortBy: 'createdAt' })
    // if (target.value === 'severity') setSortByToEdit({ sortBy: 'severity' })
    // if (target.value === 'all') setSortByToEdit({ sortBy: '' })

    if (target.value === 'createdAt') setSortByToEdit(prev => ({ ...prev, createdAt: 1 }))
    console.log(sortByToEdit)
    if (target.value === 'severity') setSortByToEdit(prev => ({ ...prev, severity: 1 }))
    if (target.value === 'createdAt') setSortByToEdit(prev => ({ ...prev, createdAt: 1 }))
    console.log(sortByToEdit)
  }

  function handleChange({ target }) {
    let { value, name: field, type } = target
    value = (type === 'number') ? +value : value
    console.log(value)
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    console.log(value)

  }

  function onSubmitFilter(ev) {
    // update father cmp that filters change on submit
    ev.preventDefault()
    console.log(filterByToEdit)
    onSetFilter(filterByToEdit)
  }

  // 
  return <section className="car-filter full main-layout">
    <h2>Filter our bugs</h2>
    <select className="sort-by" onChange={handleChangeSort}>
      <option value="all">ALL</option>
      <option value="severity">Severity</option>
      <option value="createdAt">Created At</option>
    </select>
    <label htmlFor="sort-desc">Desc</label>
    <input className="sort-desc" id="sort-desc" type="checkbox" onChange={handleChangeSort} />

    <form onSubmit={onSubmitFilter}>
      <label htmlFor="title">title:</label>
      <input type="text"
        id="title"
        name="title"
        placeholder="title"
        value={filterByToEdit.txt}
        onChange={handleChange}
        ref={elInputRef}
      />

      <label htmlFor="severity">severity:</label>
      <input type="number"
        id="severity"
        name="severity"
        placeholder="severity"
        value={filterByToEdit.severity}
        onChange={handleChange}
      />

      <button>Filter bugs!</button>
    </form>

  </section>
}