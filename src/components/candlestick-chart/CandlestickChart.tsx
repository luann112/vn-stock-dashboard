"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  type UTCTimestamp,
  type DeepPartial,
  type TimeChartOptions,
} from "lightweight-charts";
import { useTheme } from "next-themes";
import { useOHLCV } from "@/hooks/useOHLCV";
import { Skeleton } from "@/components/skeleton";
import { ErrorState } from "@/components/error-state";
import { CHART_HEIGHT } from "@/constants";
import { getTradingViewTheme, getCandlestickOptions, getMaColors } from "@/lib/design-tokens";
import { computeMa } from "./chartUtils";

export interface CandlestickChartProps {
  symbol: string;
}

/** Convert "YYYY-MM-DD" ISO date string → unix seconds for TradingView */
function isoToTimestamp(iso: string): UTCTimestamp {
  return Math.floor(new Date(iso).getTime() / 1000) as UTCTimestamp;
}

export function CandlestickChart({ symbol }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme !== "light";

  const { data: ohlcvData, isLoading, error } = useOHLCV(symbol);

  useEffect(() => {
    if (!containerRef.current || !ohlcvData || ohlcvData.length === 0) return;

    const tvTheme = getTradingViewTheme(isDark) as DeepPartial<TimeChartOptions>;
    const candleOpts = getCandlestickOptions(isDark);
    const maColors = getMaColors(isDark);

    const chart = createChart(containerRef.current, {
      ...tvTheme,
      height: CHART_HEIGHT,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, candleOpts);

    const ma20Series = chart.addSeries(LineSeries, {
      color: maColors.short,
      lineWidth: 2,
      title: "MA short",
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const ma50Series = chart.addSeries(LineSeries, {
      color: maColors.long,
      lineWidth: 2,
      title: "MA long",
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const sorted = [...ohlcvData].sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    candleSeries.setData(
      sorted.map((b) => ({
        time: isoToTimestamp(b.time),
        open: b.open, high: b.high, low: b.low, close: b.close,
      }))
    );
    ma20Series.setData(computeMa(sorted, 20));
    ma50Series.setData(computeMa(sorted, 50));
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) {
        chart.resize(containerRef.current.clientWidth, CHART_HEIGHT);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [ohlcvData, isDark]);

  if (isLoading) return <Skeleton height={CHART_HEIGHT} />;
  if (error) return <ErrorState message="Không thể tải biểu đồ OHLCV" />;

  return <div ref={containerRef} className="w-full rounded-lg overflow-hidden" />;
}
