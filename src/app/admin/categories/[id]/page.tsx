'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm]       = useState({ name: '', slug: '', description: '', image_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch(`/api/categories/${params.id}`)
      .then(r => r.json())
      .then(d => {
        const c = d.category;
        if (c) {
          setForm({
            name: c.name ?? '',
            slug: c.slug ?? '',
            description: c.description ?? '',
            image_url: c.image_url ?? '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && !prev.slug ? { slug: slugify(value) } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setIsError(false);
    try {
      const res = await fetch(`/api/categories/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save');
      setMsg('Category updated successfully!');
      setTimeout(() => router.push('/admin/categories'), 1200);
    } catch (err: unknown) {
      setIsError(true);
      setMsg(err instanceof Error ? err.message : 'Error updating category.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 transition';
  const labelClass = 'block text-xs font-semibold text-neutral-600 mb-1.5';

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-2 text-neutral-400">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading category...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl">
      <Link href="/admin/categories" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Categories
      </Link>
      <h1 className="text-2xl font-display font-bold text-neutral-800 mb-6">Edit Category</h1>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${isError ? 'bg-red-50 text-red-700' : 'bg-primary-50 text-primary-700'}`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>Category Name *</label>
          <input name="name" required value={form.name} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Slug *</label>
          <input name="slug" required value={form.slug} onChange={handleChange} className={inputClass} />
          <p className="text-xs text-neutral-400 mt-1">
            ⚠️ Changing the slug will break existing links to this category.
          </p>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Image URL</label>
          <input name="image_url" value={form.image_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/categories" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
