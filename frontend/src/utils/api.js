export async function apiFetch(path, opts = {}) {
  const base = 'http://127.0.0.1:5000';
  const token = localStorage.getItem('jwt');


  // ✅ Define headers first
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Fire the request
  const res = await fetch(base + path, { ...opts, headers });

  // If unauthorized, or any other non-OK response → throw
  if (!res.ok) {
    let errMsg;
    try {
      const errBody = await res.json();
      errMsg = errBody.error || errBody.message;
    } catch {
      errMsg = res.statusText;
    }
    throw new Error(errMsg || `HTTP ${res.status}`);
  }

  return res.json();
}
