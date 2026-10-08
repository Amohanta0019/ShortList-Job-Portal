import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createJob, getJob, updateJob } from '../api.js';
import { useApp } from '../context.jsx';

const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const EMPTY = { title: '', company: '', location: '', jobType: 'Full-time', experience: '', salary: '', skills: '', contactEmail: '', description: '' };

// Defined outside JobForm so inputs keep focus while typing.
function Field({ k, label, hint, form, set, errors, ...p }) {
  return (
    <label className={`field ${errors[k] ? 'bad' : ''}`}>
      <span>{label}</span>
      <input value={form[k]} onChange={set(k)} {...p} />
      {errors[k] ? <em>{errors[k]}</em> : hint && <small>{hint}</small>}
    </label>
  );
}

export default function JobForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const nav = useNavigate();
  const { notify } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!editing) return;
    getJob(id)
      .then((j) => setForm({ ...EMPTY, ...j, skills: j.skills.join(', ') }))
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Enter a job title.';
    if (!form.company.trim()) e.company = 'Enter the company name.';
    if (!form.location.trim()) e.location = 'Enter a location, or “Remote”.';
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) e.contactEmail = 'Enter a valid email address.';
    if (form.description.trim().length < 30) e.description = 'Describe the role in at least 30 characters.';
    return e;
  }

  async function submit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    const payload = { ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) };
    try {
      if (editing) { await updateJob(id, payload); notify('Changes saved'); nav(`/jobs/${id}`); }
      else { const j = await createJob(payload); notify('Job posted'); nav(`/jobs/${j.id}`); }
    } catch (err) {
      notify(err.message, 'err');
      setSaving(false);
    }
  }

  if (loadError) return <div className="state"><h2>Couldn’t open this job</h2><p className="muted">{loadError}</p><Link to="/" className="btn">Back to jobs</Link></div>;
  if (loading) return <div className="skeletons"><div className="skeleton tall" /></div>;


  return (
    <section className="page narrow">
      <Link to={editing ? `/jobs/${id}` : '/'} className="back"><ArrowLeft size={16} /> Cancel</Link>
      <h1 className="h-page">{editing ? 'Edit job' : 'Post a job'}</h1>
      <form onSubmit={submit} noValidate className="form">
        <Field form={form} set={set} errors={errors} k="title" label="Job title" placeholder="e.g. Senior Java Developer" />
        <div className="grid2">
          <Field form={form} set={set} errors={errors} k="company" label="Company" />
          <Field form={form} set={set} errors={errors} k="location" label="Location" placeholder="City or Remote" />
        </div>
        <div className="grid2">
          <label className="field"><span>Job type</span>
            <select value={form.jobType} onChange={set('jobType')}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </label>
          <Field form={form} set={set} errors={errors} k="experience" label="Experience" placeholder="e.g. 3+ years" />
        </div>
        <div className="grid2">
          <Field form={form} set={set} errors={errors} k="salary" label="Salary" placeholder="e.g. ₹12–18 LPA" />
          <Field form={form} set={set} errors={errors} k="contactEmail" label="Application email" type="email" />
        </div>
        <Field form={form} set={set} errors={errors} k="skills" label="Skills" placeholder="Java, Spring Boot, SQL" hint="Separate skills with commas." />
        <label className={`field ${errors.description ? 'bad' : ''}`}>
          <span>Description</span>
          <textarea rows={8} value={form.description} onChange={set('description')} placeholder="What will this person do? What do they need to know?" />
          {errors.description && <em>{errors.description}</em>}
        </label>
        <div className="actions">
          <button className="btn primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Post job'}</button>
          <Link to={editing ? `/jobs/${id}` : '/'} className="btn">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
