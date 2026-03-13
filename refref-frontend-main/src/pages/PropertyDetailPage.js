import React, { useState } from 'react';

const PropertyDetailPage = ({ property }) => {
  if (!property) return <div className="p-10 text-center">İlan yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg p-6">
          
          {/* Üst Kısım: Başlık ve Detaylar */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
            <p className="text-gray-600">{property.description}</p>
          </div>

          {/* Orta Kısım: Harita ve Sanal Tur */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Sol: Harita */}
            <div className="bg-gray-50 p-4 rounded-xl border">
              <h3 className="text-xl font-semibold mb-4">Konum</h3>
              <div className="h-[400px] bg-gray-200 rounded-lg overflow-hidden">
                {/* Harita buraya gelecek */}
                <div className="flex items-center justify-center h-full text-gray-500">
                  Harita Yükleniyor...
                </div>
              </div>
            </div>

            {/* Sağ: 3D Sanal Tur (Apple Uyumlu) */}
            <div className="bg-gray-50 p-4 rounded-xl border">
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display' }}>
                3D Sanal Tur
              </h3>
              {property.matterport_url ? (
                <div className="aspect-video rounded-lg overflow-hidden border bg-black">
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
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-100 rounded-lg">
                  Sanal tur linki eklenmemiş.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;