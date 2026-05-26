// Import URL Data LoL
export const VERSIONS_URL = "https://ddragon.leagueoflegends.com/api/versions.json";

// Types
export interface ChampionSummary {
    id: string;
    name: string;
    title: string;
    tags: string[];
    image: {full: string};
}

export interface ChampionStats {
    hp : number; hpperlevel: number;
    mp: number; mpperlevel: number;
    attackdamage: number; attackdamagelevel: number;
    attackspeed: number; attackspeedlevel: number;
    armor: number; armorperlevel: number;
    spellblock: number; spellblockperlevel: number;
    movespeed: number;
    crit: number; critperlevel: number;
}

export interface ChampionDetail {
    id: string;
    name: string;
    title: string;
    tags: string[];
    image: {full: string};
    stats: ChampionStats
}

export interface ItemGold{
    total: number;
    purchasable: boolean;
}

export interface Item {
    name: string;
    image: {full: string};
    gold: ItemGold;
    stats: Record<string, number>;
    maps: Record<string, boolean>;
    consumed?: boolean;
}

export type ComputedStats = Record<string, number>;

// Roles
export const ROLE_MAP: Record<string, string> = {
    Fighter: "Top",
    Tank: "Top",
    Mage: "Mid",
    Assassin: "Mid",
    Marksman: "ADC",
    Support: "Support",
};

export const ALL_ROLES = ["Top", "Jungle", "Mid", "ADC", "Support"];

export const ROLE_COLORS: Record<string, string> = {
    Top: "#e8a838",
    Jungle: "#56a76b",
    Mid: "#9b6bcc",
    ADC: "#cc4444",
    Support: "#4a8fcc",
};

// Stats display config
export interface StatMeta {
    label: string;
    icon: string;
    color: string;
}

export const STAT_LABELS: Record<string, StatMeta> = {
    hp: {label: "Points de vie", icon: "", color: "#e84040"},
    mp: {label: "Mana", icon: "", color: "#4a8fcc"},
    attackdamage: {label: "Dégâts d'attaque", icon: "", color: "#e8a838"},
    attackspeed: {label: "Vitesse d'attaque", icon: "", color: "#f0e040"},
    armor: {label: "Armure", icon: "", color: "#a0a0b0"},
    spellblock: {label: "Résistance magique", icon: "", color: "#9b6bcc"},
    movespeed: {label: "Vitesse de déplacement", icon: "", color: "#56d4a0"},
    crit: {label: "Chance de coup critique", icon: "", color: "#ff8c00"},
};

// Item stat keys
export const ITEM_STAT_MAP: Record<string, string> = {
    FlatHPPoolMod: "hp",
    FlatMPPoolMod: "mp",
    FlatPhysicalDamageMod: "attackdamage",
    FlatArmorMod: "armor",
    FlatSpellBlockMod: "spellblock",
    FlatCritChanceMod: "crit",
    FlatMovementSpeedMod: "movespeed",
    PercentAttackSpeedMod: "attackspeed",
};

// Calcul function

// Champion stat calcul
export function calcStat(base: number, growth: number, level: number): number {
    if (!growth) return base;
    return base + growth * (level - 1) * (0.7025 + 0.0175 * (level - 1));
}

// All final stat compilation at a given level with a given build
export function getComputedStats(
    champDetail: ChampionDetail,
    level: number,
    build: Item[]
): ComputedStats {
    const s = champDetail.stats;

    const stats: ComputedStats = {
        hp: calcStat(s.hp, s.hpperlevel, level),
        mp: calcStat(s.mp, s.mpperlevel, level),
        attackdamage: calcStat(s.attackdamage, s.attackdamagelevel, level),
        attackspeed: s.attackspeed * (1 + (s.attackspeedlevel * (level - 1)) / 100),
        armor: calcStat(s.armor, s.armorperlevel, level),
        spellblock: calcStat(s.spellblock, s.spellblockperlevel, level),
        movespeed: s.movespeed,
        crit: 0,
    };

    // Add percentage bonuses from each item
    build.forEach((item) => {
        if (!item.stats) return;
        Object.entries(item.stats).forEach(([key, val]) => {
            const stat = ITEM_STAT_MAP[key];
            if (stat && stats[stat] !== undefined) {
                if (stat === "attackspeed") stats[stat] += stats[stat] * val;
                else stats[stat] += val;
            }
        });
    });

    return stats;
}