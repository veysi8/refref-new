import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, MapPin, Maximize, BedDouble, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const userEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : 'guest@example.com';
    
    try {
      const response = await axios.get(`${BACKEND_URL}/api/favorites?user_email=${userEmail}`);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Favoriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    const userEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : 'guest@example.com';
    
    try {
      await axios.delete(`${BACKEND_URL}/api/favorites/${propertyId}?user_email=${userEmail}`);
      toast.success('Favorilerden kaldırıldı');
      fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Favorilerden kaldırılırken hata oluştu');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24" data-testid="favorites-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="mb-12">
          <h1
            className="text-4xl md:text-5xl font-semibold mb-4"
            style={{ fontFamily: 'Playfair Display, serif', color: '#0F172A' }}
          >
            Favorilerim
          </h1>
          <p className="text-lg text-slate-600">
            {favorites.length} favori ilan
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3498DB]"></div>
            <p className="mt-4 text-slate-600">Yükleniyor...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <Heart className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <p className="text-xl text-slate-600 mb-4">Henüz favori ilan eklemediniz.</p>
            <Button
              onClick={() => navigate('/properties')}
              className="bg-[#3498DB] text-white hover:bg-[#2980B9]"
            >
              İlanları Keşfedin
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((property) => (
              <div
                key={property.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-100 transition-all duration-300 property-card"
                data-testid="favorite-card"
              >
                <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => navigate(`/properties/${property.id}`)}>
                  <img
                    src={property.images[0] || 'https://images.unsplash.com/photo-1759722668087-efcc63c91ed2?q=85'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(property.id);
                    }}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    data-testid="remove-favorite-btn"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                  <div className="absolute top-4 left-4 bg-[#3498DB] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {property.property_type === 'sale' ? 'Satılık' : 'Kiralık'}
                  </div>
                </div>

                <div className="p-6 cursor-pointer" onClick={() => navigate(`/properties/${property.id}`)}>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-[#3498DB] transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-slate-600 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.address}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    {property.rooms && (
                      <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4" />
                        <span>{property.rooms}</span>
                      </div>
                    )}
                    {property.net_area && (
                      <div className="flex items-center gap-1">
                        <Maximize className="h-4 w-4" />
                        <span>{property.net_area} m²</span>
                      </div>
                    )}
                  </div>

                  <div className="text-2xl font-bold text-[#3498DB]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {formatPrice(property.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;