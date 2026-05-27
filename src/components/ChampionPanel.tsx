import {ALL_ROLES, ROLE_COLORS} from "../data/constants";
import type { ChampionDetail, Item } from "../data/constants";
import { useGameData } from "../context/GameDataContext";
import "./ChampionPanel.css";

interface ChampionPanelProps {
    champDetail: ChampionDetail;
    level: number;
    onLevelChange: (level: number) => void;
    selectedRole: string;
    onRoleChange: (role: string) => void;
    build: Item[];
    onRemoveItem: (index: number) => void;
}

export default function ChampionPanel({
    champDetail,
    level,
    onLevelChange,
    selectedRole,
    onRoleChange,
    build,
    onRemoveItem,
} : ChampionPanelProps) {
    const {baseUrl} = useGameData();
    const totalCost = build.reduce((acc, item) => acc + (item.gold?.total || 0), 0);

    return (
        <div className="champion-panel">

            {/* Splash art */}
            <div className="champion-panel_hero">
                <img
                src={`${baseUrl}/img/champion/loading/${champDetail.id}_0.jpg`}
                alt={champDetail.name}
                className="champion-panel_splash"
                />
                <div className="champion-panel_overlay" />
                <div className="champion-panel_heor-info">
                    <div className="champion-panel_name">
                        {champDetail.name}
                    </div>
                    <div className="champion-panel_title">
                        {champDetail.title}
                    </div>
                    <div className="champion-panel_tags">
                        {champDetail.tags?.map((tag) => (
                            <span key={tag} className="champion-panel_tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Role selector */}
            <div className="champion-panel_section">
                <div className="champion-panel_label">
                    Rôle
                </div>
                <div className="champion-panel_roles">
                    {ALL_ROLES.map((role) => {
                        const isActive = selectedRole === role;
                        return (
                            <button
                            key={role}
                            className="champion-panel_role-btn"
                            style={isActive ? {
                                background: ROLE_COLORS[role],
                                borderColor: ROLE_COLORS[role],
                                color: "#0a0a0f",
                                fontWeight: 700,
                            } : {}}
                            onClick={() => onRoleChange(role)}
                            >
                                {role}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Level slider */}
            <div className="champion-panel_section">
                <div className="champion-panel_label">
                    Niveau : <span className="champion-panel_level-num">{level}</span>
                </div>
                <input
                type="range"
                min="1"
                max="18"
                value={level}
                onChange={(e) => onLevelChange(Number(e.target.value))}
                />
                <div className="champion-panel_ticks">
                    {[1, 6, 11, 18].map((n) => (
                        <span 
                        key={n}
                        className="champion-panel_tick">
                            {n}
                        </span>
                    ))}
                </div>
            </div>

            {/* Build slots */}
            <div className="champion-panel_section">
                <div className="champion-panel_label">
                    Build (max 6 objets)
                </div>
                <div className="champion-panel_slots">
                    {Array.from({length: 6}).map((_, i) => {
                        const item = build[i];
                        return (
                            <div
                            key={i}
                            className={`champion-panel_slot ${item ? "champion-panel_clot-filled" : ""}`}
                            onClick={() => item && onRemoveItem(i)}
                            title={item ? `${item.name} - Cliquer pour retirer` : "Vide"}
                            >
                                {item ? (
                                    <img
                                    src={`${baseUrl}/img/item/${item.image.full}`}
                                    alt={item.name}
                                    className="champion-panel_slot-img"
                                    />
                                ) : (
                                    <span className="champion-panel_slot-empty">
                                        +
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {build.length > 0 && (
                    <div className="champion-panel_total-cost">
                        Coût total :{" "}
                        <strong className="champion-panel_gold-num">
                            {totalCost.toLocaleString()} or
                        </strong>
                    </div>
                )}
            </div>
        </div>
    );
}