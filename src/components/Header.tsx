import {useLocation, useNavigate, Link} from "react-router-dom";
import {useGameData} from "../context/GameDataContext";
import "./Header.css";

// Navigation items (add new pages here)
const NAV_ITEMS = [
    {label: "Accueil", path:"/"},
    {label: "Build", path:"/build"},
    {label: "Synergies", path:"/synergies"},
    {label: "Dégâts", path:"/damage"},
    {label: "Duel 1v1", path:"/duel"},
    {label: "Historique", path:"/history"},
    {label: "Comparateur", path:"/comparator"},
    {label: "Draft", path:"/draft"},
];

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const {version} = useGameData();

    const isActive = (path: string) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    return(
        <header className="header">
            <div className="header_inner">

                <Link to="/" className="header_logo">
                    <span className="header_logo-icon">⚔</span>
                    <div>
                        <div className="header_logo-title"> BUILD SIMULATOR</div>
                        <div className="header_logo-sub">League of Legends
                            {version && (
                                <span className="header_patch-badge">Patch {version}</span>
                            )}
                        </div>
                    </div>
                </Link>

                <nav className="header_nav">
                    {NAV_ITEMS.map((item) => (
                        <button
                        key={item.path}
                        className={`header_nav-btn ${isActive(item.path) ? "header_nav-btn-active" : ""}`}
                        onClick={() => navigate(item.path)}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
}