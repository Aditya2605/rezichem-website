'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Category } from '@/types';

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const DOSAGE_FORMS = [
  'Tablet', 'Capsule', 'Softgel Capsule', 'Syrup', 'Dry Syrup', 'Suspension',
  'Injection', 'Cream', 'Ointment', 'Gel', 'Drops', 'Sachet', 'Powder',
  'Oil', 'Mouthwash', 'Shampoo', 'Hand Sanitizer', 'Face Wash',
  'Gel Suspension', 'Effervescent Tablet',
];

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '', slug: '', category_id: '', composition: '',
    dosage_form: '', description: '', image_url: '',
    is_featured: false, is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');
  const [isError, setIsError] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch(`/api/products/${params.id}`).then(r => r.json()),
    ]).then(([catData, prodData]) => {
      setCategories(catData.categories ?? []);
      const p = prodData.product;
      if (p) {
        setForm({
          name: p.name ?? '',
          slug: p.slug ?? '',
          category_id: String(p.category_id ?? ''),
          composition: p.composition ?? '',
          dosage_form: p.dosage_form ?? '',
          description: p.description ?? '',
          image_url: p.image_url ?? '',
          is_featured: p.is_featured ?? false,
          is_active: p.is_active ?? true,
        });
      }
    }).finally(() => setLoading(false));
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' && !prev.slug ? { slug: slugify(value) } : {}),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!form.slug.trim()) {
      setUploadError('Enter product slug before uploading image.');
      e.target.value = '';
      return;
    }

    setUploadError('');
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', form.slug);
      if (form.category_id) formData.append('categoryId', form.category_id);

      const uploadRes = await fetch('/api/uploads/product-image/direct', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? 'Image upload failed');

      const nextUrl = String(uploadData.versionedUrl || uploadData.fileUrl || '');
      if (!nextUrl) throw new Error('Upload completed but no file URL returned');
      setForm(prev => ({ ...prev, image_url: nextUrl }));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setIsError(false);
    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, category_id: parseInt(form.category_id) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save');
      setMsg('Product updated successfully!');
      setTimeout(() => router.push('/admin/products'), 1200);
    } catch (err: unknown) {
      setIsError(true);
      setMsg(err instanceof Error ? err.message : 'Error updating product.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 transition';
  const labelClass = 'block text-xs font-semibold text-neutral-600 mb-1.5';

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-2 text-neutral-400">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading product...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/admin/products" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>
      <h1 className="text-2xl font-display font-bold text-neutral-800 mb-6">Edit Product</h1>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${isError ? 'bg-red-50 text-red-700' : 'bg-primary-50 text-primary-700'}`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Product Name *</label>
            <input name="name" required value={form.name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Category *</label>
          <select name="category_id" required value={form.category_id} onChange={handleChange} className={inputClass}>
            <option value="">Select a category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Composition</label>
          <input name="composition" value={form.composition} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Dosage Form</label>
          <select name="dosage_form" value={form.dosage_form} onChange={handleChange} className={inputClass}>
            <option value="">Select dosage form</option>
            {DOSAGE_FORMS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Product Image</label>
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
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className={inputClass}
              placeholder="Or paste image URL"
            />
            {form.image_url && (
              <div className="w-44 h-28 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="Product preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 accent-primary-600" />
            <span className="text-sm text-neutral-700">Show on homepage as featured product</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 accent-primary-600" />
            <span className="text-sm text-neutral-700">Active (visible on website)</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving || uploadingImage} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/products" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
