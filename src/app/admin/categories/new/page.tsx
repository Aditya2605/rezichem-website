'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function NewCategoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', slug: '', description: '', image_url: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' ? { slug: slugify(value) } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setMsg('Category saved!');
      setTimeout(() => router.push('/admin/categories'), 1200);
    } catch {
      setMsg('Error saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!form.slug.trim()) {
      setUploadError('Enter category name/slug before uploading image.');
      e.target.value = '';
      return;
    }

    setUploadError('');
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', form.slug);

      const res = await fetch('/api/uploads/category-image/direct', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Image upload failed');

      const nextUrl = String(data.versionedUrl || data.fileUrl || '');
      if (!nextUrl) throw new Error('Upload completed but no file URL returned');
      setForm(prev => ({ ...prev, image_url: nextUrl }));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const inputClass = 'w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 transition';
  const labelClass = 'block text-xs font-semibold text-neutral-600 mb-1.5';

  return (
    <div className="p-8 max-w-lg">
      <Link href="/admin/categories" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Categories
      </Link>
      <h1 className="text-2xl font-display font-bold text-neutral-800 mb-6">Add Category</h1>

      {msg && <div className="mb-4 p-3 bg-primary-50 text-primary-700 rounded-lg text-sm">{msg}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Category Name *</label>
          <input name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="e.g. Antibacterial" />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} placeholder="antibacterial" />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} placeholder="Brief description of this category..." />
        </div>
        <div>
          <label className={labelClass}>Category Image</label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleImageUpload}
              className={inputClass}
            />
            {uploadingImage && (
              <p className="text-xs text-primary-600 flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading image...
              </p>
            )}
            {uploadError && (
              <p className="text-xs text-red-600">{uploadError}</p>
            )}
            <input name="image_url" value={form.image_url} onChange={handleChange} className={inputClass} placeholder="Or paste image URL" />
            {form.image_url && (
              <div className="w-44 h-28 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="Category preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving || uploadingImage} className="btn-primary">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Category'}
          </button>
          <Link href="/admin/categories" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
