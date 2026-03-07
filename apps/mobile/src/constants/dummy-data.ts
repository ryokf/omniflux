export const USER_PROFILE = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  email: "andi@omniflux.id",
  name: "Andi Wijaya",
  createdAt: "2025-11-15T08:00:00Z",
};

export const WALLETS = [
  { id: 1, name: "BCA Utama", balance: 12500000, icon: "🏦" },
  { id: 2, name: "Gopay", balance: 850000, icon: "📱" },
  { id: 3, name: "Tunai", balance: 350000, icon: "💵" },
];

export const CATEGORIES = [
  { id: 1, name: "Makanan", type: "expense" as const, icon: "🍔" },
  { id: 2, name: "Transportasi", type: "expense" as const, icon: "🚗" },
  { id: 3, name: "Tagihan", type: "expense" as const, icon: "📄" },
  { id: 4, name: "Hiburan", type: "expense" as const, icon: "🎬" },
  { id: 5, name: "Belanja", type: "expense" as const, icon: "🛍️" },
  { id: 6, name: "Gaji", type: "income" as const, icon: "💰" },
  { id: 7, name: "Freelance", type: "income" as const, icon: "💻" },
  { id: 8, name: "Investasi", type: "income" as const, icon: "📈" },
];

export const TRANSACTIONS = [
  {
    id: "t1",
    walletId: 1,
    categoryId: 1,
    amount: -45000,
    description: "Makan siang di warteg",
    aiConfidence: 97.5,
    date: "2026-03-07T12:30:00Z",
  },
  {
    id: "t2",
    walletId: 2,
    categoryId: 2,
    amount: -25000,
    description: "Grab ke kantor",
    aiConfidence: 95.0,
    date: "2026-03-07T08:15:00Z",
  },
  {
    id: "t3",
    walletId: 1,
    categoryId: 3,
    amount: -300000,
    description: "Bayar WiFi bulanan",
    aiConfidence: 99.2,
    date: "2026-03-06T14:00:00Z",
  },
  {
    id: "t4",
    walletId: 1,
    categoryId: 6,
    amount: 8500000,
    description: "Gaji bulan Maret",
    aiConfidence: null,
    date: "2026-03-01T09:00:00Z",
  },
  {
    id: "t5",
    walletId: 3,
    categoryId: 1,
    amount: -35000,
    description: "Kopi dan roti pagi",
    aiConfidence: 88.3,
    date: "2026-03-06T07:45:00Z",
  },
  {
    id: "t6",
    walletId: 1,
    categoryId: 4,
    amount: -75000,
    description: "Nonton bioskop",
    aiConfidence: 92.1,
    date: "2026-03-05T19:30:00Z",
  },
  {
    id: "t7",
    walletId: 2,
    categoryId: 5,
    amount: -150000,
    description: "Beli baju online",
    aiConfidence: 85.0,
    date: "2026-03-05T11:20:00Z",
  },
  {
    id: "t8",
    walletId: 1,
    categoryId: 7,
    amount: 2000000,
    description: "Pembayaran project design",
    aiConfidence: null,
    date: "2026-03-04T16:00:00Z",
  },
];

export const PORTFOLIO_ASSETS = [
  {
    id: 1,
    tickerSymbol: "BTC",
    assetType: "Crypto" as const,
    name: "Bitcoin",
    quantity: 0.015,
    avgBuyPrice: 950000000,
    currentPrice: 1020000000,
    totalValue: 15300000,
    pnlPercent: 7.37,
    icon: "₿",
  },
  {
    id: 2,
    tickerSymbol: "ETH",
    assetType: "Crypto" as const,
    name: "Ethereum",
    quantity: 0.5,
    avgBuyPrice: 32000000,
    currentPrice: 29500000,
    totalValue: 14750000,
    pnlPercent: -7.81,
    icon: "Ξ",
  },
  {
    id: 3,
    tickerSymbol: "BBCA",
    assetType: "Stock" as const,
    name: "Bank Central Asia Tbk",
    quantity: 200,
    avgBuyPrice: 9200,
    currentPrice: 9850,
    totalValue: 1970000,
    pnlPercent: 7.07,
    icon: "📊",
  },
  {
    id: 4,
    tickerSymbol: "TLKM",
    assetType: "Stock" as const,
    name: "Telkom Indonesia",
    quantity: 500,
    avgBuyPrice: 3800,
    currentPrice: 3650,
    totalValue: 1825000,
    pnlPercent: -3.95,
    icon: "📊",
  },
  {
    id: 5,
    tickerSymbol: "RDPT01",
    assetType: "Mutual Fund" as const,
    name: "Mandiri Investa Pasar Uang",
    quantity: 1000,
    avgBuyPrice: 1150,
    currentPrice: 1185,
    totalValue: 1185000,
    pnlPercent: 3.04,
    icon: "📦",
  },
];

export const ASSET_SYMBOLS: Record<string, { symbol: string; name: string }[]> =
  {
    Crypto: [
      { symbol: "BTC", name: "Bitcoin" },
      { symbol: "ETH", name: "Ethereum" },
      { symbol: "SOL", name: "Solana" },
      { symbol: "BNB", name: "Binance Coin" },
    ],
    Stock: [
      { symbol: "BBCA", name: "Bank Central Asia Tbk" },
      { symbol: "TLKM", name: "Telkom Indonesia" },
      { symbol: "BBRI", name: "Bank Rakyat Indonesia" },
      { symbol: "ASII", name: "Astra International" },
    ],
    "Mutual Fund": [
      { symbol: "RDPT01", name: "Mandiri Investa Pasar Uang" },
      { symbol: "RDPT02", name: "BNI-AM Dana Lancar" },
      { symbol: "RDSA01", name: "Schroder Dana Campuran" },
    ],
  };

export const INSIGHTS = [
  {
    id: 1,
    type: "budget_alert",
    message:
      "Pengeluaran makanan bulan ini sudah 80% dari rata-rata. Pertimbangkan untuk memasak di rumah minggu ini.",
    isRead: false,
    createdAt: "2026-03-07T20:00:00Z",
  },
  {
    id: 2,
    type: "investment_opportunity",
    message:
      "ETH sedang koreksi -7.8%. Anda memiliki saldo Rp 12.5 juta di BCA. Ingin menambah posisi?",
    isRead: false,
    createdAt: "2026-03-07T14:30:00Z",
  },
  {
    id: 3,
    type: "savings_milestone",
    message:
      "Selamat! Anda berhasil menghemat Rp 1.2 juta dibanding bulan lalu. Konsistensi yang luar biasa!",
    isRead: true,
    createdAt: "2026-03-06T09:00:00Z",
  },
  {
    id: 4,
    type: "budget_alert",
    message:
      "Transportasi naik 25% dari bulan lalu. Coba gunakan transportasi umum untuk penghematan.",
    isRead: true,
    createdAt: "2026-03-05T18:00:00Z",
  },
  {
    id: 5,
    type: "investment_opportunity",
    message:
      "BBCA mencapai harga tertinggi baru. Pertimbangkan rebalancing portofolio saham Anda.",
    isRead: true,
    createdAt: "2026-03-04T10:00:00Z",
  },
];

// Helper
export function formatRupiah(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function formatCompactRupiah(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "+";
  if (abs >= 1_000_000) {
    return `${sign}Rp ${(abs / 1_000_000).toFixed(1)} jt`;
  }
  if (abs >= 1_000) {
    return `${sign}Rp ${(abs / 1_000).toFixed(0)} rb`;
  }
  return `${sign}Rp ${abs}`;
}

export function getCategory(id: number) {
  return CATEGORIES.find((c) => c.id === id);
}

export function getWallet(id: number) {
  return WALLETS.find((w) => w.id === id);
}

export function getTotalNetWorth(): number {
  const cashTotal = WALLETS.reduce((sum, w) => sum + w.balance, 0);
  const investTotal = PORTFOLIO_ASSETS.reduce(
    (sum, a) => sum + a.totalValue,
    0,
  );
  return cashTotal + investTotal;
}

export function getExpenseByCategory() {
  const expenses = TRANSACTIONS.filter((t) => t.amount < 0);
  const map: Record<string, number> = {};
  for (const t of expenses) {
    const cat = getCategory(t.categoryId);
    const name = cat?.name ?? "Lainnya";
    map[name] = (map[name] ?? 0) + Math.abs(t.amount);
  }
  return Object.entries(map)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
}
