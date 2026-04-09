# Owner Approve User Flow — Implementation Plan

## Tổng quan

Flow cho phép owner duyệt (approve/reject) tài khoản trước khi user có thể
truy cập dashboard. Backend đã gần hoàn chỉnh; phần việc chính nằm ở frontend.

---

## Kiến trúc luồng

```
[User đăng ký /register]
        ↓
  status = "pending"
  notify owner: email + Telegram (nút Approve / Reject)
        ↓
[Owner nhấn Approve]
  GET /api/auth/approve?token=...&action=approve
  status → "approved", approval_token → null
  notify_user_approved() → email cho user
        ↓
[/pending page poll /api/proxy/auth/status mỗi 10s]
  phát hiện status = "approved"
  gọi update() → force refresh JWT
        ↓
[middleware.ts cho qua → redirect /]
```

---

## Các file thay đổi

### vn-stock-api

| File | Thay đổi |
|------|----------|
| `app/routes/auth_web.py` | [API-1] Block rejected ở login; [API-2] Secure status endpoint |
| `.env.example` | [API-3] Thêm các biến notification còn thiếu |

### vn-stock-dashboard

| File | Thay đổi |
|------|----------|
| `src/middleware.ts` | [FE-1] NEW — bảo vệ toàn bộ dashboard routes |
| `src/lib/auth.ts` | [FE-2] EDIT — jwt callback xử lý `trigger=update` |
| `src/app/api/proxy/auth/status/route.ts` | [FE-3] NEW — server-side proxy tới FastAPI |
| `src/app/pending/page.tsx` | [FE-4] FIX — xóa stale session bug, dùng `update()` |

---

## Chi tiết từng task

### [API-1] Block `rejected` users tại login

**File:** `app/routes/auth_web.py` — hàm `login()`

Thêm sau bước verify password, trước khi tạo token:

```python
if user.status == UserStatus.rejected:
    raise HTTPException(status_code=403, detail="Tài khoản đã bị từ chối")
```

> `pending` KHÔNG block ở đây — để NextAuth tạo session rồi middleware
> redirect sang /pending. UX tốt hơn là báo lỗi đỏ trên form login.

---

### [API-2] Secure `GET /api/auth/status`

**File:** `app/routes/auth_web.py` — hàm `get_status()`

```python
# TRƯỚC — info leak, ai cũng check được
async def get_status(email: str, db: AsyncSession = Depends(get_db)):
    user = await db.scalar(select(User).where(User.email == email))

# SAU — phải có Bearer token, lookup theo user_id
async def get_status(
    user_id: str = Depends(get_current_web_user_id),
    db: AsyncSession = Depends(get_db),
) -> StatusResponse:
    user = await db.scalar(select(User).where(User.id == uuid.UUID(user_id)))
```

---

### [API-3] `.env.example` — thêm biến notification

```bash
RESEND_API_KEY=           # để trống khi test local — bị skip tự động
RESEND_DOMAIN=yourdomain.com
OWNER_EMAIL=owner@example.com
OWNER_CHAT_ID=            # Telegram chat_id của owner
APP_BASE_URL=http://localhost:8000
DASHBOARD_URL=http://localhost:3000
ACCESS_TOKEN_EXPIRE_HOURS=24
```

---

### [FE-3] Proxy route `/api/proxy/auth/status`

**File:** `src/app/api/proxy/auth/status/route.ts` (NEW)

Server-side proxy — forward request kèm Bearer token tới FastAPI:

```typescript
export const GET = auth(async (req) => {
  const accessToken = req.auth?.user?.accessToken;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${API_URL}/api/auth/status`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data: unknown = await res.json();
  return NextResponse.json(data, { status: res.status });
});
```

---

### [FE-2] Fix JWT callback — `trigger=update`

**File:** `src/lib/auth.ts`

```typescript
async jwt({ token, user, trigger }) {
  if (user) { /* gán lần đầu login */ }

  if (trigger === "update" && token["accessToken"]) {
    // Re-fetch status mới nhất từ backend
    const res = await fetch(`${API_URL}/api/auth/status`, {
      headers: { Authorization: `Bearer ${token["accessToken"]}` },
    });
    if (res.ok) {
      const data = await res.json() as { status: string };
      token["status"] = data.status;
    }
  }
  return token;
}
```

---

### [FE-1] `src/middleware.ts`

**File:** `src/middleware.ts` (NEW)

```typescript
export default auth((req) => {
  // Public → redirect nếu đã login
  // /pending, /rejected → chỉ logged-in
  // /admin/* → chỉ role=owner + approved
  // Dashboard → phải approved
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

---

### [FE-4] Fix `/pending` page

**File:** `src/app/pending/page.tsx`

```typescript
// Thay getSession() bằng poll proxy + update()
const { data: session, update } = useSession();

useEffect(() => {
  const interval = setInterval(async () => {
    const res = await fetch("/api/proxy/auth/status");
    const data = await res.json() as { status: string };

    if (data.status === "approved") {
      await update();
      router.push("/");
    } else if (data.status === "rejected") {
      await update();
      router.push("/rejected");
    }
  }, 10_000);
  return () => clearInterval(interval);
}, [router, update]);
```

---

## Local Testing Guide

### Setup

```bash
# Terminal 1
cd vn-stock-api && make dev   # → http://localhost:8000

# Terminal 2
cd vn-stock-dashboard && npm run dev  # → http://localhost:3000
```

### Test checklist

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Truy cập `/watchlist` không login | Redirect → `/login` |
| 2 | Đăng ký tài khoản mới | Redirect → `/pending` |
| 3 | Login bằng user pending → truy cập `/watchlist` | Redirect → `/pending` |
| 4 | Swagger `POST /api/auth/admin/set-status` action=approve | 200 OK |
| 5 | Chờ ≤10s trên `/pending` | Tự redirect → `/` |
| 6 | Đăng ký user khác → admin reject | `/pending` → redirect `/rejected` |
| 7 | Login user rejected | Nhận lỗi 403 trên form login |
| 8 | `npm run typecheck` | 0 errors |

### Approve thủ công (không cần email/Telegram)

```bash
curl -X POST http://localhost:8000/api/auth/admin/set-status \
  -H "Content-Type: application/json" \
  -H "X-Bot-Secret: <BOT_SECRET>" \
  -d '{"email": "user@example.com", "action": "approve"}'
```

Hoặc dùng Swagger UI tại `http://localhost:8000/docs`.

---

## Thứ tự implement

| # | Task | Estimate | Dependency |
|---|------|----------|------------|
| 1 | API-1: Block rejected ở login | 15 phút | — |
| 2 | API-2: Secure status endpoint | 20 phút | — |
| 3 | API-3: Update .env.example | 5 phút | — |
| 4 | FE-3: Proxy route | 20 phút | API-2 |
| 5 | FE-2: JWT trigger=update | 20 phút | FE-3 |
| 6 | FE-1: middleware.ts | 30 phút | FE-2 |
| 7 | FE-4: Fix /pending page | 20 phút | FE-3 |
| 8 | Typecheck + test | 20 phút | tất cả |

**Tổng: ~2.5 giờ**

---

## Rủi ro

| Rủi ro | Xử lý |
|--------|-------|
| NextAuth v5 middleware type khác v4 | Đọc `node_modules/next-auth/dist/docs/` trước |
| `update()` xong nhưng middleware đọc JWT cũ | Gọi thêm `router.refresh()` sau `update()` |
| FastAPI `accessToken` expire trước khi được approve (24h) | Acceptable — user login lại |
| Swagger không có X-Bot-Secret field mặc định | Dùng "Authorize" button hoặc curl |
