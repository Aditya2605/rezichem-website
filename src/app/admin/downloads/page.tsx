'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Upload, FileText, ImageIcon, Link2 } from 'lucide-react';

type PdfAssetKey = 'company_brochure_pdf_url' | 'product_catalogue_pdf_url';
type UrlAssetKey = PdfAssetKey | 'company_logo_url' | 'social_linkedin_url' | 'social_facebook_url' | 'social_instagram_url';

const PDF_ASSET_CONFIG: Record<PdfAssetKey, { label: string; assetType: 'brochure' | 'catalogue'; help: string }> = {
  company_brochure_pdf_url: { label: 'Company Brochure PDF', assetType: 'brochure', help: 'Shown on homepage and footer.' },
  product_catalogue_pdf_url: { label: 'Product Catalogue PDF', assetType: 'catalogue', help: 'Shown on homepage and footer.' },
};

export default function AdminDownloadsPage() {
  const [urls, setUrls] = useState<Record<UrlAssetKey, string>>({
    company_brochure_pdf_url: '/downloads/company-brochure.pdf',
    product_catalogue_pdf_url: '/downloads/product-catalogue.pdf',
    company_logo_url: '',
    social_linkedin_url: '',
    social_facebook_url: '',
    social_instagram_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<UrlAssetKey | null>(null);
  const [uploadingKey, setUploadingKey] = useState<PdfAssetKey | 'company_logo_url' | null>(null);
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch('/api/site-assets')
      .then(r => r.json())
      .then(d => {
        const rows = (d.assets ?? []) as Array<{ key: UrlAssetKey; url: string }>;
        const next = { ...urls };
        for (const row of rows) {
          if (row.key in next && row.url) next[row.key] = row.url;
        }
        setUrls(next);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveUrl = async (key: UrlAssetKey, url: string) => {
    setSavingKey(key);
    setMsg('');
    setIsError(false);
    try {
      const res = await fetch('/api/site-assets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save');
      setMsg('Saved successfully.');
    } catch (err: unknown) {
      setIsError(true);
      setMsg(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSavingKey(null);
    }
  };

  const handlePdfUpload = async (key: PdfAssetKey, file: File) => {
    setUploadingKey(key);
    setMsg('');
    setIsError(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assetType', PDF_ASSET_CONFIG[key].assetType);

      const uploadRes = await fetch('/api/uploads/site-pdf/direct', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? 'Upload failed');

      const nextUrl = String(uploadData.versionedUrl || uploadData.fileUrl || '');
      if (!nextUrl) throw new Error('Upload completed but no file URL returned');

      setUrls(prev => ({ ...prev, [key]: nextUrl }));
      await saveUrl(key, nextUrl);
    } catch (err: unknown) {
      setIsError(true);
      setMsg(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleLogoUpload = async (file: File) => {
    setUploadingKey('company_logo_url');
    setMsg('');
    setIsError(false);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/uploads/logo/direct', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? 'Upload failed');

      const nextUrl = String(uploadData.versionedUrl || uploadData.fileUrl || '');
      if (!nextUrl) throw new Error('Upload completed but no file URL returned');

      setUrls(prev => ({ ...prev, company_logo_url: nextUrl }));
      await saveUrl('company_logo_url', nextUrl);
    } catch (err: unknown) {
      setIsError(true);
      setMsg(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingKey(null);
    }
  };

  const inputClass = 'w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 transition';

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-display font-bold text-neutral-800 mb-2">Downloads</h1>
      <p className="text-sm text-neutral-500 mb-6">Upload brochure/catalogue PDFs and manage download links.</p>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${isError ? 'bg-red-50 text-red-700' : 'bg-primary-50 text-primary-700'}`}>
          {msg}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-neutral-400 py-10">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading site assets...
        </div>
      ) : (
        <div className="space-y-6">
          {(Object.keys(PDF_ASSET_CONFIG) as PdfAssetKey[]).map(key => (
            <div key={key} className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary-600" />
                <h2 className="font-semibold text-neutral-800">{PDF_ASSET_CONFIG[key].label}</h2>
              </div>
              <p className="text-xs text-neutral-500 mb-4">{PDF_ASSET_CONFIG[key].help}</p>

              <div className="space-y-3">
                <input
                  type="file"
                  accept="application/pdf"
                  className={inputClass}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    handlePdfUpload(key, file);
                    e.target.value = '';
                  }}
                />
                <input
                  value={urls[key]}
                  onChange={e => setUrls(prev => ({ ...prev, [key]: e.target.value }))}
                  className={inputClass}
                  placeholder="https://..."
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={savingKey === key || uploadingKey === key || !urls[key].trim()}
                    onClick={() => saveUrl(key, urls[key])}
                  >
                    {savingKey === key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save URL
                  </button>
                  {uploadingKey === key && (
                    <span className="text-xs text-primary-600 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> Uploading PDF...
                    </span>
                  )}
                  <a href={urls[key]} target="_blank" rel="noreferrer" className="text-xs text-primary-600 hover:underline">
                    Open current file
                  </a>
                </div>
              </div>
            </div>
          ))}

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-4 h-4 text-primary-600" />
              <h2 className="font-semibold text-neutral-800">Company Logo</h2>
            </div>
            <p className="text-xs text-neutral-500 mb-4">Used in website header and footer. If empty, the current icon fallback is used.</p>

            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  handleLogoUpload(file);
                  e.target.value = '';
                }}
              />
              <input
                value={urls.company_logo_url}
                onChange={e => setUrls(prev => ({ ...prev, company_logo_url: e.target.value }))}
                className={inputClass}
                placeholder="https://..."
              />
              {urls.company_logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={urls.company_logo_url} alt="Company logo" className="h-12 w-auto object-contain rounded border border-neutral-200 p-1 bg-white" />
              )}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={savingKey === 'company_logo_url' || uploadingKey === 'company_logo_url' || !urls.company_logo_url.trim()}
                  onClick={() => saveUrl('company_logo_url', urls.company_logo_url)}
                >
                  {savingKey === 'company_logo_url' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save URL
                </button>
                {uploadingKey === 'company_logo_url' && (
                  <span className="text-xs text-primary-600 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Uploading logo...
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="w-4 h-4 text-primary-600" />
              <h2 className="font-semibold text-neutral-800">Social Media Links</h2>
            </div>
            <p className="text-xs text-neutral-500 mb-4">Footer social icons will use these links.</p>

            <div className="space-y-3">
              <input
                value={urls.social_linkedin_url}
                onChange={e => setUrls(prev => ({ ...prev, social_linkedin_url: e.target.value }))}
                className={inputClass}
                placeholder="LinkedIn URL"
              />
              <input
                value={urls.social_facebook_url}
                onChange={e => setUrls(prev => ({ ...prev, social_facebook_url: e.target.value }))}
                className={inputClass}
                placeholder="Facebook URL"
              />
              <input
                value={urls.social_instagram_url}
                onChange={e => setUrls(prev => ({ ...prev, social_instagram_url: e.target.value }))}
                className={inputClass}
                placeholder="Instagram URL"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={
                    savingKey === 'social_linkedin_url' ||
                    savingKey === 'social_facebook_url' ||
                    savingKey === 'social_instagram_url'
                  }
                  onClick={async () => {
                    await saveUrl('social_linkedin_url', urls.social_linkedin_url);
                    await saveUrl('social_facebook_url', urls.social_facebook_url);
                    await saveUrl('social_instagram_url', urls.social_instagram_url);
                  }}
                >
                  <Save className="w-4 h-4" />
                  Save Social Links
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
