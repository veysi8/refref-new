import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || '+905336301219';

  return (
    <footer className="bg-[#1e3a5f] text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img
              src="https://customer-assets.emergentagent.com/job_home-finder-173/artifacts/at5msrjd_image.jpg"
              alt="RefRef Emlak Logo"
              className="h-12 mb-4 brightness-0 invert"
            />
            <p className="text-slate-300 text-sm leading-relaxed">
              Hayalinizdeki evi bulmanıza yardımcı oluyoruz. Profesyonel hizmet ve güvenilir danışmanlık.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties?type=sale" className="text-slate-300 hover:text-[#3498DB] transition-colors">
                  Satılık İlanlar
                </Link>
              </li>
              <li>
                <Link to="/properties?type=rent" className="text-slate-300 hover:text-[#3498DB] transition-colors">
                  Kiralık İlanlar
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-[#3498DB] transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-slate-300 hover:text-[#3498DB] transition-colors">
                  Admin Girişi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">İletişim</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-1 text-[#3498DB] flex-shrink-0" />
                <a href={`tel:${whatsappNumber}`} className="text-slate-300 hover:text-[#3498DB] transition-colors">
                  {whatsappNumber}
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-1 text-[#3498DB] flex-shrink-0" />
                <a href="mailto:refrefemlak21@gmail.com" className="text-slate-300 hover:text-[#3498DB] transition-colors">
                  refrefemlak21@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-[#3498DB] flex-shrink-0" />
                <span className="text-slate-300">
                  Diyarbakır Kayapınar Talaytepe Mahallesi Diclekent Bulvarı 4033. Sokak Alınak Lavida Park Altı
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Bizi Takip Edin</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/refref.emlak.diyarbakir?igsh=MTJtNXp3ZDNmZjcyaw=="
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-[#3498DB] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@refref.emlak.diyarbakir"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-[#3498DB] transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} RefRef Emlak & Gayrimenkul Diyarbakır. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;