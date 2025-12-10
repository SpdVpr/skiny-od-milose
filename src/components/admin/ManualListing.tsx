'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Search, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Skin, SkinSticker, SkinUtils } from '@/types/skin';
import { POPULAR_STICKERS, searchStickers, StickerData } from '@/data/stickers';

// Mapování opotřebení
const WEAR_OPTIONS = [
  { value: 'Factory New', internal: 'WearCategory0', label: 'Factory New (Zbrusu nový)' },
  { value: 'Minimal Wear', internal: 'WearCategory1', label: 'Minimal Wear (Lehce opotřebený)' },
  { value: 'Field-Tested', internal: 'WearCategory2', label: 'Field-Tested (Opotřebený)' },
  { value: 'Well-Worn', internal: 'WearCategory3', label: 'Well-Worn (Silně opotřebený)' },
  { value: 'Battle-Scarred', internal: 'WearCategory4', label: 'Battle-Scarred (Poničený bojem)' },
];

const RARITY_OPTIONS = [
  { value: 'Consumer', label: 'Consumer Grade (Běžná)', color: 'b0c3d9' },
  { value: 'Industrial', label: 'Industrial Grade (Průmyslová)', color: '5e98d9' },
  { value: 'Mil-Spec', label: 'Mil-Spec (Vojenská)', color: '4b69ff' },
  { value: 'Restricted', label: 'Restricted (Zakázaná)', color: '8847ff' },
  { value: 'Classified', label: 'Classified (Důvěrná)', color: 'd32ce6' },
  { value: 'Covert', label: 'Covert (Tajná)', color: 'eb4b4b' },
  { value: 'Contraband', label: 'Contraband (Pašovaná)', color: 'e4ae39' },
];

// Kategorie zbraní
const CATEGORY_OPTIONS = [
  { value: 'rifle', label: '🔫 Pušky (Rifle)' },
  { value: 'pistol', label: '🔫 Pistole (Pistol)' },
  { value: 'sniper', label: '🎯 Sniper' },
  { value: 'smg', label: '💨 SMG' },
  { value: 'knife', label: '🔪 Nože (Knife)' },
  { value: 'gloves', label: '🧤 Rukavice (Gloves)' },
  { value: 'other', label: '📦 Ostatní' },
];

// Helper funkce pro odstranění undefined hodnot
function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

interface StickerInput {
  position: number;
  classId: string;
  name: string;
}

export default function ManualListing() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form state
  // const [weaponName, setWeaponName] = useState(''); // REPLACED
  const [weaponType, setWeaponType] = useState('');
  const [skinName, setSkinName] = useState('');
  const [wear, setWear] = useState('Field-Tested');
  const [patternSeed, setPatternSeed] = useState('');
  const [phase, setPhase] = useState('');
  const [floatValue, setFloatValue] = useState('');
  const [price, setPrice] = useState('');
  const [isStatTrak, setIsStatTrak] = useState(false);
  const [category, setCategory] = useState('rifle');
  const [rarity, setRarity] = useState('Classified');
  const [inspectLink, setInspectLink] = useState('');
  const [stickers, setStickers] = useState<StickerInput[]>([]);
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detailImage, setDetailImage] = useState<File | null>(null);
  const [detailImagePreview, setDetailImagePreview] = useState<string | null>(null);

  // Market info state
  const [tradable, setTradable] = useState(true);
  const [marketable, setMarketable] = useState(true);
  const [tradeRestrictionDate, setTradeRestrictionDate] = useState('');

  // Sticker search
  const [stickerSearchQuery, setStickerSearchQuery] = useState<string[]>([]);
  const [showStickerDropdown, setShowStickerDropdown] = useState<number | null>(null);

  // Zavřít dropdown při kliknutí mimo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStickerDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddSticker = () => {
    if (stickers.length >= 5) {
      toast.error('Maximálně 5 stickerů!');
      return;
    }
    setStickers([...stickers, { position: stickers.length, classId: '', name: '' }]);
    setStickerSearchQuery([...stickerSearchQuery, '']);
  };

  const handleRemoveSticker = (index: number) => {
    setStickers(stickers.filter((_, i) => i !== index));
    setStickerSearchQuery(stickerSearchQuery.filter((_, i) => i !== index));
  };

  const handleStickerChange = (index: number, field: 'classId' | 'name', value: string) => {
    const updated = [...stickers];
    updated[index][field] = value;
    setStickers(updated);
  };

  const handleSelectSticker = (index: number, sticker: StickerData) => {
    const updated = [...stickers];
    updated[index] = {
      position: index,
      classId: sticker.classId,
      name: sticker.name,
    };
    setStickers(updated);

    const updatedQuery = [...stickerSearchQuery];
    updatedQuery[index] = sticker.name;
    setStickerSearchQuery(updatedQuery);

    setShowStickerDropdown(null);
  };

  const handleStickerSearchChange = (index: number, value: string) => {
    const updatedQuery = [...stickerSearchQuery];
    updatedQuery[index] = value;
    setStickerSearchQuery(updatedQuery);
    setShowStickerDropdown(index);
  };

  // Funkce pro resize obrázku
  const resizeImage = (file: File, maxWidth: number = 1200): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Zmenšíme pouze pokud je obrázek větší než maxWidth
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            'image/jpeg',
            0.9 // Kvalita 90%
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Handler pro výběr obrázku
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validace
    if (!file.type.startsWith('image/')) {
      toast.error('Prosím vyberte obrázek');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Obrázek je příliš velký (max 10MB)');
      return;
    }

    setCustomImage(file);

    // Vytvoříme preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handler pro výběr detail obrázku
  const handleDetailImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validace
    if (!file.type.startsWith('image/')) {
      toast.error('Prosím vyberte obrázek');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Obrázek je příliš velký (max 10MB)');
      return;
    }

    setDetailImage(file);

    // Vytvoříme preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setDetailImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validace
    if (!weaponType.trim()) {
      toast.error('Zadejte typ zbraně!');
      return;
    }
    if (!skinName.trim()) {
      toast.error('Zadejte název skinu!');
      return;
    }
    if (!patternSeed.trim()) {
      toast.error('Zadejte Pattern Seed!');
      return;
    }

    setIsSubmitting(true);

    try {
      toast.loading('Vytvářím produkt...');

      // Vytvoříme market hash name
      const prefix = isStatTrak ? 'StatTrak™ ' : '';
      const fullName = `${weaponType.trim()} | ${skinName.trim()}`;
      const marketHashName = `${prefix}${fullName} (${wear})`;

      // Vygenerujeme assetId (timestamp + random)
      const assetId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Připravíme stickery
      const skinStickers: SkinSticker[] = stickers
        .filter(s => s.classId.trim() && s.name.trim())
        .map(s => ({
          classId: s.classId,
          position: s.position,
          name: s.name,
          imageUrl: `https://steamcommunity.com/economy/image/class/730/${s.classId}/96fx96f`,
        }));

      // Upload vlastního obrázku (pokud byl vybrán)
      let customScreenshotUrl: string | undefined = undefined;
      if (customImage) {
        try {
          toast.dismiss();
          toast.loading('Nahrávám a optimalizuji obrázek...');

          // Zmenšíme obrázek
          const resizedBlob = await resizeImage(customImage, 1200);

          // Upload do Firebase Storage
          const storageRef = ref(storage, `skins/${assetId}/screenshot.jpg`);
          await uploadBytes(storageRef, resizedBlob);

          // Získáme URL
          customScreenshotUrl = await getDownloadURL(storageRef);
          console.log('✅ Obrázek úspěšně nahrán:', customScreenshotUrl);
        } catch (error) {
          console.error('❌ Chyba při nahrávání obrázku:', error);
          toast.dismiss();
          toast.error('Nepodařilo se nahrát obrázek, ale skin bude přidán');
        }
      }

      // Upload detail obrázku (pokud byl vybrán)
      let detailImageUrl: string | undefined = undefined;
      if (detailImage) {
        try {
          toast.dismiss();
          toast.loading('Nahrávám detail obrázek...');

          // Zmenšíme obrázek
          const resizedBlob = await resizeImage(detailImage, 1200);

          // Upload do Firebase Storage
          const storageRef = ref(storage, `skins/${assetId}/detail.jpg`);
          await uploadBytes(storageRef, resizedBlob);

          // Získáme URL
          detailImageUrl = await getDownloadURL(storageRef);
          console.log('✅ Detail obrázek úspěšně nahrán:', detailImageUrl);
        } catch (error) {
          console.error('❌ Chyba při nahrávání detail obrázku:', error);
          toast.dismiss();
          toast.error('Nepodařilo se nahrát detail obrázek, ale skin bude přidán');
        }
      }

      // Vytvoříme skin objekt
      const skinData: Partial<Skin> = {
        assetId,
        classId: 'manual',
        instanceId: 'manual',

        // Názvy
        name: marketHashName,
        marketHashName: marketHashName,
        marketName: marketHashName,
        type: 'Zbraň',

        // Vizuální
        imageUrl: '',
        iconUrl: '',
        nameColor: RARITY_OPTIONS.find(r => r.value === rarity)?.color || 'd32ce6',
        rarityColor: RARITY_OPTIONS.find(r => r.value === rarity)?.color || 'd32ce6',
        customScreenshotUrl: customScreenshotUrl,
        detailImageUrl: detailImageUrl,

        // Float & Pattern
        floatValue: floatValue ? parseFloat(floatValue) : undefined,
        paintSeed: parseInt(patternSeed),
        wear: wear,
        exterior: WEAR_OPTIONS.find(w => w.value === wear)?.internal,
        phase: phase.trim() || undefined,

        // Kategorizace
        weaponType: weaponType.trim(),
        category: category, // Uživatelem vybraná kategorie
        rarity: rarity,

        // Stickery
        stickers: skinStickers.length > 0 ? skinStickers : undefined,

        // Market info
        tradable: tradable,
        marketable: marketable,
        tradeRestrictionDate: tradeRestrictionDate.trim() || undefined,

        // Cena (volitelná)
        price: price.trim() ? parseFloat(price) : undefined,

        // Inspect link
        inspectLink: inspectLink.trim() || undefined,

        // Systémové
        isVisible: false, // Defaultně skryté
        inInventory: true, // Manuálně přidané - dostupné na skladě
        updatedAt: Timestamp.now(),
      };

      // Odstraníme undefined hodnoty
      const cleanedData = removeUndefined(skinData);

      // Uložíme do Firebase
      await setDoc(doc(db, 'skins', assetId), cleanedData);

      toast.dismiss();
      toast.success('Skin úspěšně přidán!');

      // Reset formuláře
      setWeaponType('');
      setSkinName('');
      setWear('Field-Tested');
      setPatternSeed('');
      setPhase('');
      setFloatValue('');
      setPrice('');
      setIsStatTrak(false);
      setCategory('rifle');
      setRarity('Classified');
      setInspectLink('');
      setStickers([]);
      setCustomImage(null);
      setImagePreview(null);
      setDetailImage(null);
      setDetailImagePreview(null);
      setShowModal(false);

      // Reload stránky
      setTimeout(() => window.location.reload(), 1000);

    } catch (error: any) {
      toast.dismiss();
      toast.error(`Chyba: ${error.message}`);
      console.error('Manual listing error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Manuální přidání
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d29] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Manuální přidání skinu</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Název zbraně - Split into two fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Typ zbraně *
                    </label>
                    <input
                      type="text"
                      value={weaponType}
                      onChange={(e) => setWeaponType(e.target.value)}
                      placeholder="např. AK-47"
                      className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Název skinu *
                    </label>
                    <input
                      type="text"
                      value={skinName}
                      onChange={(e) => setSkinName(e.target.value)}
                      placeholder="např. Redline"
                      className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 -mt-2">
                  Výsledek bude: "{weaponType} | {skinName}"
                </p>

                {/* StatTrak checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="statTrak"
                    checked={isStatTrak}
                    onChange={(e) => setIsStatTrak(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-[#0f1117] text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="statTrak" className="text-sm text-gray-300">
                    StatTrak™
                  </label>
                </div>

                {/* Opotřebení */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Opotřebení *
                  </label>
                  <select
                    value={wear}
                    onChange={(e) => setWear(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    {WEAR_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kategorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kategorie *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    {CATEGORY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rarita */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rarita (Vzácnost) *
                  </label>
                  <select
                    value={rarity}
                    onChange={(e) => setRarity(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    {RARITY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value} style={{ color: `#${option.color}` }}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pattern Seed */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pattern Seed (Číslo šablony vzoru) *
                  </label>
                  <input
                    type="number"
                    value={patternSeed}
                    onChange={(e) => setPatternSeed(e.target.value)}
                    placeholder="např. 661"
                    className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Phase */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phase (Fáze)
                  </label>
                  <input
                    type="text"
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    placeholder="např. Phase 4, 95% Fade"
                    className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Volitelné - pro Doppler, Fade, Case Hardened apod.
                  </p>
                </div>


                {/* Float Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Float (Opotřebení)
                  </label>
                  <input
                    type="text"
                    value={floatValue}
                    onChange={(e) => setFloatValue(e.target.value)}
                    placeholder="např. 0.173908353"
                    className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Volitelné - přesná hodnota opotřebení (0.00 - 1.00). Můžete zadat i dlouhé číslo ze Steamu.
                  </p>
                </div>

                {/* Cena */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cena (Kč)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="např. 5000 (volitelné - pokud nevyplníte, zobrazí se 'na dotaz')"
                    className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Volitelné - pokud nevyplníte, zobrazí se "na dotaz"
                  </p>
                </div>

                {/* Inspect Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Inspect Link (Odkaz na prohlédnutí ve hře)
                  </label>
                  <input
                    type="text"
                    value={inspectLink}
                    onChange={(e) => setInspectLink(e.target.value)}
                    placeholder="steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20..."
                    className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Volitelné - odkaz pro prohlédnutí skinu přímo ve hře
                  </p>
                </div>

                {/* Upload vlastního obrázku */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vlastní fotka produktu (volitelné)
                  </label>
                  <div className="space-y-3">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCustomImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-[#0f1117]">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-500 mb-2" />
                          <p className="text-sm text-gray-400">
                            <span className="font-semibold">Klikněte pro nahrání</span> nebo přetáhněte
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG (max 10MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                    <p className="text-xs text-gray-500">
                      Obrázek bude automaticky zmenšen na optimální velikost (max 1200px šířka)
                    </p>
                  </div>
                </div>

                {/* Upload detail obrázku */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Detail obrázek (volitelné)
                  </label>
                  <div className="space-y-3">
                    {detailImagePreview ? (
                      <div className="relative">
                        <img
                          src={detailImagePreview}
                          alt="Detail Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setDetailImage(null);
                            setDetailImagePreview(null);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-[#0f1117]">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                          <p className="text-sm text-gray-400">
                            <span className="font-semibold">Klikněte pro nahrání</span> nebo přetáhněte
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG (max 10MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDetailImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                    <p className="text-xs text-gray-500">
                      Pokud existuje Steam obrázek, tento se zobrazí jen v detailu. Jinak jako náhledový.
                    </p>
                  </div>
                </div>

                {/* Market Info - Tradable & Marketable */}
                <div className="border border-gray-700 rounded-lg p-4 bg-[#0a0b0f]">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">📊 Informace o obchodovatelnosti</h3>

                  <div className="space-y-3">
                    {/* Tradable */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="tradable"
                        checked={tradable}
                        onChange={(e) => setTradable(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="tradable" className="text-sm text-gray-300">
                        Tradable (Lze vyměnit)
                      </label>
                    </div>

                    {/* Marketable */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="marketable"
                        checked={marketable}
                        onChange={(e) => setMarketable(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="marketable" className="text-sm text-gray-300">
                        Marketable (Lze prodat na marketu)
                      </label>
                    </div>

                    {/* Trade Restriction Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Obchodovatelné od (datum)
                      </label>
                      <input
                        type="date"
                        value={tradeRestrictionDate}
                        onChange={(e) => setTradeRestrictionDate(e.target.value)}
                        className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Volitelné - pokud má item trade lock, zadejte datum, od kdy bude možné ho vyměnit
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stickery */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stickery (volitelné)
                  </label>
                  <div className="space-y-3" ref={dropdownRef}>
                    {stickers.map((sticker, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 relative">
                          <div className="flex items-center gap-2 mb-2">
                            <Search className="w-4 h-4 text-gray-500" />
                            <input
                              type="text"
                              value={stickerSearchQuery[index] || sticker.name}
                              onChange={(e) => handleStickerSearchChange(index, e.target.value)}
                              onFocus={() => setShowStickerDropdown(index)}
                              placeholder={`Vyhledat sticker (pozice ${index})`}
                              className="flex-1 px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Dropdown s výsledky */}
                          {showStickerDropdown === index && (
                            <div className="absolute z-10 w-full mt-1 bg-[#0f1117] border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {searchStickers(stickerSearchQuery[index] || '').map((stickerData) => (
                                <button
                                  key={stickerData.classId}
                                  type="button"
                                  onClick={() => handleSelectSticker(index, stickerData)}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors text-sm"
                                >
                                  <div className="text-white">{stickerData.name}</div>
                                  {stickerData.tournament && (
                                    <div className="text-xs text-gray-500">
                                      {stickerData.tournament}
                                      {stickerData.team && ` • ${stickerData.team}`}
                                      {stickerData.player && ` • ${stickerData.player}`}
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Zobrazení vybraného stickeru */}
                          {sticker.classId && (
                            <div className="mt-2 p-2 bg-[#0f1117] border border-gray-700 rounded-lg">
                              <div className="flex items-center gap-2">
                                <img
                                  src={`https://steamcommunity.com/economy/image/class/730/${sticker.classId}/96fx96f`}
                                  alt={sticker.name}
                                  className="w-12 h-12 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                <div className="flex-1 text-xs">
                                  <div className="text-white">{sticker.name}</div>
                                  <div className="text-gray-500">Class ID: {sticker.classId}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSticker(index)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {stickers.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddSticker}
                        className="w-full px-4 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-blue-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Přidat sticker
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Začněte psát název stickeru nebo vyberte z populárních
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    Zrušit
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Přidávám...' : 'Přidat skin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

