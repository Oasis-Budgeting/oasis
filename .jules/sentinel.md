## 2025-03-03 - SSRF in AI Routes `base_url` parameter
**Vulnerability:** A Server-Side Request Forgery (SSRF) vulnerability existed in `api/src/routes/ai.js`. The `base_url` parameter was provided by the user and directly concatenated into `fetch()` calls without any URL validation.
**Learning:** By allowing user-provided base URLs to be passed directly to fetch requests originating from the backend server, attackers could query internal systems, databases, or cloud metadata endpoints.
**Prevention:**
1. Always parse user-supplied URLs using the built-in `URL` class and enforce allowed schemes (`http:`, `https:`).
2. Implement a blocklist against known dangerous addresses like cloud metadata (`169.254.169.254`, `metadata.google.internal`) and local escape endpoints (`0.0.0.0`).
3. Block common internal service ports (e.g. `6379`, `3306`) to prevent internal port scanning.
4. **Crucially**, disable redirects in `fetch` (`{ redirect: 'error' }`) to prevent attackers from bypassing hostname blocklists via an external HTTP 302 redirect back into the internal network.
