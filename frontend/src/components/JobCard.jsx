import React from 'react'

export default function JobCard({ job }) {
  return (
    <article className="job-card">
      <h3>{job.title}</h3>
      <p><strong>{job.company}</strong></p>
      <p>Status: {job.status}</p>
    </article>
  )
}
