import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { getJobs, searchJobs } from '../api.js';
import JobRow from '../components/JobRow.jsx';

const TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

export default function Home() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [sort, setSort] = useState('newest');
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError('');
    const t = setTimeout(async () => {
      try {
        const data = query.trim() ? await searchJobs(query) : await getJobs();
        if (cancelled) return;
        setJobs(data);
        if (!query.trim()) setTotal(data.length);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300); // debounce typing
    return () => { cancelled = true; clearTimeout(t); };
  }, [query, attempt]);

  const visible = useMemo(() => {
    const list = type === 'All' ? [...jobs] : jobs.filter((j) => j.jobType === type);
    list.sort((a, b) => sort === 'title'
      ? a.title.localeCompare(b.title)
      : new Date(b.postedDate || 0) - new Date(a.postedDate || 0));
    return list;
  }, [jobs, type, sort]);

  return (
    <>
      <section className="hero">
        <h1>Find the work<br />that fits your life.</h1>
        <p className="lede">{total ?? '–'} open roles from teams that are hiring now. Search by title, company, city or skill.</p>
        <div className="search">
          <Search size={20} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try “Java”, “Kolkata” or “React”" aria-label="Search jobs" />
          {query && <button className="icon-btn" onClick={() => setQuery('')} aria-label="Clear search"><X size={18} /></button>}
        </div>
      </section>

      <section className="toolbar">
        <div className="chips" role="group" aria-label="Filter by job type">
          {TYPES.map((t) => (
            <button key={t} className={`chip ${type === t ? 'on' : ''}`} onClick={() => setType(t)} aria-pressed={type === t}>{t}</button>
          ))}
        </div>
        <label className="sort">Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </section>

      <section aria-live="polite">
        {loading && <div className="skeletons">{[0, 1, 2].map((i) => <div key={i} className="skeleton" />)}</div>}
        {!loading && error && (
          <div className="state">
            <h2>Couldn’t load jobs</h2>
            <p className="muted">{error}. Check that the Spring Boot server is running on port 8080.</p>
            <button className="btn" onClick={() => setAttempt((a) => a + 1)}>Try again</button>
          </div>
        )}
        {!loading && !error && visible.length === 0 && (
          <div className="state">
            <h2>No jobs match{query && ` “${query}”`}</h2>
            <p className="muted">Try a different keyword or job type, or post this role yourself.</p>
            <Link to="/jobs/new" className="btn primary">Post a job</Link>
          </div>
        )}
        {!loading && !error && visible.length > 0 && (
          <>
            <p className="muted small count-line">{visible.length} {visible.length === 1 ? 'job' : 'jobs'}</p>
            <div className="list">{visible.map((j) => <JobRow key={j.id} job={j} />)}</div>
          </>
        )}
      </section>
    </>
  );
}
