# ✅ Task Breakdown: RS Composite Score

> **Dự án:** vn-stock-dashboard + vn-stock-api
> **Ngày tạo:** 2026-04-15
> **Dựa trên:** rs-composite-score-concept.md

---

## Mục tiêu

Implement RS Composite Score (0–100) cho Vietnamese stock market, bao gồm 4 components (RS Rating 40%, RS Line Trending 20%, RS Near High 20%, RS Days 20%). User có thể xem score tổng + breakdown từng component trên dashboard, scan top cổ phiếu theo score, và hiểu ý nghĩa từng thành phần.

---

## Phân tích hiện trạng

### Backend (`vn-stock-api`)
- **Đã có:** `fireant.get_history(symbol, period)` trả về DataFrame [open, high, low, close, volume] — đây là data source chính
- **Đã có:** `analysis.py` với RSI/EMA/MACD — pattern để follow khi thêm RS service mới
- **Đã có:** Cache layer (`cache.py`) với TTL configurable
- **Chưa có:** Bất kỳ code nào liên quan RS Line, RS Rating, hay percentile ranking

### Frontend (`vn-stock-dashboard`)
- **Đã có:** `SignalBadge` (BUY/SELL/HOLD), `RsiGauge` (linear bar + semicircle) — pattern UI cho score display
- **Đã có:** SWR hooks pattern (`useSignal`, `usePrice`) — follow khi tạo `useRSScore`
- **Đã có:** CSS variables cho stock semantic colors (`--bull`, `--bear`, `--signal-hold`)
- **Chưa có:** Component hiển thị multi-component score breakdown

### Data gaps
- **VN-Index history:** `fireant.get_history()` hiện chỉ fetch cổ phiếu đơn lẻ. Cần fetch thêm VN-Index (symbol: `VNINDEX`) để tính RS Line
- **Universe data:** Cần fetch return của toàn bộ VN100 để tính percentile ranking cho RS Rating
- **Lookback dài:** RS Rating cần 252 phiên (~1 năm). `get_history(period="1y")` đã support nhưng cần verify data quality

---

## Tasks

### 🔴 P1 — Must have (MVP: score tính đúng + hiển thị cơ bản)

#### Backend

- [ ] **B1. Thêm RS config parameters vào `config.py`** — ⏱ 1h
  - **Default values (dùng khi user không truyền param):**
    - `RS_LOOKBACK_DEFAULT = 252` (phiên, ~1 năm)
    - `RS_SLOPE_WINDOW_DEFAULT = 10` (phiên, ~2 tuần)
    - `RS_CORRECTION_WINDOW_DEFAULT = 60` (phiên, ~3 tháng)
  - **Preset profiles (shortcut cho user chọn nhanh):**
    ```python
    RS_PRESETS = {
      "conservative": { "lookback": 252, "slope_window": 10, "correction_window": 60 },
      "balanced":     { "lookback": 126, "slope_window": 10, "correction_window": 45 },
      "aggressive":   { "lookback": 63,  "slope_window": 5,  "correction_window": 30 },
    }
    ```
  - **Validation bounds (ngăn user truyền giá trị vô nghĩa):**
    - `RS_LOOKBACK_MIN = 42` (~2 tháng), `RS_LOOKBACK_MAX = 504` (~2 năm)
    - `RS_SLOPE_WINDOW_MIN = 3`, `RS_SLOPE_WINDOW_MAX = 30`
    - `RS_CORRECTION_WINDOW_MIN = 20`, `RS_CORRECTION_WINDOW_MAX = 126`
  - **Derived constants:**
    - `RS_MIN_HISTORY_DAYS` = computed từ `lookback + 30` (không hardcode)
  - `RS_UNIVERSE_SYMBOLS` = list VN100 symbols (hoặc reference constant)
  - `RS_CACHE_TTL = 300` (5 phút — tương đương signals cache)
  - **Lý do 3 params đều configurable:** slope_window ngắn (5) bắt momentum sớm hơn nhưng noisy; correction_window ngắn (30) focus vào đợt điều chỉnh gần nhất thay vì trung bình 3 tháng. Trader aggressive muốn cả hai ngắn hơn.

- [ ] **B2. Extend `fireant.py` — thêm method fetch VN-Index history** — ⏱ 1h
  - `get_index_history(period)` → DataFrame cho VNINDEX
  - `get_history_batch(symbols, period)` → concurrent fetch cho nhiều symbols (dùng cho universe scan)
  - Verify `get_history("VNINDEX", "1y")` hoạt động với Fireant API
  - **Edge case:** Fireant có thể dùng symbol khác cho VN-Index (kiểm tra: `VNINDEX`, `VN30`, `HOSTC`)

- [ ] **B3. Tạo `app/services/rs_score.py` — core calculation engine** — ⏱ 5h
  - **Dataclass `RSParams` — encapsulate 3 configurable parameters:**
    ```python
    @dataclass(frozen=True)
    class RSParams:
        lookback: int = 252          # RS Rating + RS Near High
        slope_window: int = 10       # RS Line Trending
        correction_window: int = 60  # RS Days

        @classmethod
        def from_preset(cls, name: str) -> "RSParams":
            """Tạo từ preset name: 'conservative', 'balanced', 'aggressive'"""

        def validate(self) -> None:
            """Raise ValueError nếu param ngoài bounds cho phép"""

        @property
        def min_history_days(self) -> int:
            return self.lookback + 30
    ```
  - **Tất cả calculation functions nhận `RSParams` thay vì individual params:**
    - `calculate_rs_line(stock_prices, index_prices)` → Series
    - `calculate_rs_rating(stock_return, universe_returns, params: RSParams)` → float (0–100)
    - `calculate_rs_line_trending(rs_line, params: RSParams)` → bool
    - `calculate_rs_near_high(rs_line, params: RSParams)` → float (0–1)
    - `calculate_rs_days(stock_changes, index_changes, params: RSParams)` → float (0–1)
    - `calculate_composite_score(symbol, ..., params: RSParams)` → RSCompositeResult
  - **Cache key phải include params:** `rs_score_{symbol}_{lookback}_{slope}_{correction}` — khác params = khác cache entry
  - **Edge cases cần handle:**
    - Cổ phiếu có ít hơn `params.min_history_days` phiên → return None + reason
    - Division by zero khi RS Line max = 0
    - Không có phiên giảm nào trong correction_window (bull run) → RS Days = max score
    - NaN/Inf trong pandas calculations
    - Cổ phiếu bị ngưng giao dịch (volume = 0 nhiều phiên liên tiếp)
    - `slope_window > lookback` → validate() catch trước khi tính
    - `correction_window > lookback` → validate() catch

- [ ] **B4. Tạo `app/schemas/rs_score.py` — Pydantic models** — ⏱ 1h
  ```
  RSComponentBreakdown:
    rs_rating: float          # 0–40 (đã nhân weight)
    rs_rating_raw: float      # 0–100 (percentile gốc)
    rs_trending: float        # 0 hoặc 20
    rs_trending_direction: str # "up" | "down"
    rs_near_high: float       # 0–20 (đã nhân weight)
    rs_near_high_pct: float   # 0–1 (% so với đỉnh)
    rs_days: float            # 0–20 (đã nhân weight)
    rs_days_pct: float        # 0–1 (% phiên outperform)
    rs_days_total: int        # tổng số phiên index giảm
    rs_days_outperform: int   # số phiên stock outperform

  RSParamsSchema:
    lookback: int = 252             # 42–504
    slope_window: int = 10          # 3–30
    correction_window: int = 60     # 20–126
    preset: str | None = None       # "conservative" | "balanced" | "aggressive" (override 3 params trên)

  RSScoreResponse:
    symbol: str
    score: float              # 0–100
    signal: str               # "market_leader" | "outperformer" | "average" | "laggard"
    breakdown: RSComponentBreakdown
    params: RSParamsSchema    # echo lại params đã dùng để tính — frontend biết đang xem config nào
    calculated_at: str

  RSScanResponse:
    results: list[RSScoreResponse]
    count: int
    universe: str             # "VN100"
    params: RSParamsSchema    # params chung cho toàn bộ scan
    scanned_at: str

  RSScanParams:
    min_score: float = 0
    sort_by: str = "score"    # "score" | "rs_rating" | "rs_days"
    limit: int = 20
    lookback: int = 252
    slope_window: int = 10
    correction_window: int = 60
    preset: str | None = None
  ```

- [ ] **B5. Tạo `app/routes/rs_score.py` — API endpoints** — ⏱ 2h
  - `GET /rs/{symbol}` → RSScoreResponse (score + breakdown cho 1 cổ phiếu)
    - Query params: `lookback`, `slope_window`, `correction_window`, `preset` (tất cả optional)
    - **Preset logic:** nếu `preset` có giá trị → override 3 params kia; nếu không → dùng individual params hoặc defaults
    - Auth: required (JWT)
    - Cache: 5 phút per `symbol+lookback+slope+correction` combo
    - Validation: 400 nếu params ngoài bounds
  - `GET /rs/scan` → RSScanResponse (top cổ phiếu theo score)
    - Query params: `min_score`, `sort_by`, `limit`, `lookback`, `slope_window`, `correction_window`, `preset`
    - Auth: required
    - Cache: 5 phút per full param combo
  - `GET /rs/watchlist` → RSScanResponse (RS score cho tất cả symbols trong watchlist user)
    - Query params: `lookback`, `slope_window`, `correction_window`, `preset`
    - Auth: required
    - Cache: không cache riêng (gọi qua `/rs/{symbol}` đã cached)
  - `GET /rs/presets` → dict of preset configs (public, no auth needed)
    - Response: `{ presets: { conservative: {...}, balanced: {...}, aggressive: {...} } }`
    - Dùng cho frontend render dropdown options + tooltip giải thích
  - Register router trong `main.py`

- [ ] **B6. Tạo VN100 universe constant** — ⏱ 1h
  - Tạo `app/constants/universe.py` chứa list ~100 symbols VN100
  - Hoặc fetch dynamic từ Fireant nếu API support (check `fireant.py`)
  - **Quan trọng:** List này cần update khi VN100 thay đổi thành phần (mỗi 6 tháng)

#### Frontend

- [ ] **F1. Thêm types cho RS Score** — ⏱ 0.5h
  - `RSComponentBreakdown`, `RSScoreData`, `RSSignal` types trong `types/index.ts`
  - `RS_SIGNAL_CONFIG` constant tương tự `SIGNAL_CONFIG` hiện có

- [ ] **F2. Thêm API endpoints + hooks** — ⏱ 1.5h
  - **Types:** `RSParams = { lookback, slope_window, correction_window, preset? }` trong `types/index.ts`
  - **URL builders trong `lib/api.ts`:**
    - `api.rsScore(symbol, params?: RSParams)` — serialize params thành query string
    - `api.rsScan(scanParams?: RSScanParams)` — include cả filter + RS params
    - `api.rsWatchlist(params?: RSParams)` — params apply cho toàn watchlist
    - `api.rsPresets()` — fetch available presets
  - **Hooks:**
    - `useRSScore(symbol, params?)` — SWR, refresh 5 phút, cache key bao gồm params
    - `useRSScan(scanParams?)` — SWR, refresh 5 phút
    - `useRSPresets()` — SWR, no refresh (presets ít thay đổi)
  - **Constants:** `RS_DEFAULT_PARAMS`, `RS_PARAM_BOUNDS` trong `constants/index.ts`

- [ ] **F3. Component `RSScoreBadge` — badge nhỏ cho table** — ⏱ 1.5h
  - Hiển thị score số (0–100) + signal label (Market Leader / Outperformer / Average / Laggard)
  - Color-coded theo signal: bull cho ≥80, signal-hold cho 60–79, muted cho 40–59, bear cho <40
  - Dùng trong WatchlistTable như một cột mới
  - **Kích thước:** compact, ngang hàng với SignalBadge hiện có

- [ ] **F4. Component `RSBreakdownPanel` — breakdown 4 components** — ⏱ 4h
  - **Đây là component quan trọng nhất về UX** — xem mockup bên dưới
  - 4 progress bars ngang, mỗi bar hiển thị:
    - Tên component + icon giải thích
    - Điểm đạt được / điểm tối đa (ví dụ: 34/40)
    - Progress bar fill với color gradient
    - Tooltip hoặc subtitle giải thích ý nghĩa bằng tiếng Việt
  - Tổng score lớn ở trên, signal badge bên cạnh
  - RS Trending (binary) hiển thị khác: icon ↑/↓ thay vì progress bar
  - Responsive: stack vertical trên mobile

- [ ] **F5. Component `RSParamSelector` — preset + custom param UI** — ⏱ 2.5h
  - **Preset dropdown (primary UX):** 3 lựa chọn nhanh
    - "Thận trọng (1 năm)" — conservative preset, default
    - "Cân bằng (6 tháng)" — balanced preset
    - "Nhạy (3 tháng)" — aggressive preset
  - **Custom toggle:** click "Tuỳ chỉnh" → expand 3 sliders:
    - Lookback: slider 42–504, hiển thị cả phiên + thời gian thực ("126 phiên ≈ 6 tháng")
    - Slope window: slider 3–30 ("10 phiên ≈ 2 tuần")
    - Correction window: slider 20–126 ("60 phiên ≈ 3 tháng")
  - **Validation:** disable "Áp dụng" nếu slope_window > lookback hoặc correction_window > lookback
  - **Tooltip cho mỗi slider:** giải thích ngắn gọn param ảnh hưởng component nào
  - **State management:** params lưu trong URL search params (shareable) — dùng `useSearchParams`
  - Compact mode: chỉ hiển thị preset name hiện tại + icon ⚙️ để expand

- [ ] **F6. Tích hợp RS Score vào WatchlistTable** — ⏱ 2h
  - Thêm cột "RS" sau cột Signal hiện có
  - Click vào score → expand/collapse RSBreakdownPanel inline (hoặc popover)
  - RSParamSelector hiển thị phía trên table (shared cho toàn bộ watchlist)
  - Sort by RS Score
  - Loading skeleton khi data chưa có

#### Data Layer

- [ ] **D1. Verify Fireant API cho VN-Index + batch history** — ⏱ 1h
  - Test `get_history("VNINDEX", "1y")` — confirm symbol đúng
  - Test concurrent fetch 100 symbols — benchmark thời gian + rate limit
  - Xác định có cần queue/throttle không
  - **Blocker nếu:** Fireant không support VN-Index history → cần tìm data source thay thế

- [ ] **D2. Thiết kế caching strategy cho RS scan** — ⏱ 1.5h
  - RS scan cần fetch ~100 symbols history → expensive operation
  - **Cache layers:**
    - **Layer 1 — Raw history:** cache OHLCV per symbol (5 phút) — shared across all param combos vì raw data không thay đổi theo params
    - **Layer 2 — Universe rankings:** cache RS Rating percentiles per `lookback` value (5 phút). Khác lookback = khác ranking
    - **Layer 3 — Individual scores:** cache composite score per `symbol+lookback+slope+correction` (5 phút)
  - **Cache key format:**
    - `rs_history_{symbol}` — raw data, param-independent
    - `rs_universe_{lookback}` — percentile ranking cho 1 lookback value
    - `rs_score_{symbol}_{lookback}_{slope}_{correction}` — final score
  - **Preset optimization:** Vì chỉ có 3 presets, pre-warm cache cho cả 3 preset combos sẽ cover phần lớn requests
  - **Custom params:** cache on-demand, có thể miss cache thường xuyên hơn — acceptable vì ít user dùng custom

---

### 🟡 P2 — Should have (UX polish + RS Scanner page)

- [ ] **F7. Trang RS Scanner mới (`/rs-scanner`)** — ⏱ 4h
  - RSParamSelector ở đầu trang (reuse component từ F5)
  - Table hiển thị top cổ phiếu theo RS Score
  - Filter: min score slider (default 80)
  - Sort by: score, RS Rating, RS Days
  - Mỗi row hiển thị: symbol, giá, score, signal badge, mini breakdown (4 dots/bars)
  - Auto-refresh 5 phút
  - Sidebar navigation: thêm link "RS Scanner"

- [ ] **F8. RS Score column trong Heatmap** — ⏱ 2h
  - Option toggle giữa heatmap theo % change và theo RS Score
  - Color gradient: đỏ (laggard) → vàng (average) → xanh (leader)

- [ ] **F9. Tooltips giải thích từng component** — ⏱ 1.5h
  - Hover vào tên component → popup giải thích ngắn bằng tiếng Việt
  - **Tooltip content tự động adjust theo params hiện tại:**
    - "RS Rating: Outperform bao nhiêu % thị trường trong {lookback} phiên ({time_text})"
    - "RS Trending: RS Line đang đi lên hay xuống trong {slope_window} phiên gần nhất"
    - "RS Near High: RS Line đang ở bao nhiêu % so với đỉnh {lookback} phiên"
    - "RS Days: Tỉ lệ phiên outperform trong {correction_window} phiên gần nhất"

- [ ] **B7. Endpoint `/rs/{symbol}/history`** — ⏱ 2h
  - Trả về RS Line history (time series) để frontend vẽ chart
  - Query params: `lookback` (dùng cho RS high calculation)
  - Response: `{ symbol, data: [{ date, rs_line, rs_line_ma }], rs_high, params }`

- [ ] **F10. RS Line mini chart trong breakdown panel** — ⏱ 3h
  - Sparkline nhỏ hiển thị RS Line gần nhất (period = lookback param)
  - Đường ngang đánh dấu RS Line high
  - Highlight vùng RS Line đang trending up/down

---

### 🟢 P3 — Nice to have (advanced features)

- [ ] **F11. RS New High divergence alert** — ⏱ 2h
  - Detect khi RS Line phá đỉnh 1 năm nhưng giá chưa phá đỉnh
  - Hiển thị badge đặc biệt "RS New High" trên WatchlistTable
  - Optional: push notification

- [ ] **B8. Market regime filter integration** — ⏱ 2h
  - Check VN-Index vs MA50 vs MA200
  - Thêm field `market_regime` vào RSScoreResponse
  - Frontend hiển thị warning banner khi market regime xấu

- [ ] **B9. Background pre-computation** — ⏱ 3h
  - Scheduled task tính RS score cho toàn universe mỗi 5 phút
  - Store result trong cache → API response instant
  - Thay vì compute on-demand khi user request

- [ ] **F13. Animated score transitions** — ⏱ 1h
  - Score number count up animation khi load
  - Progress bar fill animation
  - Color transition khi score thay đổi giữa refresh cycles

---

## Dependencies

```
D1 ──→ B2 ──→ B3 ──→ B5 ──→ F6
              ↑                ↑
B1 ───────────┘                │
B6 ──→ B3                     │
B4 ──→ B5                     │
F1 ──→ F2 ──→ F3 ──→ F6      │
              F4 ─────────────┘
              F5 (RSParamSelector) ──→ F6
```

**Critical path:** `D1 → B2 → B3 → B5 → F2 → F6`

**Giải thích:**
1. **D1 phải xong đầu tiên** — nếu Fireant không support VN-Index history, toàn bộ approach cần thay đổi
2. **B2 trước B3** — calculation engine cần data fetching methods
3. **B3 + B4 song song** — service và schema independent
4. **B5 cần B3 + B4** — route wires service + schema; B5 bao gồm `/rs/presets` endpoint
5. **F1 + F2 song song với backend** nếu schema đã agree — F2 bao gồm `useRSPresets` hook
6. **F3, F4, F5 song song** — badge, panel, param selector là independent components
7. **F6 cần F3 + F4 + F5 + B5** — integration cần cả 3 UI components + API ready

---

## Tổng estimate

| Priority | Thời gian | Scope |
|----------|-----------|-------|
| P1 | ~23h | Score tính đúng + configurable params (3 presets + custom) + hiển thị trên watchlist + breakdown panel |
| P1+P2 | ~36h | + RS Scanner page, tooltips, RS Line chart |
| Full (P1+P2+P3) | ~44h | + RS New High alert, market regime, pre-computation |

**Recommend:** Ship P1 trước (4–5 ngày dev), validate với real data ở cả 3 presets, rồi iterate P2.

---

## Testing Plan

### Unit Tests (P1 — bắt buộc)

- [ ] **T1. `rs_score.py` calculation tests** — ⏱ 4h
  - Test `RSParams.validate()` — bounds checking, slope > lookback rejection, preset resolution
  - Test `RSParams.from_preset()` — 3 presets resolve đúng values
  - Test `calculate_rs_rating` với known percentile data — **test với nhiều lookback values**
  - Test `calculate_rs_line_trending` — slope dương → True, slope âm → False, **test slope_window 3 vs 30**
  - Test `calculate_rs_near_high` — at high → 1.0, at 80% → 0.8
  - Test `calculate_rs_days` — all outperform → 1.0, none → 0.0, mixed → correct ratio, **test correction_window 20 vs 126**
  - Test `calculate_composite_score` — verify weight arithmetic (40+20+20+20 = 100)
  - **Param consistency:** same data + same params = same score (deterministic)
  - **Param sensitivity:** shorter lookback → scores change faster (verify with time-series data)
  - **Edge cases:** empty data, single data point, all same returns, zero index price, params at min/max bounds

- [ ] **T2. API endpoint tests** — ⏱ 2h
  - `GET /rs/HPG` → 200, valid RSScoreResponse schema
  - `GET /rs/INVALID` → 404 hoặc error response
  - `GET /rs/scan?min_score=80` → filtered results
  - `GET /rs/watchlist` → scores cho user's watchlist
  - Auth: 401 without token
  - Query params validation: invalid lookback, negative min_score

- [ ] **T3. Frontend component tests** — ⏱ 2.5h
  - RSScoreBadge renders correct color/label cho mỗi signal range
  - RSBreakdownPanel renders 4 components với correct values
  - RSBreakdownPanel subtitle text thay đổi đúng theo params (e.g., "6 tháng" thay vì "12 tháng" khi lookback=126)
  - RSParamSelector: preset selection updates params đúng
  - RSParamSelector: custom mode validates bounds, disables submit khi invalid
  - RSParamSelector: params persist vào URL search params
  - RS Trending hiển thị ↑/↓ đúng
  - Loading states
  - Error states (API fail, invalid params → 400)

### Integration Tests (P1)

- [ ] **T4. End-to-end data flow** — ⏱ 2h
  - Fetch real HPG + VNINDEX data → compute score → verify score trong range hợp lý
  - Verify cache behavior: second call nhanh hơn first call
  - Verify RS scan returns sorted results
  - Verify universe computation: tất cả symbols trong VN100 có score

### Verification trước khi ship (P1)

- [ ] **T5. Sanity check với real data** — ⏱ 1h
  - Top 5 RS Score symbols phải là những cổ phiếu mà market đang nói đến (cross-check với tin tức)
  - Score distribution hợp lý: phần lớn 40–60, ít cổ phiếu >80 và <20
  - RS Rating percentiles sum to ~uniform distribution
  - RS Trending chia khoảng 50/50 trong market bình thường
  - Không có score > 100 hoặc < 0

---

## UI Mockup — RSBreakdownPanel

### Layout tổng quan

```
┌─────────────────────────────────────────────────────────┐
│  RS Composite Score                                     │
│                                                         │
│  ┌──────┐                                               │
│  │  78  │  Outperformer                                 │
│  └──────┘  Cổ phiếu đang mạnh hơn thị trường           │
│                                                         │
│  ─────────────────────────────────────────────────────── │
│                                                         │
│  RS Rating (40%)              Percentile trong VN100    │
│  ████████████████████████████████░░░░░░  34/40          │
│  Outperform 85% thị trường trong 12 tháng qua          │
│                                                         │
│  RS Trending (20%)            Xu hướng hiện tại         │
│  ▲ Đang outperform            ████████████████  20/20   │
│  RS Line tăng trong 2 tuần gần nhất                     │
│                                                         │
│  RS Near High (20%)           Vị trí so với đỉnh 1 năm │
│  ██████████████████████████████░░░░░░░░  16/20          │
│  RS Line đang ở 80% so với đỉnh cao nhất               │
│                                                         │
│  RS Days (20%)                Kháng cự khi giảm         │
│  ████████████████░░░░░░░░░░░░░░░░░░░░░   8/20          │
│  Outperform 40% phiên thị trường giảm (3 tháng)        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Chi tiết từng component

**Tổng score (header):**
- Số lớn (font-size ~2rem) + color theo signal range
- Signal label: "Market Leader" / "Outperformer" / "Average" / "Laggard"
- Subtitle 1 dòng giải thích ngắn

**RS Rating (component 1):**
- Progress bar fill: `score / 40 * 100%`
- Text phải: `{score}/40`
- Subtitle: "Outperform {raw_percentile}% thị trường trong {lookback_text}"
- Color: gradient từ bear → bull theo score

**RS Trending (component 2):**
- **Khác biệt:** Binary → dùng icon ▲/▼ thay vì gradient bar
- ▲ xanh (bull) + full bar khi trending up = 20đ
- ▼ đỏ (bear) + empty bar khi trending down = 0đ
- Subtitle: "RS Line {tăng/giảm} trong {slope_window} phiên gần nhất"

**RS Near High (component 3):**
- Progress bar fill: `score / 20 * 100%`
- Text phải: `{score}/20`
- Subtitle: "RS Line đang ở {pct_of_high}% so với đỉnh cao nhất"
- Special: nếu pct_of_high ≥ 98% → thêm badge "🔥 RS New High"

**RS Days (component 4):**
- Progress bar fill: `score / 20 * 100%`
- Text phải: `{score}/20`
- Subtitle: "Outperform {outperform_days}/{total_down_days} phiên thị trường giảm"
- Highlight: nếu rs_days_pct ≥ 60% → thêm label "Leadership"

### Color scheme

```
Score ≥ 80  → var(--bull)          #059669
Score 60–79 → var(--signal-hold)   #d97706
Score 40–59 → var(--muted-foreground)
Score < 40  → var(--bear)          #dc2626

Progress bar background: var(--muted)
Progress bar fill: gradient matching score color
```

### Compact mode (trong WatchlistTable row)

```
┌─────────────────────────────────────────────────────────────────┐
│ Symbol │ Giá     │ %     │ Vol  │ RSI  │ Signal │ RS    │       │
│ HPG    │ 28,500  │ +1.2% │ 12M  │ 62   │ GIỮ    │ 78 ↑  │ ···  │
│ FPT    │ 125,000 │ +0.5% │ 3.2M │ 55   │ MUA    │ 92 ↑  │ ···  │
│ MWG    │ 48,200  │ -0.8% │ 5.1M │ 45   │ BÁN    │ 35 ↓  │ ···  │
└─────────────────────────────────────────────────────────────────┘

Click vào "78 ↑" → expand RSBreakdownPanel bên dưới row
```

---

## Risks & Blockers

| Rủi ro | Khả năng | Ảnh hưởng | Xử lý |
|--------|----------|-----------|-------|
| Fireant không support VN-Index history | Trung bình | **Cao** — block toàn bộ | Fallback: dùng ETF `E1VFVN30` hoặc tự tính index từ component stocks |
| Rate limit khi fetch 100 symbols cùng lúc | Cao | Trung bình | Throttle: batch 10 symbols/request, hoặc pre-compute background |
| Tính toán 100 symbols chậm (>10s) | Trung bình | Trung bình | Cache aggressively, pre-compute universe rankings mỗi 5 phút |
| VN100 component list thay đổi | Thấp (6 tháng/lần) | Thấp | Config-based list, dễ update |
| Data gaps (cổ phiếu mới, ngưng giao dịch) | Trung bình | Thấp | Graceful skip: return null score + reason |
| Score không match expectation (top stocks lạ) | Trung bình | Trung bình | Sanity check T5 trước ship, tune lookback nếu cần |

---

## Notes & Quyết định quan trọng

1. **RS Score là screening tool, không phải buy signal** — UI phải communicate rõ điều này. Thêm disclaimer text nhỏ ở footer panel.

2. **3 params đều configurable từ P1** — lookback, slope_window, correction_window. User chọn qua 3 presets (conservative/balanced/aggressive) hoặc custom sliders. Params encode vào URL search params để shareable. API validate bounds server-side.

3. **Universe = VN100 (hardcoded list)** — P1 dùng static list. P3 có thể fetch dynamic nếu Fireant support.

4. **Cache strategy:** Pre-compute universe rankings là optimization quan trọng nhất. Không pre-compute → mỗi request `/rs/{symbol}` phải fetch 100 symbols history.

5. **Không persist RS score vào database** — compute on-the-fly + cache. Lý do: data source (Fireant) là source of truth, và score thay đổi liên tục.

6. **Component 2 (RS Trending) binary design** — UX cần differentiate rõ ràng: đây là YES/NO, không phải gradient. Dùng icon + full/empty bar, không dùng partial fill.
