import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// İkon hatasını çözmek için şu küçük kodu ekle:
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
import { MapPin, Maximize, Navigation, BedDouble, Bath, Calendar, Building, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER;

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);  
  const [selectedImage, setSelectedImage] = useState(0);
    const handleDirections = () => {
    // Sayfa daha yüklenmeden butona basılırsa hata vermesin diye güvenlik kilidi
    if (!property || !property.location) return;

    // Veritabanındaki [boylam, enlem] sırasına göre doğru değerleri çekiyoruz
    const lat = property.location.coordinates[1]; 
    const lng = property.location.coordinates[0];
    
    // İŞTE GOOGLE'IN GERÇEK VE RESMİ YOL TARİFİ LİNKİ:
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    
    // Yeni sekmede açar
    window.open(url, '_blank');
  };
  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('İlan yüklenirken hata oluştu');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async () => {
    const userEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : 'guest@example.com';
    try {
      await axios.post(`${BACKEND_URL}/api/favorites`, {
        property_id: id,
        user_email: userEmail
      });
      toast.success('Favorilere eklendi');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Favorilere eklenirken hata oluştu');
    }
  };

    const contactViaWhatsApp = () => {
    // AŞAĞIDAKİ TIRNAK İÇİNDEKİ YERE KENDİ NUMARANI YAZ (Örn: 905321234567)
    const myNumber = "905076761219"; 
    
    const message = encodeURIComponent(`Merhaba, ${property.title} ilanı hakkında bilgi alabilir miyim?`);
    window.open(`https://wa.me/${myNumber}?text=${message}`, '_blank');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3498DB]"></div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const mapCenter = {
    lat: property.location.coordinates[1],
    lng: property.location.coordinates[0]
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24" data-testid="property-detail-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                    {/* VİTRİN FOTOĞRAFLARI (Sahibinden Stili) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-2 mb-8">
            
            {/* Büyük Fotoğraf (Tıklanınca Tam Ekran Açar) */}
            <div 
              className="lg:col-span-2 h-[500px] rounded-xl overflow-hidden relative cursor-pointer group"
              onClick={() => setIsGalleryOpen(true)}
            >
              <img
                src={property.images[selectedImage]}
                alt="Büyük Görsel"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              {/* Tümünü Gör Butonu */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-opacity-100 transition shadow-lg">
                📸 Tüm Fotoğrafları Gör ({property.images.length})
              </div>
            </div>

            {/* Sağdaki 4 Küçük Fotoğraf Vitrini */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2"> 
              {property.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`h-[120px] lg:h-[120px] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === index ? 'border-blue-600' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} className="w-full h-full object-cover hover:opacity-80 transition" alt="Küçük Görsel" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <div className="inline-block bg-[#3498DB] text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                  {property.property_type === 'sale' ? 'Satılık' : 'Kiralık'}
                </div>
                <h1
                  className="text-4xl md:text-5xl font-semibold mb-3"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#0F172A' }}
                  data-testid="property-title"
                >
                  {property.title}
                </h1>
                <div className="flex items-center text-slate-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{property.address}</span>
                </div>
              </div>
            
                        {/* Fiyat ve Butonlar - Mobile Özel Esnek Yapı */}
          <div className="w-full lg:w-auto text-left lg:text-right mt-6 lg:mt-0">
            {/* Fiyat: Mobilde 3xl, PC'de 4xl */}
            <div className="text-3xl md:text-4xl font-bold text-[#3498DB] mb-4 break-words" style={{ fontFamily: 'Playfair Display, serif' }}>
              {formatPrice(property.price)}
            </div>
            
            {/* Butonlar: Mobilde alt alta (flex-col), PC'de yan yana (sm:flex-row) */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                onClick={addToFavorites}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-[#3498DB] text-[#3498DB] hover:bg-[#3498DB] hover:text-white"
                data-testid="add-favorite-btn"
              >
                <Heart className="h-5 w-5 mr-2" />
                Favorilere Ekle
              </Button>
              <Button
                onClick={contactViaWhatsApp}
                size="lg"
                className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700"
                data-testid="whatsapp-btn"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
         </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-slate-50 rounded-xl">
              {property.rooms && (
                <div className="flex items-center gap-3" data-testid="property-rooms">
                  <div className="bg-white p-3 rounded-lg">
                    <BedDouble className="h-6 w-6 text-[#3498DB]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Oda Sayısı</p>
                    <p className="text-lg font-semibold">{property.rooms}</p>
                  </div>
                </div>
              )}
              {property.net_area && (
                <div className="flex items-center gap-3" data-testid="property-area">
                  <div className="bg-white p-3 rounded-lg">
                    <Maximize className="h-6 w-6 text-[#3498DB]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Net Alan</p>
                    <p className="text-lg font-semibold">{property.net_area} m²</p>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-3" data-testid="property-bathrooms">
                  <div className="bg-white p-3 rounded-lg">
                    <Bath className="h-6 w-6 text-[#3498DB]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Banyo</p>
                    <p className="text-lg font-semibold">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              {property.building_age !== null && (
                <div className="flex items-center gap-3" data-testid="property-age">
                  <div className="bg-white p-3 rounded-lg">
                    <Building className="h-6 w-6 text-[#3498DB]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Bina Yaşı</p>
                    <p className="text-lg font-semibold">{property.building_age} yıl</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Açıklama
              </h2>
              <p className="text-slate-600 leading-relaxed" data-testid="property-description">
                {property.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Teknik Özellikler
                </h3>
                <div className="space-y-3 bg-slate-50 p-6 rounded-xl">
                  {property.heating && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Isıtma:</span>
                      <span className="font-medium">{property.heating}</span>
                    </div>
                  )}
                  {property.floor && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Kat:</span>
                      <span className="font-medium">{property.floor}</span>
                    </div>
                  )}
                  {property.elevator !== null && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Asansör:</span>
                      <span className="font-medium">{property.elevator ? 'Var' : 'Yok'}</span>
                    </div>
                  )}
                  {property.parking !== null && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Otopark:</span>
                      <span className="font-medium">{property.parking ? 'Var' : 'Yok'}</span>
                    </div>
                  )}
                  {property.balcony !== null && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Balkon:</span>
                      <span className="font-medium">{property.balcony ? 'Var' : 'Yok'}</span>
                    </div>
                  )}
                  {property.furnished !== null && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Eşyalı:</span>
                      <span className="font-medium">{property.furnished ? 'Evet' : 'Hayır'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Konum
                </h3>
                {/* 1. KUTU: ÖZGÜR BUTON (Haritanın dışında) */}
<div className="flex justify-end mb-4 relative z-10">
  <Button 
    onClick={handleDirections} 
    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
  >
    <Navigation className="h-4 w-4" />
    Yol Tarifi Al
  </Button>
</div>

{/* 2. KUTU: HARİTA KAFESİ */}
<div style={{ height: '300px', width: '100%', borderRadius: '10px', overflow: 'hidden', position: 'relative', zIndex: 0 }}>

  <MapContainer 
    center={mapCenter} 
    zoom={15} 
    scrollWheelZoom={false} 
    style={{ height: '100%', width: '100%' ,zIndex: 0 }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    />
    <Marker position={mapCenter}>
      <Popup>
        Konum burası
      </Popup>
    </Marker>
  </MapContainer>
</div>
              </div>
            </div>

            {property.matterport_url && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  3D Sanal Tur
                </h3>
                          <div className="mb-4">
            <button 
              onClick={() => window.open(property.matterport_url, '_blank')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <span>📱 Tam Ekran Başlat (iPhone/iPad)</span>
            </button>
          </div>

                <div className="aspect-video rounded-xl overflow-hidden" data-testid="matterport-viewer">
                  <iframe
                    src={property.matterport_url}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"
                    allow="xr-spatial-tracking; fullscreen"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
           {/* SAHİBİNDEN STİLİ TAM EKRAN FOTOĞRAF GALERİSİ */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex flex-col items-center justify-center">
          
          {/* Kapat Butonu (Sağ Üst Çarpı) */}
          <button 
            onClick={() => setIsGalleryOpen(false)} 
            className="absolute top-5 right-5 text-white text-5xl hover:text-red-500 z-50 transition"
          >
            &times;
          </button>

          {/* Sayfa Sayacı (Örn: 3 / 12) */}
          <div className="absolute top-5 left-5 text-white text-xl font-semibold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            {selectedImage + 1} / {property.images.length}
          </div>

          {/* Ana Dev Fotoğraf ve Oklar */}
          <div className="relative w-full h-[75vh] flex items-center justify-center mt-10">
            {/* Sol Ok */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
              }}
              className="absolute left-5 text-white text-7xl hover:text-blue-500 p-4 transition z-50"
            >
              &#10094;
            </button>

            <img 
              src={property.images[selectedImage]} 
              alt="Tam Ekran" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Sağ Ok */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-5 text-white text-7xl hover:text-blue-500 p-4 transition z-50"
            >
              &#10095;
            </button>
          </div>

          {/* Alt Kısım: Tüm 12 Fotoğrafın Şeridi */}
          <div className="h-[15vh] w-full flex justify-center gap-3 overflow-x-auto p-4 mt-4">
            {property.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                onClick={() => setSelectedImage(idx)}
                className={`h-full w-28 object-cover cursor-pointer rounded-lg border-2 transition-all duration-300 ${
                  selectedImage === idx ? 'border-blue-500 scale-110 opacity-100' : 'border-transparent opacity-40 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default PropertyDetailPage;