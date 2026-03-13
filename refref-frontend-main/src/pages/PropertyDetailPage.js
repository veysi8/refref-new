import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet ikon hatasını düzeltmek için
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    // Burada normalde API'den veri çekilir, şimdilik property verisinin var olduğunu varsayıyoruz
    // Eğer veriler gelmiyorsa buraya veri çekme kodu eklenecek
  }, [id]);

  if (!property) return <div className="p-10 text-center">İlan yükleniyor...</div>;

  const mapCenter = [property.latitude || 37.91, property.longitude || 40.24];

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${mapCenter[0]},${mapCenter[1]}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sol Taraf: Resimler ve Detaylar */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          <p className="text-gray-600 mb-6">{property.description}</p>
          {/* Diğer detaylar buraya... */}
        </div>

        {/* Sağ Taraf: Harita ve Sanal Tur */}
        <div className="space-y-8">
          {/* Harita Kutusu */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Konum</h3>
              <button 
                onClick={handleDirections}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <span>Yol Tarifi Al</span>
              </button>
            </div>
            <div style={{ height: '300px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
              <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={mapCenter}>
                  <Popup>İlan Konumu Burası</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Sanal Tur Kutusu (Apple Uyumlu) */}
          {property.matterport_url && (
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display' }}>3D Sanal Tur</h3>
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <iframe
                  src={property.matterport_url}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  allowFullScreen
                  webkitallowfullscreen="true"
                  mozallowfullscreen="true"
                  allow="xr-spatial-tracking; fullscreen"
                  title="3D Sanal Tur"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;