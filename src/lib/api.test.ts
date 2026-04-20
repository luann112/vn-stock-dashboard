import { describe, expect, test, vi, beforeEach } from "vitest";
import { api, ApiError, isApiError, fetcher, setAuthToken } from "./api";

const API_BASE = "https://vn-stock-api.railway.app";

describe("api URL builders", () => {
  test("quote builds correct URL", () => {
    expect(api.quote("VNM")).toBe(`${API_BASE}/market/quote/VNM`);
  });

  test("quotes joins symbols with comma", () => {
    expect(api.quotes(["VNM", "VIC", "FPT"])).toBe(`${API_BASE}/market/quotes?symbols=VNM,VIC,FPT`);
  });

  test("signals builds correct URL", () => {
    expect(api.signals("VIC")).toBe(`${API_BASE}/signals/VIC`);
  });

  test("rsScore without params returns base URL", () => {
    expect(api.rsScore("VNM")).toBe(`${API_BASE}/rs/VNM`);
  });

  test("rsScore with custom lookback includes query string", () => {
    expect(api.rsScore("VNM", { lookback: 60 })).toBe(`${API_BASE}/rs/VNM?lookback=60`);
  });

  test("rsScore with preset sends only preset param", () => {
    expect(api.rsScore("VNM", { preset: "short_term" })).toBe(
      `${API_BASE}/rs/VNM?preset=short_term`
    );
  });

  test("rsScan with no opts returns base URL", () => {
    expect(api.rsScan()).toBe(`${API_BASE}/rs/scan`);
  });

  test("rsScan with min_score and limit", () => {
    const url = api.rsScan({ min_score: 70, limit: 20 });
    expect(url).toContain("min_score=70");
    expect(url).toContain("limit=20");
  });

  test("rsWatchlist without params returns base URL", () => {
    expect(api.rsWatchlist()).toBe(`${API_BASE}/rs/watchlist`);
  });

  test("rsPresets returns correct URL", () => {
    expect(api.rsPresets()).toBe(`${API_BASE}/rs/presets`);
  });
});

describe("ApiError", () => {
  test("creates error with status and endpoint", () => {
    const err = new ApiError(404, "/api/test");
    expect(err.status).toBe(404);
    expect(err.endpoint).toBe("/api/test");
    expect(err.message).toBe("API 404 — /api/test");
    expect(err.name).toBe("ApiError");
  });

  test("isApiError returns true for ApiError instances", () => {
    expect(isApiError(new ApiError(500, "/test"))).toBe(true);
  });

  test("isApiError returns false for plain errors", () => {
    expect(isApiError(new Error("nope"))).toBe(false);
  });

  test("isApiError returns false for non-errors", () => {
    expect(isApiError("string")).toBe(false);
    expect(isApiError(null)).toBe(false);
  });
});

describe("fetcher", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("returns parsed JSON on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ symbol: "VNM", price: 85000 }),
      })
    );

    const result = await fetcher<{ symbol: string; price: number }>(`${API_BASE}/market/quote/VNM`);
    expect(result).toEqual({ symbol: "VNM", price: 85000 });
  });

  test("throws ApiError on non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));

    await expect(fetcher(`${API_BASE}/missing`)).rejects.toThrow(ApiError);
  });
});

describe("setAuthToken", () => {
  test("is a callable function", () => {
    expect(() => setAuthToken("test-token")).not.toThrow();
    expect(() => setAuthToken(null)).not.toThrow();
  });
});
