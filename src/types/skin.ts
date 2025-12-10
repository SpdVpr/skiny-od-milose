import { Timestamp } from 'firebase/firestore';

/**
 * Sticker na zbrani
 */
export interface SkinSticker {
  classId: string;
  position: number; // 0-4
  name?: string;
  imageUrl?: string;
}

/**
 * Tag z Steam API (kategorie, zbraň, rarity, atd.)
 */
export interface SkinTag {
  category: string;
  internal_name: string;
  localized_category_name: string;
  localized_tag_name: string;
  color?: string;
}

/**
 * Kompletní skin interface s všemi dostupnými statistikami
 */
export interface Skin {
  // ===== ZÁKLADNÍ ID =====
  assetId: string;
  classId: string;
  instanceId: string;

  // ===== NÁZVY =====
  name: string;
  marketHashName: string;
  marketName?: string;
  type?: string; // "Puška (Zakázaná)", "Pistole (Vojenská)", atd.

  // ===== VIZUÁLNÍ =====
  imageUrl: string;
  iconUrl?: string;
  backgroundColor?: string;
  nameColor?: string; // Barva názvu (např. "#8847ff" pro Covert)
  customScreenshotUrl?: string; // Vlastní screenshot nahraný adminem (skutečný vzhled ve hře)
  csFloatImageUrl?: string; // High-res obrázek z CSFloat API (s přesným floatem, patternem a stickery)
  detailImageUrl?: string; // Další obrázek pro detail produktu (pokud existuje Steam obrázek, zobrazí se jen v detailu; jinak jako náhledový)

  // ===== FLOAT & PATTERN =====
  floatValue?: number; // 0.0 - 1.0 (přesné opotřebení)
  paintSeed?: number; // Pattern index (důležité pro blue gems, fade, atd.)
  paintIndex?: number; // Paint index (ID skinu)
  wear: string; // "Factory New", "Minimal Wear", atd. (lokalizovaný)
  exterior?: string; // "WearCategory0", "WearCategory1", atd. (internal name)
  dopplerPhase?: string; // "Phase 1", "Phase 2", "Ruby", "Sapphire", atd. (pro Doppler skiny)
  phase?: string; // Manuálně zadaná fáze (např. pro Fade, Case Hardened atd.)
  minFloat?: number; // Minimální možný float pro tento skin
  maxFloat?: number; // Maximální možný float pro tento skin

  // ===== KATEGORIZACE =====
  weaponType?: string; // "AK-47", "M4A4", "Karambit", atd.
  category?: string; // "Rifle", "Pistol", "Knife", "Gloves", atd.
  rarity?: string; // "Consumer", "Industrial", "Mil-Spec", "Restricted", "Classified", "Covert", "Contraband"
  rarityColor?: string; // Barva rarity (např. "#8847ff")
  collection?: string; // "Kolekce eSports 2013 Winter", atd.

  // ===== STICKERY & NAMETAG =====
  stickers?: SkinSticker[]; // Pole stickerů (až 5)
  nameTag?: string; // Vlastní jméno zbraně

  // ===== MARKET INFO =====
  tradable: boolean; // Lze tradovat?
  marketable: boolean; // Lze prodat na marketu?
  commodity?: boolean; // Je to stackable item? (např. klíče, kapsle)
  tradeRestrictionDays?: number; // Dny do možnosti tradu
  marketRestrictionDays?: number; // Dny do možnosti prodeje
  tradeRestrictionDate?: string; // Datum, od kdy lze obchodovat (formát: YYYY-MM-DD nebo DD.MM.YYYY)

  // ===== TOURNAMENT =====
  tournament?: string; // "DreamHack Winter 2014", atd.
  tournamentTeam?: string; // "Team Dignitas", atd.

  // ===== POPIS =====
  description?: string; // HTML popis zbraně

  // ===== OSTATNÍ =====
  inspectLink?: string;
  price?: number; // Cena (nastavená adminem)

  // ===== SYSTÉMOVÉ =====
  isVisible: boolean;
  inInventory: boolean;
  updatedAt: Timestamp;
  orderIndex?: number; // Pořadí pro manuální řazení (pokud není vyplněno, řadí se podle data)
}

/**
 * Pomocné funkce pro práci se skiny
 */
export const SkinUtils = {
  /**
   * Vygeneruje URL pro obrázek SE STICKERY pomocí Steam CDN API
   * Steam CDN podporuje composite images - překrytí stickerů přes skin
   */
  getImageWithStickers(skin: Partial<Skin>): string {
    if (!skin.iconUrl) {
      return skin.imageUrl || '';
    }

    // Pokud nemá stickery, vrátíme normální high-res obrázek
    if (!skin.stickers || skin.stickers.length === 0) {
      return this.getHighResImageUrl(skin);
    }

    // Steam CDN composite API:
    // https://steamcommunity.com/economy/image/{base_icon}/330x192?
    // &sticker_0={sticker_classid}&sticker_0_offset_x={x}&sticker_0_offset_y={y}&sticker_0_scale={scale}
    // &sticker_1={sticker_classid}&sticker_1_offset_x={x}&sticker_1_offset_y={y}&sticker_1_scale={scale}
    // atd.

    const baseUrl = `https://steamcommunity.com/economy/image/${skin.iconUrl}/512fx384f`;

    // Pozice stickerů na zbraních (přibližné hodnoty pro různé pozice)
    // Tyto hodnoty jsou experimentální a mohou se lišit podle typu zbraně
    const stickerPositions: Record<number, { x: number; y: number; scale: number }> = {
      0: { x: 50, y: 100, scale: 0.5 },   // Pozice 0
      1: { x: 150, y: 100, scale: 0.5 },  // Pozice 1
      2: { x: 250, y: 100, scale: 0.5 },  // Pozice 2
      3: { x: 350, y: 100, scale: 0.5 },  // Pozice 3
      4: { x: 200, y: 50, scale: 0.4 },   // Pozice 4 (méně častá)
    };

    // Přidáme stickery do URL
    const stickerParams = skin.stickers.map((sticker, index) => {
      const pos = stickerPositions[sticker.position] || stickerPositions[0];
      return `sticker_${index}=${sticker.classId}&sticker_${index}_offset_x=${pos.x}&sticker_${index}_offset_y=${pos.y}&sticker_${index}_scale=${pos.scale}`;
    }).join('&');

    return `${baseUrl}?${stickerParams}`;
  },

  /**
   * Vygeneruje URL pro in-game screenshot (skutečný vzhled s floatem, patternem, stickery)
   * POZNÁMKA: Bohužel Steam API neposkytuje přímý způsob, jak získat screenshot s přesným floatem a stickery
   * Pro skutečný screenshot by bylo potřeba:
   * 1. Vlastní server s CS:GO klientem
   * 2. Placené API služby (csgofloat.com, csgobackpack.net)
   * 3. Steam Web API s autentizací
   *
   * Prozatím vracíme obrázek se stickery pomocí Steam CDN composite API
   */
  getInspectScreenshotUrl(skin: Partial<Skin>): string | null {
    // Pokud má vlastní screenshot, použijeme ten
    if (skin.customScreenshotUrl) {
      return skin.customScreenshotUrl;
    }

    // Jinak vygenerujeme obrázek se stickery
    return this.getImageWithStickers(skin);
  },

  /**
   * Vrátí high-res obrázek skinu (bez stickery, ale vysoká kvalita)
   */
  getHighResImageUrl(skin: Partial<Skin>): string {
    if (skin.iconUrl) {
      // Steam CDN high-res verze
      return `https://steamcommunity.com/economy/image/${skin.iconUrl}/512fx512f`;
    }
    if (skin.imageUrl) {
      return skin.imageUrl;
    }
    // Fallback placeholder pro manuálně přidané skiny bez obrázku
    return 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5-OOqhNQhscxPDDKJXSO4F-g3oWnRh7dd2DdG34bpTeQW-tIHBYuIqZd1JGpLYXqWGZVz-vEo-0qRYfJaIoHu5jRq5aWZfWxDo-WoHnuXSo-FehA/512fx512f';
  },

  /**
   * Vrátí nejlepší dostupný obrázek skinu pro NÁHLED (karty, grid)
   * Logika:
   * - Pokud existuje Steam obrázek (iconUrl/imageUrl) → použije se Steam obrázek
   * - Pokud NEEXISTUJE Steam obrázek → použije se detailImageUrl (pokud existuje)
   * - Fallback: customScreenshotUrl nebo placeholder
   */
  getBestImageUrl(skin: Partial<Skin>): string {
    // Pokud má Steam obrázek (z importu), použijeme ho
    if (skin.iconUrl || (skin.imageUrl && skin.imageUrl.includes('steamcommunity.com'))) {
      // 1. Priorita: Vlastní screenshot nahraný adminem (skutečný in-game screenshot)
      if (skin.customScreenshotUrl) {
        return skin.customScreenshotUrl;
      }

      // 2. Priorita: Steam CDN composite image se stickery (pokud má stickery)
      if (skin.stickers && skin.stickers.length > 0) {
        return this.getImageWithStickers(skin);
      }

      // 3. Steam high-res obrázek
      return this.getHighResImageUrl(skin);
    }

    // Pokud NEMÁ Steam obrázek → použijeme customScreenshotUrl jako náhledový
    if (skin.customScreenshotUrl) {
      return skin.customScreenshotUrl;
    }

    // Fallback: detailImageUrl nebo placeholder
    if (skin.detailImageUrl) {
      return skin.detailImageUrl;
    }

    return this.getHighResImageUrl(skin);
  },

  /**
   * Zavolá CSFloat API a získá detailní informace o skinu
   * POZNÁMKA: CSFloat API má CORS ochranu, takže musíme použít naši API route jako proxy
   * @param inspectLink Steam inspect link
   * @returns CSFloat data nebo null při chybě
   */
  async fetchCSFloatData(inspectLink: string): Promise<any | null> {
    try {
      // Voláme přes naši API route, která funguje jako proxy
      const response = await fetch(`/api/csfloat?inspectLink=${encodeURIComponent(inspectLink)}`);

      if (!response.ok) {
        console.error('❌ [CSFloat] API error:', response.status);
        return null;
      }

      const result = await response.json();

      if (!result.success) {
        console.error('❌ [CSFloat] Failed:', result.error);
        return null;
      }

      return {
        imageUrl: result.data.imageUrl,
        floatValue: result.data.floatValue,
        paintSeed: result.data.paintSeed,
        paintIndex: result.data.paintIndex,
        dopplerPhase: result.data.dopplerPhase,
        minFloat: result.data.minFloat,
        maxFloat: result.data.maxFloat,
      };
    } catch (error) {
      console.error('❌ [CSFloat] Exception:', error);
      return null;
    }
  },

  /**
   * Získá barvu podle rarity
   */
  getRarityColor(rarity?: string): string {
    const colors: Record<string, string> = {
      'Consumer': '#b0c3d9',
      'Industrial': '#5e98d9',
      'Mil-Spec': '#4b69ff',
      'Restricted': '#8847ff',
      'Classified': '#d32ce6',
      'Covert': '#eb4b4b',
      'Contraband': '#e4ae39',
    };
    return rarity ? colors[rarity] || '#b0c3d9' : '#b0c3d9';
  },

  /**
   * Formátuje float value na čitelný string
   */
  formatFloat(floatValue?: number): string {
    if (!floatValue) return 'N/A';
    // Truncate to 4 decimal places without rounding
    const floatStr = floatValue.toString();
    const decimalIndex = floatStr.indexOf('.');
    return decimalIndex === -1 ? floatStr : floatStr.slice(0, decimalIndex + 5);
  },

  /**
   * Získá wear range pro daný exterior
   */
  getWearRange(exterior?: string): string {
    const ranges: Record<string, string> = {
      'WearCategory0': '0.00 - 0.07', // Factory New
      'WearCategory1': '0.07 - 0.15', // Minimal Wear
      'WearCategory2': '0.15 - 0.38', // Field-Tested
      'WearCategory3': '0.38 - 0.45', // Well-Worn
      'WearCategory4': '0.45 - 1.00', // Battle-Scarred
    };
    return exterior ? ranges[exterior] || 'N/A' : 'N/A';
  },

  /**
   * Zjistí, jestli je float value dobrý (nízký) pro daný exterior
   */
  isGoodFloat(floatValue?: number, exterior?: string): boolean {
    if (!floatValue || !exterior) return false;

    const thresholds: Record<string, number> = {
      'WearCategory0': 0.03, // FN < 0.03 je dobrý
      'WearCategory1': 0.10, // MW < 0.10 je dobrý
      'WearCategory2': 0.20, // FT < 0.20 je dobrý
      'WearCategory3': 0.40, // WW < 0.40 je dobrý
      'WearCategory4': 0.60, // BS < 0.60 je dobrý
    };

    return floatValue < (thresholds[exterior] || 1.0);
  },

  /**
   * Přeloží wear (opotřebení) z angličtiny do češtiny
   */
  translateWear(wear?: string): string {
    if (!wear) return 'N/A';

    const translations: Record<string, string> = {
      'Factory New': 'Zbrusu nový',
      'Minimal Wear': 'Lehce opotřebený',
      'Field-Tested': 'Opotřebený',
      'Well-Worn': 'Silně opotřebený',
      'Battle-Scarred': 'Poničený bojem',
    };

    return translations[wear] || wear;
  },

  /**
   * Získá výchozí rarity pro manuálně založené produkty
   */
  getDefaultRarity(): string {
    return 'Classified'; // Výchozí rarity pro manuální produkty
  }
};

