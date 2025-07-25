import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Star, Loader2 } from 'lucide-react';
import { useContent } from '/src/contexts/ContentContext';
import { Package } from '../../types';

const PackagesManager: React.FC = () => {
  const { packages, addPackage, updatePackage, deletePackage, isLoading } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    features: [''],
    popular: false,
    discord_role_id: '',
    payment_link: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenModal = (pkg?: Package) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        price: String(pkg.price),
        description: pkg.description,
        features: pkg.features,
        popular: pkg.popular,
        discord_role_id: pkg.discord_role_id || '',
        payment_link: pkg.payment_link || ''
      });
    } else {
      setEditingPackage(null);
      setFormData({ name: '', price: '', description: '', features: [''], popular: false, discord_role_id: '', payment_link: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { if (!isSaving) setIsModalOpen(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const packageData = { ...formData, price: parseFloat(formData.price) || 0, features: formData.features.filter(f => f.trim() !== '') };
    try {
      if (editingPackage) {
        await updatePackage(editingPackage.id, packageData);
      } else {
        await addPackage(packageData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Gagal menyimpan paket:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeletePackage = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      await deletePackage(id);
    }
  };

  const addFeatureField = () => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  const removeFeatureField = (index: number) => setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Packages Management</h1>
          <p className="text-gray-300">Kelola paket-paket kursus yang ditawarkan.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold">
          <Plus className="w-5 h-5" />
          Tambah Package
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-400" /></div>
      ) : packages.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold text-white">Belum Ada Paket</h3>
          <p className="text-gray-400 mt-2">Klik "Tambah Package" untuk membuat paket pertama Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border ${pkg.popular ? 'border-yellow-400' : 'border-white/20'}`}>
              {pkg.popular && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2"><div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Star className="w-3 h-3" />POPULER</div></div>}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                  <div className="text-2xl font-bold text-yellow-400 mb-2">${pkg.price}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(pkg)} className="p-2 text-gray-400 hover:text-blue-400"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDeletePackage(pkg.id)} className="p-2 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">{pkg.description}</p>
              <div className="space-y-2">
                {pkg.features.slice(0, 3).map((feature, index) => (<div key={index} className="text-gray-300 text-sm">• {feature}</div>))}
                {pkg.features.length > 3 && <div className="text-gray-400 text-xs">+{pkg.features.length - 3} fitur lainnya</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">{editingPackage ? 'Edit Package' : 'Add Package'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Package Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Discord Role ID</label>
                <input type="text" value={formData.discord_role_id} onChange={(e) => setFormData({ ...formData, discord_role_id: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white" placeholder="Masukkan ID Role dari Discord" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Payment Link</label>
                <input type="url" value={formData.payment_link} onChange={(e) => setFormData({ ...formData, payment_link: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white" placeholder="https://nowpayments.io/payment/?iid=xxxx" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">Features</label>
                  <button type="button" onClick={addFeatureField} className="text-blue-400 hover:text-blue-300 text-sm">+ Add Feature</button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input type="text" value={feature} onChange={(e) => updateFeature(index, e.target.value)} className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white" />
                      {formData.features.length > 1 && <button type="button" onClick={() => removeFeatureField(index)} className="p-2 text-red-400"><X className="w-4 h-4" /></button>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="popular" checked={formData.popular} onChange={(e) => setFormData({ ...formData, popular: e.target.checked })} className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded" />
                <label htmlFor="popular" className="text-sm font-medium text-gray-300">Mark as popular package</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={handleCloseModal} disabled={isSaving} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold border border-white/20">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesManager;
