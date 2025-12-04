import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';

// TODO: Move to environment variable
const STEAM_ID = process.env.STEAM_ID || '76561198085719073'; // Miloš's ID

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const steamId = searchParams.get('steamId') || STEAM_ID;

        // Steam blokuje server-side požadavky, použijeme CORS proxy
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const steamUrl = `https://steamcommunity.com/inventory/${steamId}/730/2?l=english&count=5000`;

        const response = await fetch(
            `${corsProxy}${encodeURIComponent(steamUrl)}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Steam API error:', response.status, errorText);
            throw new Error(`Steam API responded with ${response.status}: ${errorText.substring(0, 100)}`);
        }

        const responseText = await response.text();
        console.log('Response from proxy (first 200 chars):', responseText.substring(0, 200));

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            throw new Error('Invalid JSON response from Steam API');
        }

        if (!data || !data.assets || !data.descriptions) {
            console.error('Invalid data structure:', data);
            return NextResponse.json({ success: true, count: 0, message: "No items found or invalid response" });
        }

        const assets = data.assets;
        const descriptions = data.descriptions;

        const descriptionMap = new Map();
        descriptions.forEach((desc: any) => {
            const key = `${desc.classid}_${desc.instanceid}`;
            descriptionMap.set(key, desc);
        });

        const batchPromises = assets.map(async (asset: any) => {
            const key = `${asset.classid}_${asset.instanceid}`;
            const desc = descriptionMap.get(key);

            if (!desc) return null;

            const skinData = {
                assetId: asset.assetid,
                classId: asset.classid,
                instanceId: asset.instanceid,
                name: desc.market_name || desc.name,
                marketHashName: desc.market_hash_name,
                wear: desc.tags?.find((t: any) => t.category === 'Exterior')?.name || 'Unknown',
                imageUrl: `https://community.cloudflare.steamstatic.com/economy/image/${desc.icon_url}`,
                inspectLink: desc.actions?.[0]?.link?.replace('%owner_steamid%', steamId).replace('%assetid%', asset.assetid),
                inInventory: true,
                updatedAt: Timestamp.now(),
            };

            await setDoc(doc(db, 'skins', asset.assetid), skinData, { merge: true });
            return skinData;
        });

        await Promise.all(batchPromises);

        return NextResponse.json({
            success: true,
            count: assets.length,
            message: `Synced ${assets.length} items`
        });

    } catch (error: any) {
        console.error('Inventory sync error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
