import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Jobs from './pages/Jobs'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Job Tracker</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/jobs">Jobs</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
        </Routes>
      </main>
    </div>
  )
}
