'use client';

import { useState } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

interface ScreenshotUploadProps {
  skinId: string;
  currentScreenshotUrl?: string;
  onUploadComplete?: (url: string) => void;
  fieldName?: string; // Název pole v Firestore (default: 'customScreenshotUrl')
  storagePath?: string; // Cesta v Storage (default: 'skins/{skinId}/screenshot.jpg')
}

export default function ScreenshotUpload({
  skinId,
  currentScreenshotUrl,
  onUploadComplete,
  fieldName = 'customScreenshotUrl',
  storagePath
}: ScreenshotUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentScreenshotUrl || null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploading(true);
    toast.loading('Nahrávám screenshot...');

    try {
      // Upload do Firebase Storage
      const finalStoragePath = storagePath || `skins/${skinId}/screenshot.jpg`;
      const storageRef = ref(storage, finalStoragePath);
      await uploadBytes(storageRef, file);

      // Získáme URL
      const downloadUrl = await getDownloadURL(storageRef);

      // Uložíme URL do Firestore
      await updateDoc(doc(db, 'skins', skinId), {
        [fieldName]: downloadUrl
      });

      setPreviewUrl(downloadUrl);
      toast.dismiss();
      toast.success('Screenshot úspěšně nahrán!');
      
      if (onUploadComplete) {
        onUploadComplete(downloadUrl);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.dismiss();
      toast.error(`Chyba při nahrávání: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentScreenshotUrl) return;

    const confirmed = confirm('Opravdu chcete smazat tento screenshot?');
    if (!confirmed) return;

    setIsUploading(true);
    toast.loading('Mažu screenshot...');

    try {
      // Smažeme z Storage
      const finalStoragePath = storagePath || `skins/${skinId}/screenshot.jpg`;
      const storageRef = ref(storage, finalStoragePath);
      await deleteObject(storageRef);

      // Smažeme URL z Firestore
      await updateDoc(doc(db, 'skins', skinId), {
        [fieldName]: null
      });

      setPreviewUrl(null);
      toast.dismiss();
      toast.success('Screenshot smazán!');
      
      if (onUploadComplete) {
        onUploadComplete('');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.dismiss();
      toast.error(`Chyba při mazání: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          🎮 Vlastní screenshot ze hry
        </label>
        {previewUrl && (
          <button
            onClick={handleDelete}
            disabled={isUploading}
            className="text-red-600 hover:text-red-700 text-xs flex items-center gap-1"
          >
            <X size={14} />
            Smazat
          </button>
        )}
      </div>

      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-green-200 bg-green-50">
          <img
            src={previewUrl}
            alt="Screenshot preview"
            className="w-full h-auto object-contain"
          />
          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Check size={14} />
            Nahráno
          </div>
        </div>
      ) : (
        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
            {isUploading ? (
              <Loader2 size={32} className="mx-auto text-blue-600 animate-spin" />
            ) : (
              <Upload size={32} className="mx-auto text-slate-400 mb-2" />
            )}
            <p className="text-sm text-slate-600 font-medium">
              {isUploading ? 'Nahrávám...' : 'Klikněte pro nahrání screenshotu'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Max 10MB, JPG/PNG
            </p>
          </div>
        </label>
      )}
    </div>
  );
}

