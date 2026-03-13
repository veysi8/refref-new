import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LogIn, UserPlus } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://refrefemlak.com';

      // Arka uca e-posta ve şifreyi gönderip GERÇEK bir giriş isteği atıyoruz
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      // Arka uç bilgileri doğrularsa bize GERÇEK bir token verir
      const realToken = response.data.token;
      const realUser = response.data.user || { email: formData.email };

      // Bu gerçek anahtarları tarayıcının hafızasına kaydediyoruz
      localStorage.setItem('token', realToken);
      localStorage.setItem('user', JSON.stringify(realUser));

      toast.success('Giriş başarılı!');
      navigate('/admin/dashboard');

    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Kullanıcı adı veya şifre hatalı!');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center" data-testid="admin-login-page">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-semibold mb-2"
              style={{ fontFamily: 'Playfair Display, serif', color: '#0F172A' }}
            >
              Giriş Yap
            </h1>
            <p className="text-slate-600">RefRef Emlak Yönetim Paneli</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">E-posta</label>
              <Input
                type="email"
                placeholder="refrefemlak21@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                data-testid="input-email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">Şifre</label>
              <Input
                type="password"
                placeholder="Şifreniz"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                data-testid="input-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#3498DB] text-white hover:bg-[#2980B9] py-6 text-lg"
              disabled={loading}
              data-testid="submit-btn"
            >
              {loading ? (
                'Yükleniyor...'
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Giriş Yap
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;