import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, ChevronUp, Heart, MapPin, Maximize, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { diyarbakirData } from '@/data/diyarbakirLocations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PropertiesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
  
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    address: '',
    sortBy: 'date_desc'
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  useEffect(() => {
    if (selectedDistricts.length > 0) {
      const neighborhoods = diyarbakirData.getNeighborhoodsByDistricts(selectedDistricts);
      setAvailableNeighborhoods(neighborhoods);
    } else {
      setAvailableNeighborhoods([]);
      setSelectedNeighborhoods([]);
    }
  }, [selectedDistricts]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append('property_type', filters.type);
      if (filters.minPrice) params.append('min_price', filters.minPrice);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.minArea) params.append('min_area', filters.minArea);
      if (filters.maxArea) params.append('max_area', filters.maxArea);
      
      let addressFilter = '';
      if (selectedDistricts.length > 0) {
        addressFilter = selectedDistricts.join(',');
      }
      if (selectedNeighborhoods.length > 0) {
        addressFilter += (addressFilter ? ',' : '') + selectedNeighborhoods.join(',');
      }
      if (filters.address) {
        addressFilter += (addressFilter ? ',' : '') + filters.address;
      }
      if (addressFilter) params.append('address', addressFilter);
      
      if (filters.sortBy) params.append('sort_by', filters.sortBy);

      const response = await axios.get(`${BACKEND_URL}/api/properties?${params.toString()}`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('İlanlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (propertyId) => {
    const userEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : 'guest@example.com';
    try {
      await axios.post(`${BACKEND_URL}/api/favorites`, {
        property_id: propertyId,
        user_email: userEmail
      });
      toast.success('Favorilere eklendi');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Favorilere eklenirken hata oluştu');
    }
  };

  const handleDistrictToggle = (district) => {
    setSelectedDistricts(prev => {
      if (prev.includes(district)) {
        return prev.filter(d => d !== district);
      } else {
        return [...prev, district];
      }
    });
  };

  const handleNeighborhoodToggle = (neighborhood) => {
    setSelectedNeighborhoods(prev => {
      if (prev.includes(neighborhood)) {
        return prev.filter(n => n !== neighborhood);
      } else {
        return [...prev, neighborhood];
      }
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20" data-testid="properties-page">
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <h1
            className="text-3xl md:text-4xl font-semibold"
            style={{ fontFamily: 'Playfair Display, serif', color: '#0F172A' }}
            data-testid="properties-title"
          >
            {filters.type === 'sale' ? 'Satılık' : filters.type === 'rent' ? 'Kiralık' : 'Tüm'} Daireler
          </h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600">
            <span className="font-semibold">{properties.length}</span> ilan bulundu
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Sıralama:</span>
            <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
              <SelectTrigger className="w-40" data-testid="sort-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">En Yeni</SelectItem>
                <SelectItem value="date_asc">En Eski</SelectItem>
                <SelectItem value="price_asc">Fiyat: Artan</SelectItem>
                <SelectItem value="price_desc">Fiyat: Azalan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-8" data-testid="filters-section">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
            data-testid="filter-toggle"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Filtreler</span>
              {(selectedDistricts.length > 0 || selectedNeighborhoods.length > 0 || filters.minPrice || filters.maxPrice || filters.minArea || filters.maxArea) && (
                <span className="bg-[#3498DB] text-white text-xs px-2 py-1 rounded-full">
                  Aktif
                </span>
              )}
            </div>
            {filtersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {filtersOpen && (
            <div className="px-6 pb-6 space-y-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-700">Şehir</label>
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
                    Diyarbakır
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-700">İlçe</label>
                  <div className="max-h-40 overflow-y-auto border rounded-lg p-3 bg-white">
                    {diyarbakirData.getDistrictNames().map(district => (
                      <label key={district} className="flex items-center space-x-2 py-2 hover:bg-slate-50 px-2 rounded cursor-pointer">
                        <Checkbox
                          checked={selectedDistricts.includes(district)}
                          onCheckedChange={() => handleDistrictToggle(district)}
                        />
                        <span className="text-sm">{district}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {availableNeighborhoods.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-3 text-slate-700">Mahalle</label>
                    <div className="max-h-40 overflow-y-auto border rounded-lg p-3 bg-white">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {availableNeighborhoods.map(neighborhood => (
                          <label key={neighborhood} className="flex items-center space-x-2 py-1 hover:bg-slate-50 px-2 rounded cursor-pointer">
                            <Checkbox
                              checked={selectedNeighborhoods.includes(neighborhood)}
                              onCheckedChange={() => handleNeighborhoodToggle(neighborhood)}
                            />
                            <span className="text-sm">{neighborhood}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Min Fiyat (TL)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full"
                    data-testid="filter-min-price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Max Fiyat (TL)</label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full"
                    data-testid="filter-max-price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Min Metrekare (m²)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minArea}
                    onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
                    className="w-full"
                    data-testid="filter-min-area"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Max Metrekare (m²)</label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={filters.maxArea}
                    onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })}
                    className="w-full"
                    data-testid="filter-max-area"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSelectedDistricts([]);
                    setSelectedNeighborhoods([]);
                    setFilters({
                      ...filters,
                      minPrice: '',
                      maxPrice: '',
                      minArea: '',
                      maxArea: '',
                      address: ''
                    });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Filtreleri Temizle
                </Button>
                <Button
                  onClick={() => setFiltersOpen(false)}
                  className="flex-1 bg-[#3498DB] text-white hover:bg-[#2980B9]"
                >
                  Uygula
                </Button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3498DB]"></div>
            <p className="mt-4 text-slate-600">Yükleniyor...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl" data-testid="no-properties">
            <p className="text-xl text-slate-600">Hiç ilan bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="properties-grid">
            {properties.map((property) => (
              <div
                key={property.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-100 transition-all duration-300 property-card cursor-pointer"
                onClick={() => navigate(`/properties/${property.id}`)}
                data-testid="property-card"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.images[0] || 'https://images.unsplash.com/photo-1759722668087-efcc63c91ed2?q=85'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToFavorites(property.id);
                    }}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    data-testid="add-to-favorites-btn"
                  >
                    <Heart className="h-5 w-5 text-slate-600" />
                  </button>
                  <div className="absolute top-4 left-4 bg-[#3498DB] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {property.property_type === 'sale' ? 'Satılık' : 'Kiralık'}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-[#3498DB] transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-slate-600 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{property.address}</span>
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

export default PropertiesPage;
