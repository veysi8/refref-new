import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Building2, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { diyarbakirData } from '@/data/diyarbakirLocations';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [propertyType, setPropertyType] = useState('sale');

  const handleSearch = () => {
    let url = `/properties?type=${propertyType}`;
    if (selectedDistrict) {
      url += `&district=${selectedDistrict}`;
    }
    navigate(url);
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat pt-20" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073')`
        }}
        data-testid="hero-section"
      >
        <div className="w-full max-w-7xl mx-auto px-4 text-center">
          <div className="mb-16">
            <img
              src="https://customer-assets.emergentagent.com/job_home-finder-173/artifacts/at5msrjd_image.jpg"
              alt="RefRef Emlak Logo"
              className="h-40 md:h-48 mx-auto mb-8 drop-shadow-2xl"
            />
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-5xl mx-auto">
            <div className="flex gap-0 mb-8 border-b border-slate-200">
              <button
                onClick={() => setPropertyType('sale')}
                className={`flex-1 px-10 py-5 text-xl font-semibold transition-all relative ${
                  propertyType === 'sale'
                    ? 'border-b-3 text-[#3498DB] bg-[#EBF5FB]'
                    : 'text-slate-600 hover:text-[#3498DB] hover:bg-slate-50'
                }`}
                style={propertyType === 'sale' ? { borderBottom: '3px solid #3498DB' } : {}}
                data-testid="tab-sale"
              >
                Satılık
              </button>
              <button
                onClick={() => setPropertyType('rent')}
                className={`flex-1 px-10 py-5 text-xl font-semibold transition-all ${
                  propertyType === 'rent'
                    ? 'text-[#3498DB] bg-[#EBF5FB]'
                    : 'text-slate-600 hover:text-[#3498DB] hover:bg-slate-50'
                }`}
                style={propertyType === 'rent' ? { borderBottom: '3px solid #3498DB' } : {}}
                data-testid="tab-rent"
              >
                Kiralık
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-3 text-slate-700 text-left">Şehir</label>
                <div className="p-4 bg-slate-50 rounded-xl border text-slate-600 text-lg">
                  Diyarbakır
                </div>
              </div>
              
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-3 text-slate-700 text-left">İlçe</label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="w-full h-14 text-lg">
                    <SelectValue placeholder="İlçe Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm İlçeler</SelectItem>
                    {diyarbakirData.getDistrictNames().map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-3 text-slate-700 text-left">Oda Sayısı</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full h-14 text-lg">
                    <SelectValue placeholder="Oda Sayısı" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Hepsi</SelectItem>
                    <SelectItem value="1+1">1+1</SelectItem>
                    <SelectItem value="2+1">2+1</SelectItem>
                    <SelectItem value="3+1">3+1</SelectItem>
                    <SelectItem value="4+1">4+1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full mt-8 bg-[#3498DB] hover:bg-[#2980B9] text-white h-16 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              data-testid="search-btn"
            >
              <Search className="mr-2 h-6 w-6" />
              Ara
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-semibold mb-4"
              style={{ fontFamily: 'Playfair Display, serif', color: '#0F172A' }}
            >
              Neden RefRef Emlak?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Profesyonel hizmet anlayışımız ve güvenilir danışmanlığımızla yanınızdayız.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all" data-testid="feature-card-1">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Home className="h-8 w-8 text-[#3498DB]" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Geniş Portföy
              </h3>
              <p className="text-slate-600">
                Binlerce satılık ve kiralık gayrimenkul seçeneği.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all" data-testid="feature-card-2">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-[#3498DB]" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Konum Detayları
              </h3>
              <p className="text-slate-600">
                Harita üzerinde tüm ilanları görüntüleyin.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all" data-testid="feature-card-3">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-[#3498DB]" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                3D Sanal Tur
              </h3>
              <p className="text-slate-600">
                Matterport ile evleri sanal olarak gezin.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all" data-testid="feature-card-4">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-[#3498DB]" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Profesyonel Danışmanlık
              </h3>
              <p className="text-slate-600">
                Uzman ekibimiz her adımda yanınızda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-4xl md:text-5xl font-semibold mb-6"
                style={{ fontFamily: 'Playfair Display, serif', color: '#0F172A' }}
              >
                Hayalinizdeki Evi Birlikte Bulalım
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                RefRef Emlak olarak, size en uygun gayrimenkulu bulmanız için çalışıyoruz. 
                Profesyonel ekibimiz, geniş portföyümüz ve güvenilir hizmet anlayışımızla 
                hayalinizdeki eve kavuşmanızı sağlıyoruz.
              </p>
              <Button
                onClick={() => navigate('/contact')}
                size="lg"
                className="bg-[#3498DB] text-white hover:bg-[#2980B9] px-8 py-6 text-lg"
                data-testid="contact-cta-btn"
              >
                Bize Ulaşın
              </Button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1758523671819-06a0f1941520?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHw0fHxoYXBweSUyMGZhbWlseSUyMG1vdmluZyUyMGludG8lMjBuZXclMjBob21lfGVufDB8fHx8MTc3MDgxNjg5N3ww&ixlib=rb-4.1.0&q=85"
                alt="Mutlu aile"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;