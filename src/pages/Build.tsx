import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGameData } from "../context/GameDataContext";
import { ROLE_MAP, getComputedStats } from "../data/constants";
import type { ChampionDetail, Item } from "../data/constants";
import ChampionPanel from "../components/ChampionPanel";
import StatsPanel from "../components/StatsPanel";
import ItemsPanel from "../components/ItemsPanel";
import "./Build.css"

type Tab = "stats" | "items";

export default function Build() {
    const {champId} = useParams<{champId: string}>();
    const {baseUrl, items, loading: dataLoading} = useGameData();
    const navigate = useNavigate();
    const [champDetail, setChampDetail] = useState<ChampionDetail | null>(null);
    const [loadingChamp, setLoadingChamp] = useState(true);
    const [level, setLevel] = useState(1);
    const [selectedRole, setSelectedRole] = useState("Mid");
    const [build, setBuild] = useState<Item[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>("stats");

    useEffect(() => {
        if (!baseUrl || !champId) return;
        setLoadingChamp(true);
        fetch(`${baseUrl}/data/fr_FR/champion/${champId}.json`)
            .then((r) => r.json())
            .then((data) => {
                const detail: ChampionDetail = data.data[champId];
                setChampDetail(detail);
                setSelectedRole(ROLE_MAP[detail.tags?.[0]] ?? "Mid");
                setBuild([]);
                setLevel(1);
            })
            .catch(() => navigate("/"))
            .finally(() => setLoadingChamp(false));
    }, [baseUrl, champId, navigate]);

    const handleToggleItem = (item: Item) => {
        const alreadyIn = build.some((b) => b.image?.full === item.image?.full);
        if (alreadyIn) setBuild(build.filter((b) => b.image?.full !== item.image?.full));
        else if (build.length < 6) setBuild([...build, item]); 
    };

    const handleRemoveItem = (index: number) => setBuild(build.filter((_, i) => i !== index));

    const stats = champDetail ? getComputedStats(champDetail, level, build) : {};

    if (dataLoading || loadingChamp) {
        return (
            <div className="build_centered">
                <div className="build_spinner"/>
                <div className="build_loading-text">
                    Chargement du champion...
                </div>
            </div>
        );
    }

    if (!champDetail) return null;

    return (
        <div className="build_layout">
            <ChampionPanel
            champDetail={champDetail}
            level={level}
            onLevelChange={setLevel}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            build={build}
            onRemoveItem={handleRemoveItem}
            />

            <div className="build_right-panel">
                <div className="build_tab-row">
                    {(["stats", "items"] as Tab[]).map((tab) => (
                        <button
                        key={tab}
                        className={`build_tab ${activeTab === tab ? "build_tab-active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                        >
                            {tab === "stats" ? "Statistiques" : "Objets"}
                        </button>
                    ))}
                </div>
                <div className="build_tab-content">
                    {activeTab === "stats" ? (
                        <StatsPanel champDetail={champDetail} level={level} stats={stats}/>
                    ) : (
                        <ItemsPanel items={items} build={build} onToggleItem={handleToggleItem}/>
                    )}
                </div>
            </div>
        </div>
    );
}