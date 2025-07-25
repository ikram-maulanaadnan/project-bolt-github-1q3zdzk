// File: src/contexts/ContentContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Feature, Package, Testimonial, FAQ, HeroContent } from '../types';

const API_URL = 'http://localhost:8080/api';

interface ContentData {
  heroContent: HeroContent | null;
  features: Feature[];
  packages: Package[];
  testimonials: Testimonial[];
  faqs: FAQ[];
}

interface ContentContextType extends ContentData {
  isLoading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
  updateHeroContent: (data: Partial<HeroContent>) => Promise<void>;
  addFeature: (data: Omit<Feature, 'id'>) => Promise<void>;
  updateFeature: (id: string, data: Partial<Feature>) => Promise<void>;
  deleteFeature: (id: string) => Promise<void>;
  addPackage: (data: Omit<Package, 'id'>) => Promise<void>;
  updatePackage: (id: string, data: Partial<Package>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  addTestimonial: (data: Omit<Testimonial, 'id'>) => Promise<void>;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  addFAQ: (data: Omit<FAQ, 'id'>) => Promise<void>;
  updateFAQ: (id: string, data: Partial<FAQ>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};

const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json', ...options.headers, ...(token && { 'Authorization': `Bearer ${token}` }) };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error from server.' }));
        throw new Error(errorData.message || `Request failed: ${response.status}`);
    }
    if (response.status !== 204) { // 204 No Content
        return response.json(); 
    }
    return {};
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentData>({
    heroContent: null,
    features: [],
    packages: [],
    testimonials: [],
    faqs: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/content`);
      if (!response.ok) {
        let errorMessage = `Gagal mengambil data: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // Abaikan jika respons bukan JSON
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setContent({
          heroContent: data.heroContent || null,
          features: data.features || [],
          packages: data.packages || [],
          testimonials: data.testimonials || [],
          faqs: data.faqs || []
      });
    } catch (err: any) {
      console.error("Gagal mengambil konten dari backend:", err);
      setError(err.message || 'Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refetchData(); }, [refetchData]);

  const createCrudFunctions = <T extends { id: string }>(endpoint: string) => ({
    add: async (data: Omit<T, 'id'>) => { await authFetch(`${API_URL}/${endpoint}`, { method: 'POST', body: JSON.stringify(data) }); await refetchData(); },
    update: async (id: string, data: Partial<T>) => { await authFetch(`${API_URL}/${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(data) }); await refetchData(); },
    remove: async (id: string) => { await authFetch(`${API_URL}/${endpoint}/${id}`, { method: 'DELETE' }); await refetchData(); },
  });
  
  const featureCrud = createCrudFunctions<Feature>('features');
  const packageCrud = createCrudFunctions<Package>('packages');
  const testimonialCrud = createCrudFunctions<Testimonial>('testimonials');
  const faqCrud = createCrudFunctions<FAQ>('faqs');

  const value: ContentContextType = {
    ...content,
    isLoading, error, refetchData,
    updateHeroContent: async (data) => { await authFetch(`${API_URL}/hero`, { method: 'PUT', body: JSON.stringify(data) }); await refetchData(); },
    addFeature: featureCrud.add, updateFeature: featureCrud.update, deleteFeature: featureCrud.remove,
    addPackage: packageCrud.add, updatePackage: packageCrud.update, deletePackage: packageCrud.remove,
    addTestimonial: testimonialCrud.add, updateTestimonial: testimonialCrud.update, deleteTestimonial: testimonialCrud.remove,
    addFAQ: faqCrud.add, updateFAQ: faqCrud.update, deleteFAQ: faqCrud.remove,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};
