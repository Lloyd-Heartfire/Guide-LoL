import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { useGameData } from "../context/GameDataContext";
import {ROLE_MAP} from "../data/constants";
import "./Home.css";

export default function Home() {
    const {champions, baseUrl, loading, error} = useGameData();
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const filtered = Object.values(champions).filter((c) => c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="home_centered">
                <div className="home_spinner" />
                <div className="home_loading-text">Chargement des données...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home_centered">
                <div className="home_error-text"> {error} </div>
            </div>
        );
    }

    return (
        <div>
            <div className="home_hero">
                <div className="home_hero-title">
                    <span className="home_hero-accent">01</span> Choisissez votre Champion
                </div>
                <div className="home_hero-sub">
                    {Object.keys(champions).length} champions disponibles. Patch auto-détecté
                </div>
            </div>

            <input
            className="home_search"
            placeholder="Rechercher un champion"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            />

            <div className="home_grid">
                {filtered.map((champ) => (
                    <button
                    key={champ.id}
                    className="home_card"
                    onClick={() => navigate(`/build/${champ.id}`)}
                    >
                        <img 
                        src={`${baseUrl}/img/champion/${champ.image.full}`}
                        alt={champ.name}
                        className="home_thumb"
                        />
                        <div className="home_champ-name">{champ.name}</div>
                        <div className="home_champ-role">
                            {ROLE_MAP[champ.tags?.[0]] || "-"}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}