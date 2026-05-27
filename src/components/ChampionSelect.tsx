import { useState } from "react";
import { useGameData } from "../context/GameDataContext";
import { ROLE_MAP } from "../data/constants";
import type { ChampionSummary } from "../data/constants";
import "./ChampionSelect.css";

interface ChampionSelectProps {
    onSelect: (champ: ChampionSummary) => void;
    title?: string;
}

export default function ChampionSelect({onSelect, title}: ChampionSelectProps) {
    const {champions, baseUrl} = useGameData();
    const [search, setSearch] = useState("");

    const filtered = Object.values(champions).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            {title && <div className="champion-select_title">{title}</div>}

            <input
            className="champion-select_search"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />

            <div className="champion-select_grid">
                {filtered.map((champ) => (
                    <button
                    key={champ.id}
                    className="champion-select_card"
                    onClick={() => onSelect(champ)}
                    >
                        <img
                        src={`${baseUrl}/img/champion/${champ.image.full}`}
                        alt={champ.name}
                        className="champion-select_thumb"
                        />
                        <div className="champion-select_name">
                            {champ.name}
                        </div>
                        <div className="champion-select_role">
                            {ROLE_MAP[champ.tags?.[0]] || "-"}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}