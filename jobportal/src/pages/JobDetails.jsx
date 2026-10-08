import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, Briefcase, MapPin, Pencil, Trash2, Wallet } from 'lucide-react';
import { deleteJob, getJob } from '../api.js';
import { useApp } from '../context.jsx';
import { ago, hue } from '../components/JobRow.jsx';

export default function JobDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { saved, toggleSaved, notify } = useApp();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { getJob(id).then(setJob).catch((e) => setError(e.message)); }, [id]);

  async function remove() {
    setBusy(true);
    try {
      await deleteJob(id);
      notify('Job deleted');
      nav('/');
    } catch (e) {
      notify(e.message, 'err');
      setBusy(false); setConfirming(false);
    }
  }

  if (error) return <div className="state"><h2>Job not found</h2><p className="muted">{error}</p><Link to="/" className="btn">Back to jobs</Link></div>;
  if (!job) return <div className="skeletons"><div className="skeleton tall" /></div>;
  const isSaved = saved.includes(job.id);

  return (
    <section className="page">
      <Link to="/" className="back"><ArrowLeft size={16} /> All jobs</Link>
      <div className="detail">
        <div>
          <div className="logo big" style={{ '--h': hue(job.company) }}>{job.company?.[0]?.toUpperCase()}</div>
          <h1 className="h-page">{job.title}</h1>
          <p className="muted">{job.company} · Posted {ago(job.postedDate).toLowerCase()}</p>
          <div className="tags spaced">{job.skills.map((s) => <span key={s} className="tag">{s}</span>)}</div>
          <h2 className="h-sec">About the role</h2>
          <div className="prose">{job.description?.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>
        </div>

        <aside className="panel">
          <dl>
            <div><dt><MapPin size={15} /> Location</dt><dd>{job.location}</dd></div>
            <div><dt><Briefcase size={15} /> Type</dt><dd>{job.jobType}</dd></div>
            <div><dt><Wallet size={15} /> Salary</dt><dd>{job.salary || 'Not disclosed'}</dd></div>
            <div><dt>Experience</dt><dd>{job.experience || 'Any'}</dd></div>
          </dl>
          {job.contactEmail && <a className="btn primary block" href={`mailto:${job.contactEmail}?subject=${encodeURIComponent('Application: ' + job.title)}`}>Apply by email</a>}
          <button className="btn block" onClick={() => toggleSaved(job.id)}><Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved' : 'Save job'}</button>
          <div className="split">
            <Link to={`/jobs/${job.id}/edit`} className="btn"><Pencil size={15} /> Edit</Link>
            <button className="btn danger" onClick={() => setConfirming(true)}><Trash2 size={15} /> Delete</button>
          </div>
        </aside>
      </div>

      {confirming && (
        <div className="overlay" onClick={() => !busy && setConfirming(false)}>
          <div className="dialog" role="alertdialog" aria-labelledby="dlg-t" onClick={(e) => e.stopPropagation()}>
            <h2 id="dlg-t">Delete “{job.title}”?</h2>
            <p className="muted">This removes the listing for everyone. You can’t undo it.</p>
            <div className="split">
              <button className="btn" onClick={() => setConfirming(false)} disabled={busy}>Keep job</button>
              <button className="btn danger solid" onClick={remove} disabled={busy}>{busy ? 'Deleting…' : 'Delete job'}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
