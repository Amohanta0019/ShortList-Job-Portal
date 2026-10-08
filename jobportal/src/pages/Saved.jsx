import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../api.js';
import { useApp } from '../context.jsx';
import JobRow from '../components/JobRow.jsx';

export default function Saved() {
  const { saved } = useApp();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getJobs().then(setJobs).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const list = jobs.filter((j) => saved.includes(j.id));
  return (
    <section className="page">
      <h1 className="h-page">Saved jobs</h1>
      {loading && <div className="skeletons"><div className="skeleton" /></div>}
      {error && <div className="state"><h2>Couldn’t load jobs</h2><p className="muted">{error}</p></div>}
      {!loading && !error && list.length === 0 && (
        <div className="state">
          <h2>Nothing saved yet</h2>
          <p className="muted">Tap the bookmark on any job to keep it here for later.</p>
          <Link to="/" className="btn primary">Browse jobs</Link>
        </div>
      )}
      <div className="list">{list.map((j) => <JobRow key={j.id} job={j} />)}</div>
    </section>
  );
}
