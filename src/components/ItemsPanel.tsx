import { useState } from "react";
import type { Item } from "../data/constants";
import { useGameData } from "../context/GameDataContext";
import "./ItemsPanel.css";

interface ItemsPanelProps {
    items: Record<string, Item>;
    build: Item[];
    onToggleItem: (item: Item) => void;
}

export default function ItemsPanel({items, build, onToggleItem}: ItemsPanelProps) {
    const {baseUrl} = useGameData();
    const [search, setSearch] = useState("");

    const filtered = Object.entries(items).filter(([, item]) => item.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <input
            className="items-panel_search"
            placeholder="Rechercher un objet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />

            <div className="items-panel_grid">
                {filtered.slice(0, 120).map(([id, item]) => {
                    const inBuild = build.some((b) => b.image?. full === item.image?.full);
                    const isFull = build.length >= 6 && !inBuild;

                    return (
                        <button
                        key={id}
                        className={["items-panel_card",
                            inBuild ? "items-panel_card-active" : "",
                            isFull ? "items-panel_card-disabled" : "",
                        ].join(" ")}
                        disabled={isFull}
                        onClick={() => onToggleItem(item)}
                        title={`${item.name}\n${item.gold?.total || 0} or `}
                        >
                            <img
                            src={`${baseUrl}/img/item/${item.image.full}`}
                            alt={item.name}
                            className="items-panel_img"
                            />
                            <div className="items-panel_name">
                                {item.name}
                            </div>
                            <div className="items-panel_cost">
                                {item.gold?.total || 0}
                            </div>
                            {inBuild && <div className="items-panel_check">✓</div>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}