import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import About from './pages/About'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Job Tracker</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/jobs">Jobs</Link> | <Link to="/about">About</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}
