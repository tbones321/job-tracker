import React, { useState, useMemo, useEffect } from 'react'

// Use Vite env var for API base, falling back to localhost:8080
const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [sortBy, setSortBy] = useState('title')
  const [sortDir, setSortDir] = useState('asc')
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState('Applied')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/jobs`)
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setJobs(data)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  async function addJob(e) {
    e.preventDefault()
    if (!title.trim() || !company.trim()) return
    try {
      const res = await fetch(`${API}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), company: company.trim(), status })
      })
      const created = await res.json()
      setJobs((s) => [created, ...s])
      setTitle('')
      setCompany('')
      setStatus('Applied')
    } catch (err) {
      console.error(err)
    }
  }

  const sortedJobs = useMemo(() => {
    const copy = [...jobs]
    copy.sort((a, b) => {
      const A = (a[sortBy] || '').toString().toLowerCase()
      const B = (b[sortBy] || '').toString().toLowerCase()
      if (A < B) return sortDir === 'asc' ? -1 : 1
      if (A > B) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return copy
  }, [jobs, sortBy, sortDir])

  return (
    <section>
      <h2>Jobs</h2>
      <div className="sort-controls">
        <label>
          Sort by:{' '}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">Job Title</option>
            <option value="company">Company</option>
            <option value="status">Status</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
        >
          {sortDir === 'asc' ? 'Asc' : 'Desc'}
        </button>
      </div>

      <div className="jobs-table-wrap">
        <table className="jobs-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedJobs.map((j) => (
              <tr key={j.id}>
                <td>{j.title}</td>
                <td>{j.company}</td>
                <td>
                  <select
                    value={j.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value
                      try {
                        const res = await fetch(`${API}/api/jobs/${j.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ...j, status: newStatus })
                        })
                        const updated = await res.json()
                        setJobs((prev) => prev.map((job) => (job.id === j.id ? updated : job)))
                      } catch (err) {
                        console.error(err)
                      }
                    }}
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </td>
                <td
                  style={{
                    maxWidth: 240,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere'
                  }}
                  title={j.notes || ''}
                >
                  {j.notes || ''}
                </td>
                <td>
                  <button
                    type="button"
                    onClick={async () => {
                      const current = j.notes || ''
                      const newNotes = prompt('Edit notes for this job:', current)
                      if (newNotes === null) return
                      try {
                        const res = await fetch(`${API}/api/jobs/${j.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ...j, notes: newNotes })
                        })
                        const updated = await res.json()
                        setJobs((prev) => prev.map((job) => (job.id === j.id ? updated : job)))
                      } catch (err) {
                        console.error(err)
                        alert('Failed to save notes')
                      }
                    }}
                    style={{marginRight:8}}
                  >
                    Edit Notes
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm('Delete this job?')) return
                      try {
                        const res = await fetch(`${API}/api/jobs/${j.id}`, { method: 'DELETE' })
                        if (!res.ok && res.status !== 204) throw new Error('Delete failed')
                        setJobs((prev) => prev.filter((job) => job.id !== j.id))
                      } catch (err) {
                        alert('Failed to delete job')
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="add-job" onSubmit={addJob} style={{ marginTop: 20 }}>
        <h3>Add a job</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <input
            placeholder="Job title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>

        <div style={{marginTop:8}}>
          <label>
            Status:{' '}
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </label>
        </div>

        <div style={{marginTop:12}}>
          <button type="submit">Add Job</button>
        </div>
      </form>
    </section>
  )
}
