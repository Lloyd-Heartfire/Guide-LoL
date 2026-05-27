import { STAT_LABELS, calcStat } from "../data/constants";
import type { ChampionDetail, ComputedStats } from "../data/constants";
import "./StatsPanel.css";

interface StatsPanelProps {
    champDetail: ChampionDetail;
    level: number;
    stats: ComputedStats;
}

export default function StatsPanel({champDetail, level, stats}: StatsPanelProps) {
    return (
        <div className="stats-panel">
            {Object.entries(STAT_LABELS).map(([key, meta]) => {
                const value = stats[key];
                if (value === undefined) return null;

                const s = champDetail.stats as Record<string, number>;
                const baseAtLevel = 
                    key === "attackspeed"
                        ? s.attackspeed * (1 + (s.attackspeedperlevel * (level - 1)) / 100)
                        : calcStat(s[key] ?? 0, s[key + "perlevel"] ?? 0, level);

                        const bonus = value - baseAtLevel;
                        const hasBonus = bonus > 0.01;

                        const format = (v: number): string => {
                            if (key === "attackspeed") return v.toFixed(3);
                            if (key === "crit") return Math.round(v * 100) + "%";
                            return String(Math.round(v));
                        };

                        return (
                            <div key={key} className="stats-panel_card">
                                <div className="stats-panel_icon">
                                    {meta.icon}
                                </div>
                                <div className="stats-panel_info">
                                    <div className="stats-panel_label">
                                        {meta.label}
                                    </div>
                                    <div className="stats-panel_value-row">
                                        <span className="stats-panel_value" style={{ color: meta.color }}>
                                            {format(value)}
                                        </span>
                                        {hasBonus && (
                                            <span className="stats-panel_bonus">
                                                +{format(bonus)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="stats-panel_bar">
                                    <div className="stats-panel_bar-fill" style={{ background: meta.color }} />
                                </div>
                            </div>
                        );
            })}
        </div>
    );
}