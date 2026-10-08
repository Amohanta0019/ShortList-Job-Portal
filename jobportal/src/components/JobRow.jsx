import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Pencil, Wallet } from 'lucide-react';
import { useApp } from '../context.jsx';

const HUES = [222, 168, 24, 280, 340, 196];
export const hue = (s) => HUES[[...String(s ?? '')].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];

export function ago(date) {
  if (!date) return '';
  const d = Math.floor((Date.now() - new Date(date)) / 864e5);
  if (d <= 0) return 'Today';
  if (d === 1) return 'Yesterday';
  return d < 30 ? `${d} days ago` : new Date(date).toLocaleDateString();
}

export default function JobRow({ job }) {
  const { saved, toggleSaved } = useApp();
  const isSaved = saved.includes(job.id);
  return (
    <article className="row">
      <div className="logo" style={{ '--h': hue(job.company) }}>{job.company?.[0]?.toUpperCase()}</div>
      <div className="row-main">
        <h3><Link to={`/jobs/${job.id}`}>{job.title}</Link></h3>
        <p className="muted">{job.company}</p>
        <div className="meta">
          <span><MapPin size={14} /> {job.location}</span>
          {job.salary && <span><Wallet size={14} /> {job.salary}</span>}
          <span className={`pill t-${(job.jobType || '').toLowerCase().replace(/\W/g, '')}`}>{job.jobType}</span>
        </div>
        <div className="tags">{job.skills.slice(0, 4).map((s) => <span key={s} className="tag">{s}</span>)}</div>
      </div>
      <div className="row-side">
        <span className="muted small">{ago(job.postedDate)}</span>
        <div className="icons">
          <Link to={`/jobs/${job.id}/edit`} className="icon-btn" aria-label={`Edit ${job.title}`}><Pencil size={17} /></Link>
          <button className={`icon-btn ${isSaved ? 'on' : ''}`} onClick={() => toggleSaved(job.id)} aria-pressed={isSaved} aria-label={isSaved ? 'Remove from saved' : 'Save job'}>
            <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
}
