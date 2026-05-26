// Import
import {createContext, useContext, useEffect, useState} from "react";
import type {ReactNode} from "react";
import type {ChampionSummary, Item} from "../data/constants";

// Types
interface GameDataContextType {
    version: string;
    baseUrl: string;
    champions: Record<string, ChampionSummary>;
    items: Record<string, Item>;
    loading: boolean;
    error: string | null;
}

// Context
const GameDataContext = createContext<GameDataContextType | null>(null);

// Provider
export function GameDataProvider({children}:{children: ReactNode}) {
    const [version, setVersion] = useState("");
    const [baseUrl, setBaseUrl] = useState("");
    const [champions, setChampions] = useState<Record<string, ChampionSummary>>({});
    const [items, setItems] = useState<Record<string, Item>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                // Step 1 - fetch latest DDragon version automatically
                const versionRes = await fetch(
                    "https://ddragon.leagueoflegends.com/api/versions.json"
                );
                const versions: string[] = await versionRes.json();
                const latestVersion = versions[0];
                const url = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}`;

                setVersion(latestVersion);
                setBaseUrl(url);

                // Step 2 - fetch champions and items in parallel
                const [champData, itemData] = await Promise.all([
                    fetch(`${url}/data/fr_FR/champion.json`).then((r) => r.json()),
                    fetch(`${url}/data/fr_FR/item.json`).then((r) => r.json()),
                ]);

                setChampions(champData.data);

                // Keep only purchasable items on map 11
                const filtered: Record<string, Item> = {};
                Object.entries<Item>(itemData.data).forEach(([id, item]) => {
                    if (
                        item.gold?.purchasable &&
                        item.maps?.["11"] &&
                        !item.consumed &&
                        item.name &&
                        item.image
                    ) {
                        filtered[id] = item;
                    }
                });

                setItems(filtered);
            } catch (err) {
                setError("Impossible de charger les données. Vérifie ce qui cloche avec ta connexion.");
                console.error(err)
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <GameDataContext.Provider value={{version, baseUrl, champions, items, loading, error}}>
            {children}
        </GameDataContext.Provider>
    );
}

// Hook
export function useGameData(): GameDataContextType {
    const ctx = useContext(GameDataContext);
    if (!ctx) {
        throw new Error("useGameData must be used inside <GameDataProvider>");
    }
    return ctx;
}