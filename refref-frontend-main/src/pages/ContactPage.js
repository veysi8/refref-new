import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BACKEND_URL}/api/contact`, formData);
      toast.success('Mesajınız gönderildi!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Mesaj gönderilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24" data-testid="contact-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-semibold mb-4"
            style={{ fontFamily: 'Playfair Display, serif', color: '#0F172A' }}
          >
            Bize Ulaşın
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya ilan talepleriniz için bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              İletişim Formu
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Adınız *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="input-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">E-posta *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="input-email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Telefon *</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  data-testid="input-phone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Mesajınız *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  required
                  data-testid="input-message"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#3498DB] text-white hover:bg-[#2980B9] py-6"
                disabled={loading}
                data-testid="submit-btn"
              >
                {loading ? 'Gönderiliyor...' : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Mesaj Gönder
                  </>
                )}
              </Button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
              <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                İletişim Bilgileri
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-[#3498DB]" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Telefon</p>
                    <a href={`tel:${WHATSAPP_NUMBER}`} className="text-slate-600 hover:text-[#3498DB]">
                      {WHATSAPP_NUMBER}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-[#3498DB]" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">E-posta</p>
                    <a href="mailto:info@refrefemlak.com" className="text-slate-600 hover:text-[#3498DB]">
                      info@refrefemlak.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-[#3498DB]" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Adres</p>
                    <p className="text-slate-600">İstanbul, Türkiye</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F5F0] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Çalışma Saatleri
              </h3>
              <div className="space-y-2 text-slate-600">
                <p><strong>Hafta İçi:</strong> 09:00 - 18:00</p>
                <p><strong>Cumartesi:</strong> 10:00 - 16:00</p>
                <p><strong>Pazar:</strong> Kapalı</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;