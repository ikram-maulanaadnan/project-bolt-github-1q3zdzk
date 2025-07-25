import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ChevronDown } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import { FAQ } from '../../types';

const FAQsManager: React.FC = () => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  const handleOpenModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFAQ(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer
      });
    } else {
      setEditingFAQ(null);
      setFormData({
        question: '',
        answer: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFAQ(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFAQ) {
      updateFAQ(editingFAQ.id, formData);
    } else {
      addFAQ(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
      deleteFAQ(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">FAQs Management</h1>
          <p className="text-gray-300">Kelola pertanyaan yang sering diajukan</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Tambah FAQ
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300"
          >
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg pr-4">{faq.question}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenModal(faq);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(faq.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronDown className="w-5 h-5 text-gray-400 transform transition-transform group-open:rotate-180" />
                </div>
              </summary>
              <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingFAQ ? 'Edit FAQ' : 'Tambah FAQ'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pertanyaan
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  placeholder="Tulis pertanyaan..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Jawaban
                </label>
                <textarea
                  rows={6}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  placeholder="Tulis jawaban..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  <Save className="w-5 h-5" />
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/30"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQsManager;