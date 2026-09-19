import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Loader2, X, Sparkles, AlertCircle, UploadCloud } from 'lucide-react';
import { referenceDocService } from '../services/api';
import { cn } from '../utils/cn';

const ACCEPTED = 'text/plain,application/pdf';

/**
 * Lets a user attach their own reference content (a blog post export, a
 * travel PDF, notes) to ground THIS itinerary specifically. Uploads
 * immediately on selection — same pattern as MediaUpload — and hands the
 * parent a referenceId to include in the final generate-itinerary call.
 * The document itself is never added to the shared RAG corpus: it's
 * chunked and embedded server-side, held just long enough to be searched
 * alongside the seeded guides for this one request, then discarded.
 */
const ReferenceDocUpload = ({ onReferenceChange }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | analyzing | done | error
  const [chunkCount, setChunkCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragging, setDragging] = useState(false);

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setChunkCount(0);
    setErrorMsg('');
    onReferenceChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const analyze = async (selected) => {
    if (!selected) return;

    setFile(selected);
    setStatus('analyzing');
    setErrorMsg('');

    try {
      const result = await referenceDocService.analyze(selected);
      setChunkCount(result.chunkCount);
      setStatus('done');
      onReferenceChange(result.referenceId);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Could not read this file. Try a different one.');
      setStatus('error');
      onReferenceChange(null);
    }
  };

  const handleFileSelect = (e) => analyze(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    analyze(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="label-form">
          <BookOpen className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />
          Ground this trip in your own writing
          <span className="ml-1 font-normal text-ink-faint">(optional)</span>
        </span>
        <span className="hidden rounded-pill border border-sky-500/18 bg-sky-500/[0.07] px-2.5 py-1 text-caption font-semibold text-sky-700 sm:inline-flex">
          Retrieval
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
                  ? 'border-sky-500 bg-sky-500/[0.07] scale-[1.01]'
                  : 'border-line-strong bg-surface-sunken hover:border-sky-400 hover:bg-sky-500/[0.035]'
              )}
            >
              <span
                className={cn(
                  'icon-box mx-auto mb-3 h-11 w-11 rounded-md transition-all duration-base',
                  dragging
                    ? 'bg-grad-sky text-white shadow-lg'
                    : 'bg-sky-500/12 text-sky-600 group-hover:scale-105'
                )}
              >
                <UploadCloud className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
              </span>
              <span className="block text-small font-semibold text-ink">
                {dragging ? 'Drop it here' : 'Drop a blog, guide, or notes — or click to browse'}
              </span>
              <span className="mt-1 block text-caption text-ink-muted">
                A blog post export, travel PDF, or plain text · max 10 MB
              </span>

              <span className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5">
                {['TXT', 'PDF'].map((f) => (
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
              <span className="icon-box h-16 w-16 shrink-0 rounded-sm bg-sky-500/12 text-sky-600">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-small font-semibold text-ink">{file.name}</p>
                <p className="mt-0.5 text-caption text-ink-muted">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {status === 'analyzing' && (
                  <div className="mt-2.5" aria-live="polite">
                    <p className="flex items-center gap-1.5 text-caption font-semibold text-sky-700">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      Chunking and embedding…
                    </p>
                    <div className="sheen-wrap mt-2 h-1 overflow-hidden rounded-pill bg-sky-500/14">
                      <div className="h-full w-1/3 rounded-pill bg-grad-sky" />
                    </div>
                  </div>
                )}

                {status === 'done' && (
                  <div className="mt-2.5" aria-live="polite">
                    <p className="flex items-center gap-1.5 text-caption font-bold uppercase tracking-wide text-brand-700">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Ready to search
                    </p>
                    <p className="mt-1.5 text-tiny leading-relaxed text-ink-soft">
                      {chunkCount} chunk{chunkCount === 1 ? '' : 's'} extracted — searched alongside
                      TripGenie's built-in guides, not stored afterward.
                    </p>
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

export default ReferenceDocUpload;
