import { useCallback, useEffect, useRef, useState } from "react";
import { resourceApi } from "../../services/resourceApi.js";
import { toLabel } from "../../utils/format.js";

const SEARCH_DELAY_MS = 350;

// Loads a resource's rows + metadata and exposes the CRUD actions.
// The list follows the search box as you type (debounced); Enter or the button searches at once.
export function useResource(resource) {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [meta, setMeta] = useState({ title: toLabel(resource), columns: [] });
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latestRequest = useRef(0);
  const searchRef = useRef("");
  searchRef.current = search;

  const load = useCallback(async (q = "") => {
    const requestId = ++latestRequest.current; // a slower, older response must not overwrite a newer one
    setLoading(true);
    try {
      const result = await resourceApi.list(resource, q.trim());
      if (requestId !== latestRequest.current) return;
      setRecords(result.data || []);
      setTotal(result.total ?? (result.data || []).length);
      setMeta({ title: result.title, columns: result.columns || [] });
      setActiveSearch(q.trim());
      setError("");
    } catch (err) {
      if (requestId === latestRequest.current) setError(err.message);
      throw err;
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [resource]);

  // Search as the user types.
  useEffect(() => {
    const timer = setTimeout(() => load(search).catch(() => {}), search ? SEARCH_DELAY_MS : 0);
    return () => clearTimeout(timer);
  }, [search, load]);

  const reload = useCallback(() => load(searchRef.current), [load]);

  return {
    records,
    total,
    meta,
    search,
    setSearch,
    activeSearch,
    loading,
    error,
    setError,
    reload,
    searchNow: () => load(searchRef.current).catch(() => {}),
    clearSearch: () => setSearch(""),
    async save(id, body) {
      if (id) await resourceApi.update(resource, id, body);
      else await resourceApi.create(resource, body);
      await reload().catch(() => {});
    },
    async remove(id) {
      await resourceApi.remove(resource, id);
      await reload().catch(() => {});
    },
    async setStatus(id, status) {
      await resourceApi.setStatus(resource, id, status);
      await reload().catch(() => {});
    }
  };
}
