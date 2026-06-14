import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line, Circle, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/src/constants/colors';
import { formatRupiah } from '@/src/utils/format';

interface DataPoint {
    date: string;   // label (e.g. "10 Jun")
    value: number;  // cumulative investment value at this point
}

interface InvestmentChartProps {
    portfolioDetails: {
        assetId: number;
        ticker: string;
        quantity: number;
        averagePurchasePrice: number;
        currentPrice: number;
        totalActualValue: number;
        unrealizedPnl: number;
    }[];
    transactions: {
        id: string;
        amount: number;
        description: string;
        transaction_date?: string;
        transactionDate?: string;
        category_id?: number;
        categoryId?: number;
    }[];
}

type Period = '1W' | '1M' | '3M' | '6M' | 'ALL';

const PERIODS: { key: Period; label: string }[] = [
    { key: '1W', label: '1M' },
    { key: '1M', label: '1B' },
    { key: '3M', label: '3B' },
    { key: '6M', label: '6B' },
    { key: 'ALL', label: 'Semua' },
];

const CHART_WIDTH = Dimensions.get('window').width - 72;
const CHART_HEIGHT = 160;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 24;
const PADDING_LEFT = 0;
const PADDING_RIGHT = 0;

function getDaysForPeriod(period: Period): number {
    switch (period) {
        case '1W': return 7;
        case '1M': return 30;
        case '3M': return 90;
        case '6M': return 180;
        case 'ALL': return 9999;
    }
}

function formatDateLabel(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
}

function buildChartData(
    transactions: InvestmentChartProps['transactions'],
    portfolioDetails: InvestmentChartProps['portfolioDetails'],
    period: Period
): DataPoint[] {
    const now = new Date();
    const daysBack = getDaysForPeriod(period);
    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    // Current total investment value
    const currentTotalValue = portfolioDetails.reduce((sum, p) => sum + Number(p.totalActualValue || 0), 0);

    // Get investment-related transactions (expenses with investment-like descriptions, or just negative amounts)
    // sorted by date ascending
    const investTxs = transactions
        .filter(tx => {
            const dateStr = tx.transaction_date || tx.transactionDate;
            if (!dateStr) return false;
            const txDate = new Date(dateStr);
            if (period !== 'ALL' && txDate < cutoffDate) return false;
            return true;
        })
        .sort((a, b) => {
            const dateA = new Date(a.transaction_date || a.transactionDate || '');
            const dateB = new Date(b.transaction_date || b.transactionDate || '');
            return dateA.getTime() - dateB.getTime();
        });

    if (investTxs.length === 0) {
        // No transactions in period — show flat line at current value
        const startDate = period === 'ALL' ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) : cutoffDate;
        return [
            { date: formatDateLabel(startDate), value: currentTotalValue },
            { date: formatDateLabel(now), value: currentTotalValue },
        ];
    }

    // Build cumulative value points based on transactions
    // We work backward from currentTotalValue, undoing transactions
    const points: { date: Date; value: number }[] = [];

    // Start with the current point
    points.push({ date: now, value: currentTotalValue });

    // Walk backward through transactions to reconstruct historical values
    let runningValue = currentTotalValue;
    const reversedTxs = [...investTxs].reverse();

    for (const tx of reversedTxs) {
        const txDate = new Date(tx.transaction_date || tx.transactionDate || '');
        // Undo the transaction effect:
        // If amount < 0 (expense/buy), undoing it means adding back
        // If amount > 0 (income/sell), undoing it means subtracting
        runningValue -= Number(tx.amount);
        points.push({ date: txDate, value: Math.max(0, runningValue) });
    }

    // Reverse to get chronological order
    points.reverse();

    // Aggregate by day (keep last value per day)
    const dayMap = new Map<string, { date: Date; value: number }>();
    for (const p of points) {
        const dayKey = p.date.toISOString().slice(0, 10);
        dayMap.set(dayKey, p);
    }

    const aggregated = Array.from(dayMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());

    // Take at most 12 points for clean display
    const maxPoints = 12;
    let sampled = aggregated;
    if (aggregated.length > maxPoints) {
        const step = (aggregated.length - 1) / (maxPoints - 1);
        sampled = [];
        for (let i = 0; i < maxPoints - 1; i++) {
            sampled.push(aggregated[Math.round(i * step)]);
        }
        sampled.push(aggregated[aggregated.length - 1]); // always include last
    }

    return sampled.map(p => ({
        date: formatDateLabel(p.date),
        value: p.value,
    }));
}

function createSmoothPath(points: { x: number; y: number }[]): string {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
}

export function InvestmentChart({ portfolioDetails, transactions }: InvestmentChartProps) {
    const [period, setPeriod] = useState<Period>('1M');

    const data = buildChartData(transactions, portfolioDetails, period);

    if (data.length < 2) {
        return (
            <View className="bg-surface rounded-2xl p-5 border border-surface-border mb-5">
                <Text className="text-txt text-[17px] font-bold mb-3">📈 Grafik Investasi</Text>
                <View className="items-center justify-center py-8">
                    <Text className="text-txt-muted text-sm">Belum ada data untuk ditampilkan</Text>
                </View>
            </View>
        );
    }

    const values = data.map(d => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const drawWidth = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
    const drawHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

    const points = data.map((d, i) => ({
        x: PADDING_LEFT + (i / (data.length - 1)) * drawWidth,
        y: PADDING_TOP + drawHeight - ((d.value - minVal) / range) * drawHeight,
    }));

    const linePath = createSmoothPath(points);

    // Area path (fill below line)
    const areaPath = linePath
        + ` L ${points[points.length - 1].x} ${CHART_HEIGHT - PADDING_BOTTOM}`
        + ` L ${points[0].x} ${CHART_HEIGHT - PADDING_BOTTOM} Z`;

    const firstVal = values[0];
    const lastVal = values[values.length - 1];
    const changePercent = firstVal > 0 ? ((lastVal - firstVal) / firstVal) * 100 : 0;
    const isPositive = changePercent >= 0;
    const lineColor = isPositive ? Colors.profit : Colors.loss;

    // X-axis labels (show ~5)
    const labelCount = Math.min(5, data.length);
    const labelStep = Math.max(1, Math.floor((data.length - 1) / (labelCount - 1)));
    const labelIndices: number[] = [];
    for (let i = 0; i < data.length; i += labelStep) {
        labelIndices.push(i);
    }
    if (!labelIndices.includes(data.length - 1)) {
        labelIndices.push(data.length - 1);
    }

    return (
        <View className="bg-surface rounded-2xl p-5 border border-surface-border mb-5">
            {/* Header */}
            <View className="flex-row justify-between items-start mb-1">
                <Text className="text-txt text-[17px] font-bold">📈 Grafik Investasi</Text>
                <View className="items-end">
                    <Text className="text-txt text-[15px] font-bold">{formatRupiah(lastVal)}</Text>
                    <View
                        className={`flex-row items-center mt-0.5 px-1.5 py-0.5 rounded-md ${isPositive ? 'bg-profit/10' : 'bg-loss/10'
                            }`}
                    >
                        <Text
                            className={`text-[11px] font-bold ${isPositive ? 'text-profit' : 'text-loss'
                                }`}
                        >
                            {isPositive ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
                        </Text>
                    </View>
                </View>
            </View>

            {/* Period Selector */}
            <View className="flex-row bg-surface-el rounded-xl p-1 mb-4 border border-surface-border">
                {PERIODS.map(p => (
                    <TouchableOpacity
                        key={p.key}
                        onPress={() => setPeriod(p.key)}
                        className={`flex-1 py-2 rounded-[9px] items-center ${period === p.key ? 'bg-primary' : ''
                            }`}
                    >
                        <Text
                            className={`text-[12px] font-bold ${period === p.key ? 'text-white' : 'text-txt-muted'
                                }`}
                        >
                            {p.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Chart */}
            <View style={{ alignItems: 'center' }}>
                <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                    <Defs>
                        <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
                            <Stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
                        </LinearGradient>
                    </Defs>

                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
                        const y = PADDING_TOP + drawHeight * (1 - frac);
                        return (
                            <Line
                                key={i}
                                x1={PADDING_LEFT}
                                y1={y}
                                x2={PADDING_LEFT + drawWidth}
                                y2={y}
                                stroke={Colors.surfaceBorder}
                                strokeWidth="1"
                                strokeDasharray="4,4"
                            />
                        );
                    })}

                    {/* Area fill */}
                    <Path d={areaPath} fill="url(#areaGrad)" />

                    {/* Line */}
                    <Path
                        d={linePath}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* End dot */}
                    <Circle
                        cx={points[points.length - 1].x}
                        cy={points[points.length - 1].y}
                        r="4"
                        fill={lineColor}
                    />
                    <Circle
                        cx={points[points.length - 1].x}
                        cy={points[points.length - 1].y}
                        r="7"
                        fill={lineColor}
                        opacity="0.25"
                    />

                    {/* X-axis labels */}
                    {labelIndices.map(idx => (
                        <SvgText
                            key={idx}
                            x={points[idx].x}
                            y={CHART_HEIGHT - 4}
                            fontSize="10"
                            fill={Colors.textMuted}
                            textAnchor="middle"
                        >
                            {data[idx].date}
                        </SvgText>
                    ))}
                </Svg>
            </View>
        </View>
    );
}
