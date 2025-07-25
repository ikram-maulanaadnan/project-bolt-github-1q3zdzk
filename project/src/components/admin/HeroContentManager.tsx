import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Loader2 } from 'lucide-react';
import { useContent } from '/src/contexts/ContentContext';
import { HeroContent } from '/src/types';

const HeroContentManager: React.FC = () => {
  const { heroContent, updateHeroContent, isLoading } = useContent();
  const [formData, setFormData] = useState<HeroContent | null>(heroContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => { if (heroContent) { setFormData(heroContent); } }, [heroContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSaving(true);
    setIsSaved(false);
    try {
      await updateHeroContent(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error("Gagal menyimpan Hero Content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => { if (heroContent) { setFormData(heroContent); } };

  if (isLoading || !formData) {
    return <div className="flex justify-center items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Hero Content</h1>
        <p className="text-gray-300">Kelola konten utama dan link invite di halaman beranda.</p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
            <input type="text" id="subtitle" value={formData.subtitle || ''} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white" />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Main Title</label>
            <input type="text" id="title" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea id="description" rows={4} value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white" />
          </div>
          <div>
            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number</label>
            <input type="text" id="whatsappNumber" value={formData.whatsappNumber || ''} onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white" />
          </div>
          <div>
            <label htmlFor="discordInviteLink" className="block text-sm font-medium text-gray-300 mb-2">Discord Invite Link</label>
            <input type="text" id="discordInviteLink" value={formData.discord_invite_link || ''} onChange={(e) => setFormData({ ...formData, discord_invite_link: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white" placeholder="https://discord.gg/xxxxxx" />
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={isSaving} className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? 'Menyimpan...' : (isSaved ? 'Tersimpan!' : 'Simpan')}
            </button>
            <button type="button" onClick={handleReset} disabled={isSaving} className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold border border-white/20 disabled:opacity-50">
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroContentManager;
