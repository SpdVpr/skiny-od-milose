import { NextResponse } from 'next/server';

/**
 * CSFloat API Proxy
 * Funguje jako proxy pro CSFloat API, aby se obešla CORS ochrana
 *
 * POZNÁMKA: CSFloat API není oficiálně veřejné a může být rate-limited
 * Pro produkční použití doporučujeme self-host CSFloat Inspect API
 *
 * Použití: GET /api/csfloat?inspectLink=steam://rungame/730/...
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        let inspectLink = searchParams.get('inspectLink');

        if (!inspectLink) {
            return NextResponse.json(
                { success: false, error: 'Missing inspectLink parameter' },
                { status: 400 }
            );
        }

        console.log('🔍 [CSFloat Proxy] Raw inspect link:', inspectLink);

        // Dekódujeme inspect link
        inspectLink = decodeURIComponent(inspectLink);

        console.log('🔍 [CSFloat Proxy] Decoded:', inspectLink);

        // Voláme CSFloat API s headers, které simulují browser
        const csFloatUrl = `https://api.csfloat.com/?url=${encodeURIComponent(inspectLink)}`;

        console.log('🔍 [CSFloat Proxy] Calling:', csFloatUrl);

        const response = await fetch(csFloatUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://csfloat.com/',
                'Origin': 'https://csfloat.com'
            }
        });

        if (!response.ok) {
            console.error('❌ [CSFloat Proxy] Error:', response.status);
            const errorText = await response.text();
            console.error('❌ [CSFloat Proxy] Error body:', errorText);
            return NextResponse.json(
                { success: false, error: `CSFloat API nedostupné (${response.status}). Zkuste to později nebo použijte self-hosted řešení.` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ [CSFloat Proxy] Data received');

        // CSFloat API vrací data v iteminfo objektu
        const iteminfo = data.iteminfo || data;

        // CSFloat API nevrací render obrázky, pouze inspect data
        // Použijeme Steam CDN high-res obrázek
        const steamImageUrl = iteminfo.imageurl;

        console.log('🎨 [CSFloat Proxy] Steam Image URL:', steamImageUrl);

        // Extrahujeme důležitá data
        const result = {
            success: true,
            data: {
                floatValue: iteminfo.floatvalue,
                paintSeed: iteminfo.paintseed,
                paintIndex: iteminfo.paintindex,
                defIndex: iteminfo.defindex,

                // Steam CDN high-res obrázek (CSFloat API nevrací render obrázky)
                // Pro skutečný in-game render se stickery použijeme SkinImageWithStickers komponentu
                imageUrl: steamImageUrl,

                // Stickery s detaily
                stickers: iteminfo.stickers?.map((sticker: any) => ({
                    slot: sticker.slot,
                    stickerId: sticker.stickerId,
                    wear: sticker.wear,
                    scale: sticker.scale,
                    rotation: sticker.rotation,
                    name: sticker.name,
                    codename: sticker.codename,
                    material: sticker.material
                })) || [],

                // Doppler phase (pokud je to doppler)
                dopplerPhase: iteminfo.phase,

                // Wear rating
                wearName: iteminfo.wear_name,

                // Skin name
                fullItemName: iteminfo.full_item_name,
                itemName: iteminfo.item_name,
                weaponType: iteminfo.weapon_type,

                // Rarity
                rarity: iteminfo.rarity,
                rarityName: iteminfo.rarity_name,
                rarityColor: iteminfo.rarity_color,

                // Min/Max float pro tento skin
                minFloat: iteminfo.min,
                maxFloat: iteminfo.max,
            }
        };

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('❌ [CSFloat API] Exception:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

