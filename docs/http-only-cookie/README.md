# HTTP-Only Cookie Authentication

This folder contains implementation guide for HTTP-only cookie authentication.

## Files

- [HOW_IT_WORKS.md](HOW_IT_WORKS.md) — How cookies work vs localStorage
- [IMPLEMENTATION.md](IMPLEMENTATION.md) — Step-by-step code changes
- [API_SPEC.md](API_SPEC.md) — Backend requirements
- [CSRF_PROTECTION.md](CSRF_PROTECTION.md) — CSRF mitigation strategy

## Quick Summary

| localStorage | HTTP-Only Cookie |
|--------------|-------------------|
| JS can read | JS cannot read |
| You save token | Server sets via `Set-Cookie` |
| You send header | Browser sends automatically |
| XSS vulnerable | XSS protected |
| CSRF not a risk | CSRF risk — needs protection |

## Two Auth Check Options

### Option A: Call `/me` on every page load
- Extra API call
- Always fresh user data
- More reliable

### Option B: Cache user in localStorage
- No extra API call
- Cookie handles auth
- 401 interceptor handles expiry

**Recommendation:** Option B is simpler for most cases.