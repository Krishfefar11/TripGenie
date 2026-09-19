/**
 * Reference Document Cache
 *
 * Holds the embedded chunks of a user-uploaded reference document (a blog
 * post, PDF, or pasted text) for a short window between "upload it" and
 * "generate the itinerary that uses it" — two separate requests from the
 * client's point of view.
 *
 * Deliberately in-memory, not Mongo: this content is never meant to join
 * the shared RAG corpus (see searchHybrid's extraChunks param), so there's
 * nothing here worth persisting past the one itinerary it grounds. A entry
 * is consumed (deleted) the moment generate-itinerary reads it, and
 * anything left unclaimed expires on its own shortly after.
 */

const TTL_MS = 15 * 60 * 1000; // 15 minutes — long enough to fill out the rest of the form

const store = new Map(); // referenceId -> { chunks, expiresAt }

function put(chunks) {
  const referenceId = `ref_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  store.set(referenceId, { chunks, expiresAt: Date.now() + TTL_MS });
  return referenceId;
}

/**
 * Reads without removing — generation can fail partway (a transient LLM
 * error, say) and the user will just hit "generate" again, so the upload
 * shouldn't be burned on a request that never actually used it. Call
 * remove() once generation actually succeeds.
 */
function get(referenceId) {
  const entry = store.get(referenceId);
  if (!entry || entry.expiresAt < Date.now()) return null;
  return entry.chunks;
}

function remove(referenceId) {
  store.delete(referenceId);
}

// Sweep expired-but-never-claimed entries so an abandoned upload doesn't
// just sit in memory until the process restarts.
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of store.entries()) {
    if (entry.expiresAt < now) store.delete(id);
  }
}, 5 * 60 * 1000).unref();

module.exports = { put, get, remove };
