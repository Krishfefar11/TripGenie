import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, Loader2, X, Sparkles, AlertCircle, FileText, Film, UploadCloud } from 'lucide-react';
import { mediaService } from '../services/api';
import { cn } from '../utils/cn';

const ACCEPTED = 'image/jpeg,image/png,image/webp,video/mp4,video/quicktime,application/pdf,text/plain';

/** Pick a representative icon for non-image files. */
function fileIcon(type) {
  if (type?.startsWith('video/')) return Film;
  if (type === 'application/pdf' || type === 'text/plain') return FileText;
  return ImagePlus;
}

const MediaUpload = ({ onContextChange }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | analyzing | done | error
  const [context, setContext] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragging, setDragging] = useState(false);

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setStatus('idle');
    setContext('');
    setErrorMsg('');
    onContextChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const analyze = async (selected) => {
    if (!selected) return;

    setFile(selected);
    setPreviewUrl(selected.type.startsWith('image/') ? URL.createObjectURL(selected) : null);
    setStatus('analyzing');
    setErrorMsg('');
    setContext('');

    try {
      const result = await mediaService.analyze(selected);
      setContext(result.context);
      setStatus('done');
      onContextChange(result.context);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Could not analyze this file. Try a different one.');
      setStatus('error');
      onContextChange('');
    }
  };

  const handleFileSelect = (e) => analyze(e.target.files?.[0]);

  // Native drag-and-drop — the dropzone is only honest if it accepts drops.
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    analyze(e.dataTransfer.files?.[0]);
  };

  const FileIcon = fileIcon(file?.type);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="label-form">
          <ImagePlus className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
          Plan from a photo, video, or doc
          <span className="ml-1 font-normal text-ink-faint">(optional)</span>
        </span>
        <span className="hidden rounded-pill border border-violet-500/18 bg-violet-500/[0.07] px-2.5 py-1 text-caption font-semibold text-violet-700 sm:inline-flex">
          Vision + OCR
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                'group relative w-full overflow-hidden rounded-md border-2 border-dashed px-6 py-8 text-center',
                'transition-all duration-base',
                dragging
                  ? 'border-violet-500 bg-violet-500/[0.07] scale-[1.01]'
                  : 'border-line-strong bg-surface-sunken hover:border-violet-400 hover:bg-violet-500/[0.035]'
              )}
            >
              <span
                className={cn(
                  'icon-box mx-auto mb-3 h-11 w-11 rounded-md transition-all duration-base',
                  dragging
                    ? 'bg-grad-violet text-white shadow-glow-violet'
                    : 'bg-violet-500/12 text-violet-600 group-hover:scale-105'
                )}
              >
                <UploadCloud className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
              </span>
              <span className="block text-small font-semibold text-ink">
                {dragging ? 'Drop it here' : 'Drop a file, or click to browse'}
              </span>
              <span className="mt-1 block text-caption text-ink-muted">
                A landmark photo, food shot, short clip, or travel PDF · max 15 MB
              </span>

              <span className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5">
                {['JPG', 'PNG', 'WEBP', 'MP4', 'PDF'].map((f) => (
                  <span key={f} className="rounded-xs bg-ink/[0.05] px-1.5 py-0.5 font-mono text-[0.625rem] font-medium text-ink-muted">
                    {f}
                  </span>
                ))}
              </span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative overflow-hidden rounded-md border p-4',
              status === 'error'
                ? 'border-error/22 bg-error/[0.04]'
                : status === 'done'
                  ? 'border-brand-500/22 bg-brand-500/[0.04]'
                  : 'border-line bg-surface-sunken'
            )}
          >
            <div className="flex items-start gap-3.5">
              {/* Thumbnail */}
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="h-16 w-16 shrink-0 rounded-sm border border-line object-cover"
                />
              ) : (
                <span className="icon-box h-16 w-16 shrink-0 rounded-sm bg-violet-500/12 text-violet-600">
                  <FileIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-small font-semibold text-ink">{file.name}</p>
                <p className="mt-0.5 text-caption text-ink-muted">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {status === 'analyzing' && (
                  <div className="mt-2.5" aria-live="polite">
                    <p className="flex items-center gap-1.5 text-caption font-semibold text-violet-700">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      Analyzing with vision + OCR…
                    </p>
                    {/* Indeterminate progress track */}
                    <div className="sheen-wrap mt-2 h-1 overflow-hidden rounded-pill bg-violet-500/14">
                      <div className="h-full w-1/3 rounded-pill bg-grad-violet" />
                    </div>
                  </div>
                )}

                {status === 'done' && (
                  <div className="mt-2.5" aria-live="polite">
                    <p className="flex items-center gap-1.5 text-caption font-bold uppercase tracking-wide text-brand-700">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Context extracted
                    </p>
                    <p className="mt-1.5 text-tiny leading-relaxed text-ink-soft">{context}</p>
                  </div>
                )}

                {status === 'error' && (
                  <p role="alert" className="mt-2 flex items-start gap-1.5 text-tiny text-error">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {errorMsg}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={reset}
                aria-label="Remove file"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xs text-ink-muted transition-colors duration-base hover:bg-ink/[0.06] hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        onChange={handleFileSelect}
        className="hidden"
        tabIndex={-1}
      />
    </div>
  );
};

export default MediaUpload;
