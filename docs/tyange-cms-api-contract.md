# tyange-cms-api Contract (Blog Integration)

Last updated: 2026-03-05
Scope: `/Users/meatbox/dev/its_mine/uniun` blog frontend

## 1) Base URL
- Local: `http://localhost:8080`
- Production candidate: `https://tyange.com/api/cms`

## 2) Public endpoints to use in blog

### A. Post list (published only)
- Method: `GET`
- Path: `/posts/search-with-tags`
- Query:
  - `include` (optional, string): include posts having this tag
  - `exclude` (optional, string): exclude posts having this tag
- Auth: none
- Response shape:
```json
{
  "status": true,
  "data": {
    "posts": [
      {
        "post_id": "string",
        "title": "string",
        "description": "string",
        "published_at": "string",
        "tags": [{ "tag": "string", "category": "string" }],
        "status": "published"
      }
    ]
  },
  "message": null
}
```

### B. Post detail
- Method: `GET`
- Path: `/post/:post_id`
- Auth: none
- Response shape:
```json
{
  "post_id": "string",
  "title": "string",
  "description": "string",
  "published_at": "string",
  "tags": [{ "tag": "string", "category": "string" }],
  "content": "string",
  "status": "published"
}
```

### C. Tag count (optional, sidebar/filter)
- Method: `GET`
- Path: `/tags`
- Query:
  - `category` (optional, string)
- Auth: none
- Response shape:
```json
{
  "status": true,
  "data": [{ "tag": "string", "count": 10 }],
  "message": null
}
```

### D. Tags grouped by category (optional)
- Method: `GET`
- Path: `/tags-with-category`
- Auth: none
- Response shape:
```json
{
  "status": true,
  "data": [{ "category": "string", "tags": ["string"] }],
  "message": null
}
```

## 3) Auth boundary
- Blog read pages use **public GET** endpoints only (no token required).
- CMS write/admin endpoints (`/post/upload`, `/post/update/:post_id`, `/admin/posts` etc.) require `Authorization` header.
- For this blog integration phase, **do not** expose access token or API key in browser.

## 4) Date/time contract
- API currently stores `published_at` as string.
- Frontend canonical parse rule:
  - Accept ISO-8601 string first (`YYYY-MM-DDTHH:mm:ssZ` or offset).
  - Fallback: treat as plain local datetime string.
- Backend recommendation (for future stability): standardize `published_at` to ISO-8601 UTC.

## 5) Error handling contract (frontend)
- Network/5xx: show retry UI.
- 404 on `/post/:post_id`: render `notFound()` page.
- `status=true` with empty `data.posts`: show empty state.

## 6) Known issue found in current API code
- `GET /posts` currently builds SQL with `AND p.status != 'draft'` even when no `writer_id` is provided.
- This can produce invalid SQL (`AND` without `WHERE`).
- Decision for blog integration:
  - Use `/posts/search-with-tags` as canonical list endpoint.
  - Avoid `/posts` until backend query is fixed.

## 7) Final decisions to confirm with backend owner
- [ ] Production base URL is fixed to `https://tyange.com/api/cms`.
- [ ] `published_at` output format is fixed (ISO-8601 recommended).
- [ ] `/post/:post_id` must not return `draft` posts publicly.
- [ ] CORS includes the final blog domain.

## 8) Frontend TypeScript interfaces (copy target)
```ts
export type TagWithCategory = {
  tag: string;
  category: string;
};

export type PostItem = {
  post_id: string;
  title: string;
  description: string;
  published_at: string;
  tags: TagWithCategory[];
  status: string;
};

export type PostDetail = PostItem & {
  content: string;
};

export type CustomResponse<T> = {
  status: boolean;
  data: T | null;
  message: string | null;
};
```
