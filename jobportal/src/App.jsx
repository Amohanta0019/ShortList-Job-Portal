import { NavLink, Link, Route, Routes } from 'react-router-dom';
import { Bookmark, Plus } from 'lucide-react';
import Home from './pages/Home.jsx';
import JobDetails from './pages/JobDetails.jsx';
import JobForm from './pages/JobForm.jsx';
import Saved from './pages/Saved.jsx';
import { useApp } from './context.jsx';

export default function App() {
  const { saved } = useApp();
  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-in">
          <Link to="/" className="brand">Shortlist</Link>
          <nav className="nav">
            <NavLink to="/" end>Jobs</NavLink>
            <NavLink to="/saved"><Bookmark size={16} /> Saved{saved.length > 0 && <span className="count">{saved.length}</span>}</NavLink>
          </nav>
          <Link to="/jobs/new" className="btn primary"><Plus size={16} /> Post a job</Link>
        </div>
      </header>
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/jobs/new" element={<JobForm />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs/:id/edit" element={<JobForm />} />
          <Route path="*" element={<div className="state"><h2>Page not found</h2><Link to="/" className="btn">Back to jobs</Link></div>} />
        </Routes>
      </main>
      <footer className="foot wrap">Shortlist : A Job portal using React + Spring Boot</footer>
    </>
  );
}
