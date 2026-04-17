export const RS_TOOLTIPS = {
  rating: `RS Rating đo cổ phiếu đang outperform bao nhiêu % thị trường trong kỳ lookback.

Cách tính: tính return của tất cả cổ phiếu VN100 trong N phiên, xếp hạng cổ phiếu này trong danh sách đó.

Ví dụ: HPG tăng 38% trong 252 phiên. 85/100 cổ phiếu VN100 tăng ít hơn → RS Rating = 85 → 34/40đ.

Ngưỡng: < 50 laggard · 50–70 average · 70–85 tốt · > 85 leader`,

  trending: `RS Line = giá cổ phiếu / VN-Index. RS Trending kiểm tra RS Line hôm nay có cao hơn N phiên trước không.

Kết quả binary — không có điểm giữa:
· Slope dương (RS Line tăng) → 20đ
· Slope âm (RS Line giảm)   →  0đ

Lưu ý: cổ phiếu có thể tăng giá nhưng vẫn bị 0đ nếu VN-Index tăng mạnh hơn.

Ví dụ: VCB tăng 6.25% nhưng VN-Index tăng 11.3% → RS Line đi xuống → 0đ.`,

  nearHigh: `RS Line hiện tại đang ở bao nhiêu % so với mức cao nhất trong lookback phiên?

Cách tính: rs_line_hôm_nay / max(rs_line trong N phiên) × 100

Ví dụ: FPT RS Line hôm nay = 0.0415, đỉnh 1 năm = 0.0420 → 98.8% → 19.8/20đ.

Tín hiệu mạnh: RS Line phá đỉnh mới trong khi giá chưa phá đỉnh = tổ chức đang tích lũy âm thầm.

Ngưỡng: < 70% sụt mạnh · 70–90% bình thường · > 95% gần đỉnh`,

  days: `Trong correction_window phiên gần nhất, đếm số ngày VN-Index giảm mà cổ phiếu giảm ÍT HƠN (hoặc tăng).

Cách tính: số ngày outperform / tổng ngày VN-Index giảm × 100

Ví dụ: VNM — trong 14 ngày thị trường giảm, VNM giảm ít hơn 5 lần → 5/14 = 36% → 7/20đ.

Ngưỡng leadership (IBD/O'Neil): > 60% số ngày thị trường giảm = có dòng tiền tổ chức đỡ giá.`,
} as const;

export type RSTooltipKey = keyof typeof RS_TOOLTIPS;
