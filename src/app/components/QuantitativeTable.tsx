"use client";

type Row = {
    method: string;
    usesText: boolean;
    fid: number | string;
    lpips: number | string;
    mse: number | string;
    clip: number | string;
    highlight?: boolean;
};

const fineTuningRows: Row[] = [
    { method: "PowerPaint", usesText: true, fid: 22.81, lpips: 0.1322, mse: 0.0104, clip: 24.15 },
    { method: "LaMa", usesText: false, fid: "0.71", lpips: "0.0012", mse: "0.0001", clip: 24.50 },
    { method: "SD2-Inpaint", usesText: false, fid: 17.93, lpips: 0.1106, mse: 0.0073, clip: 24.06 },
    { method: "SD2-Inpaint-wprompt", usesText: true, fid: 18.01, lpips: 0.1098, mse: 0.0072, clip: 24.32 },
];

const zeroShotRows: Row[] = [
    { method: "CPAM", usesText: false, fid: 29.54, lpips: 0.1564, mse: 0.0138, clip: 24.32 },
    { method: "Attentive Eraser", usesText: false, fid: 118.09, lpips: 0.2567, mse: 0.0270, clip: 24.42 },
    { method: "PANDORA w/o LADG (Ours)", usesText: false, fid: 42.17, lpips: 0.1844, mse: 0.0171, clip: 24.55, highlight: true },
    { method: "PANDORA w/o PAD (Ours)", usesText: false, fid: 35.59, lpips: 0.1702, mse: 0.0156, clip: 24.4, highlight: true },
    { method: "PANDORA (Ours)", usesText: false, fid: 44.98, lpips: 0.1895, mse: 0.0184, clip: "24.57", highlight: true },
];

const toNumber = (v: number | string): number => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : NaN;
};

const allRows: Row[] = [...fineTuningRows, ...zeroShotRows];
const bestValues = {
    fid: Math.min(...allRows.map((r) => toNumber(r.fid))),
    lpips: Math.min(...allRows.map((r) => toNumber(r.lpips))),
    mse: Math.min(...allRows.map((r) => toNumber(r.mse))),
    clip: Math.max(...allRows.map((r) => toNumber(r.clip))),
};

function BoldIfBest({ value, isBest }: { value: number | string; isBest: boolean }) {
    return <span className={isBest ? "font-bold" : undefined}>{value}</span>;
}

function TableSection({ title, rows }: { title: string; rows: Row[] }) {
    return (
        <tbody>
            <tr>
                <td colSpan={6} className="bg-gray-50 text-gray-700 italic text-center py-2">
                    {title}
                </td>
            </tr>
            {rows.map((row) => (
                <tr key={row.method} className={row.highlight ? "bg-yellow-50" : undefined}>
                    <td className="py-3 px-4 font-medium whitespace-nowrap">{row.method}</td>
                    <td className="py-3 px-4 text-center">{row.usesText ? "✔" : "✘"}</td>
                    <td className="py-3 px-4 text-center">
                        <BoldIfBest value={row.fid} isBest={toNumber(row.fid) === bestValues.fid} />
                    </td>
                    <td className="py-3 px-4 text-center">
                        <BoldIfBest value={row.lpips} isBest={toNumber(row.lpips) === bestValues.lpips} />
                    </td>
                    <td className="py-3 px-4 text-center">
                        <BoldIfBest value={row.mse} isBest={toNumber(row.mse) === bestValues.mse} />
                    </td>
                    <td className="py-3 px-4 text-center">
                        <BoldIfBest value={row.clip} isBest={toNumber(row.clip) === bestValues.clip} />
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default function QuantitativeTable() {
    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
                <thead className="bg-gray-100">
                    <tr>
                        <th scope="col" className="py-3 px-4 text-left font-semibold">Method</th>
                        <th scope="col" className="py-3 px-4 text-center font-semibold">Text</th>
                        <th scope="col" className="py-3 px-4 text-center font-semibold">FID↓</th>
                        <th scope="col" className="py-3 px-4 text-center font-semibold">LPIPS↓</th>
                        <th scope="col" className="py-3 px-4 text-center font-semibold">MSE↓</th>
                        <th scope="col" className="py-3 px-4 text-center font-semibold">CLIP score↑</th>
                    </tr>
                </thead>

                <TableSection title="Fine-tuning-based methods" rows={fineTuningRows} />
                <TableSection title="Zero-shot methods (no training required)" rows={zeroShotRows} />
            </table>

            <div className="max-w-4xl mx-auto mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <span>📉</span>
                            <span>Lower is better: <span className="font-medium">FID</span>, <span className="font-medium">LPIPS</span>, <span className="font-medium">MSE</span></span>
                        </div>
                        <div className="hidden sm:block text-blue-300">|</div>
                        <div className="flex items-center justify-center gap-2">
                            <span>📈</span>
                            <span>Higher is better: <span className="font-medium">CLIP score</span></span>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <span>📝</span>
                            <span><span className="font-medium">Text</span> column: <span className="font-semibold">✔</span> uses prompts; <span className="font-semibold">✘</span> no prompts</span>
                        </div>
                        <div className="hidden sm:block text-blue-300">|</div>
                        <div className="flex items-center justify-center gap-2">
                            <span>⭐</span>
                            <span>Bold numbers indicate best across all methods; yellow rows are <span className="font-semibold">Ours</span></span>
                        </div>
                    </div>

                    <p className="mt-3 text-center text-blue-800">
                        Quantitative comparison averaged across all dataset types. PANDORA delivers strong background realism among zero-shot methods while achieving superior object removal quality.
                    </p>
                </div>
            </div>
        </div>
    );
}


