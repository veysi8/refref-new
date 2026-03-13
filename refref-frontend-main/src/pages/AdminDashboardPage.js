import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// İkonların düzgün görünmesi için şart olan kısım
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
//const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
// Buraya setSelectedLocation kelimesini ekledik:
const LocationMarker = ({ formData, setFormData, setSelectedLocation }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setFormData({
        ...formData,
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      });
      // GÜVENLİK GÖREVLİSİNİ İKNA EDEN SİHİRLİ SATIR:
      setSelectedLocation({ lat: lat, lng: lng }); 
    },
  });

  if (!formData?.location?.coordinates) {
    return null;
  }

  return (
    <Marker position={[formData.location.coordinates[1], formData.location.coordinates[0]]}>
      <Popup>Seçilen Konum</Popup>
    </Marker>
  );
};


const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 41.0082, lng: 28.9784 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    property_type: 'sale',
    price: '',
    gross_area: '',
    net_area: '',
    rooms: '',
    building_age: '',
    floor: '',
    total_floors: '',
    heating: '',
    bathrooms: '',
    kitchen: '',
    balcony: false,
    elevator: false,
    parking: false,
    furnished: false,
    usage_status: '',
    in_complex: false,
    complex_name: '',
    loan_available: false,
    images: '',
    matterport_url: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProperties();
  }, []);
  
  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/api/properties`, {
        headers: {
          // BURAYA DİKKAT: Ters tırnak (backtick) kullanıyoruz
          Authorization: `Bearer ${token}`
        }
      });

      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);

      if (error.response && error.response.status === 401) {
        toast.error("Oturum süresi dolmuş, tekrar giriş yapın.");
        localStorage.removeItem("token");
        navigate("/admin/login");
      } else {
        toast.error("İlanlar yüklenirken hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

const handleMapClick = async (event) => {
  const lat = event.detail.latLng.lat;
  const lng = event.detail.latLng.lng;

  if (!lat || !lng) return; 

  setSelectedLocation({ lat, lng });

  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(`${BACKEND_URL}/api/geocoding/reverse`, {
      latitude: lat,
      longitude: lng
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setFormData(prev => ({
      ...prev,
      address: response.data.formatted_address
    }));

  } catch (error) {
    console.error("Geocoding error:", error);
  }
};

  const searchAddress = async () => {
    if (!formData.address) return;
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/geocoding/address`, {
        address: formData.address
      });
      const { latitude, longitude } = response.data;
      setSelectedLocation({ lat: latitude, lng: longitude });
      setMapCenter({ lat: latitude, lng: longitude });
      setFormData({ ...formData, address: response.data.formatted_address });
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Adres bulunamadı');
    }
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      toast.error('Lütfen harita üzerinde konum seçin');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    const propertyData = {
      ...formData,
      price: parseFloat(formData.price),
      gross_area: formData.gross_area ? parseFloat(formData.gross_area) : null,
      net_area: formData.net_area ? parseFloat(formData.net_area) : null,
      building_age: formData.building_age ? parseInt(formData.building_age) : null,
      total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      location: {
        type: 'Point',
        coordinates: [selectedLocation.lng, selectedLocation.lat]
      },
      images: formData.images ? formData.images.split('\n').filter(url => url.trim()) : []
    };

    try {
      // BURASI ASIL SİHİRLİ DOKUNUŞ: headers eklendi
      await axios.post(`${BACKEND_URL}/api/properties`, propertyData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success('İlan başarıyla oluşturuldu!');
      setIsDialogOpen(false);
      fetchProperties(); // Listeyi güncellemesi için
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('İlan kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      address: property.address,
      property_type: property.property_type,
      price: property.price.toString(),
      gross_area: property.gross_area?.toString() || '',
      net_area: property.net_area?.toString() || '',
      rooms: property.rooms || '',
      building_age: property.building_age?.toString() || '',
      floor: property.floor || '',
      total_floors: property.total_floors?.toString() || '',
      heating: property.heating || '',
      bathrooms: property.bathrooms?.toString() || '',
      kitchen: property.kitchen || '',
      balcony: property.balcony || false,
      elevator: property.elevator || false,
      parking: property.parking || false,
      furnished: property.furnished || false,
      usage_status: property.usage_status || '',
      in_complex: property.in_complex || false,
      complex_name: property.complex_name || '',
      loan_available: property.loan_available || false,
      images: property.images.join('\n'),
      matterport_url: property.matterport_url || ''
    });
    setSelectedLocation({
      lat: property.location.coordinates[1],
      lng: property.location.coordinates[0]
    });
    setMapCenter({
      lat: property.location.coordinates[1],
      lng: property.location.coordinates[0]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${BACKEND_URL}/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('İlan silindi');
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Silme işlemi başarısız');
    }
  };

  const resetForm = () => {
    setEditingProperty(null);
    setSelectedLocation(null);
    setFormData({
      title: '',
      description: '',
      address: '',
      property_type: 'sale',
      price: '',
      gross_area: '',
      net_area: '',
      rooms: '',
      building_age: '',
      floor: '',
      total_floors: '',
      heating: '',
      bathrooms: '',
      kitchen: '',
      balcony: false,
      elevator: false,
      parking: false,
      furnished: false,
      usage_status: '',
      in_complex: false,
      complex_name: '',
      loan_available: false,
      images: '',
      matterport_url: ''
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
    <div className="min-h-screen bg-slate-50 pt-24" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-4xl font-semibold"
            style={{ fontFamily: 'Playfair Display, serif', color: '#0F172A' }}
          >
            İlan Yönetimi
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#3498DB] text-white hover:bg-[#2980B9]"
                data-testid="create-property-btn"
              >
                <Plus className="mr-2 h-5 w-5" />
                Yeni İlan Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? 'İlan Düzenle' : 'Yeni İlan Oluştur'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Başlık *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      data-testid="input-title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Açıklama *</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                      data-testid="input-description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">İlan Tipi *</label>
                    <Select value={formData.property_type} onValueChange={(value) => setFormData({ ...formData, property_type: value })}>
                      <SelectTrigger data-testid="select-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Satılık</SelectItem>
                        <SelectItem value="rent">Kiralık</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Fiyat (TL) *</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      data-testid="input-price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Brüt Alan (m²)</label>
                    <Input
                      type="number"
                      value={formData.gross_area}
                      onChange={(e) => setFormData({ ...formData, gross_area: e.target.value })}
                      data-testid="input-gross-area"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Net Alan (m²)</label>
                    <Input
                      type="number"
                      value={formData.net_area}
                      onChange={(e) => setFormData({ ...formData, net_area: e.target.value })}
                      data-testid="input-net-area"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Oda Sayısı (örn: 3+1)</label>
                    <Input
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      data-testid="input-rooms"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bina Yaşı</label>
                    <Input
                      type="number"
                      value={formData.building_age}
                      onChange={(e) => setFormData({ ...formData, building_age: e.target.value })}
                      data-testid="input-building-age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bulunduğu Kat</label>
                    <Input
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      data-testid="input-floor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Toplam Kat Sayısı</label>
                    <Input
                      type="number"
                      value={formData.total_floors}
                      onChange={(e) => setFormData({ ...formData, total_floors: e.target.value })}
                      data-testid="input-total-floors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Isıtma</label>
                    <Input
                      value={formData.heating}
                      onChange={(e) => setFormData({ ...formData, heating: e.target.value })}
                      placeholder="Merkezi, Doğalgaz, vb."
                      data-testid="input-heating"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Banyo Sayısı</label>
                    <Input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      data-testid="input-bathrooms"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mutfak</label>
                    <Input
                      value={formData.kitchen}
                      onChange={(e) => setFormData({ ...formData, kitchen: e.target.value })}
                      placeholder="Açık, Kapalı, Amerikan"
                      data-testid="input-kitchen"
                    />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.balcony}
                        onChange={(e) => setFormData({ ...formData, balcony: e.target.checked })}
                        className="rounded"
                        data-testid="checkbox-balcony"
                      />
                      <span className="text-sm">Balkon</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.elevator}
                        onChange={(e) => setFormData({ ...formData, elevator: e.target.checked })}
                        className="rounded"
                        data-testid="checkbox-elevator"
                      />
                      <span className="text-sm">Asansör</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.parking}
                        onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
                        className="rounded"
                        data-testid="checkbox-parking"
                      />
                      <span className="text-sm">Otopark</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.furnished}
                        onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                        className="rounded"
                        data-testid="checkbox-furnished"
                      />
                      <span className="text-sm">Eşyalı</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Kullanım Durumu</label>
                    <Input
                      value={formData.usage_status}
                      onChange={(e) => setFormData({ ...formData, usage_status: e.target.value })}
                      placeholder="Boş, Kiracılı, Maliksahip"
                      data-testid="input-usage-status"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.in_complex}
                        onChange={(e) => setFormData({ ...formData, in_complex: e.target.checked })}
                        className="rounded"
                        data-testid="checkbox-in-complex"
                      />
                      <span className="text-sm font-medium">Site İçi</span>
                    </label>
                  </div>

                  {formData.in_complex && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Site Adı</label>
                      <Input
                        value={formData.complex_name}
                        onChange={(e) => setFormData({ ...formData, complex_name: e.target.value })}
                        data-testid="input-complex-name"
                      />
                    </div>
                  )}

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.loan_available}
                        onChange={(e) => setFormData({ ...formData, loan_available: e.target.checked })}
                        className="rounded"
                        data-testid="checkbox-loan"
                      />
                      <span className="text-sm font-medium">Krediye Uygun</span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Konum * <span className="text-xs text-slate-500">(Haritadan seçin veya adres arayın)</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Adres girin..."
                        data-testid="input-address"
                      />
                      <Button type="button" onClick={searchAddress} variant="outline">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                    <div style={{ height: '300px', width: '100%', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
  <MapContainer 
    center={mapCenter} 
    zoom={15} 
    scrollWheelZoom={false} 
    style={{ height: '100%', width: '100%' }}
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    
    {/* İŞTE EKSİKSİZ, SİHİRLİ SATIR: */}
    <LocationMarker 
  formData={formData} 
  setFormData={setFormData} 
  setSelectedLocation={setSelectedLocation} 
/>


  </MapContainer>
</div>

                    {selectedLocation && (
                      <p className="text-xs text-slate-600 mt-2">
                        Seçilen konum: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Fotoğraf URL'leri <span className="text-xs text-slate-500">(Her satıra bir URL)</span>
                    </label>
                    <Textarea
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      rows={4}
                      placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      data-testid="input-images"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Matterport 3D Tur URL</label>
                    <Input
                      value={formData.matterport_url}
                      onChange={(e) => setFormData({ ...formData, matterport_url: e.target.value })}
                      placeholder="https://my.matterport.com/show/?m=..."
                      data-testid="input-matterport"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" className="bg-[#3498DB] text-white hover:bg-[#2980B9]" data-testid="submit-property-btn">
                    {editingProperty ? 'Güncelle' : 'Oluştur'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3498DB]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Başlık</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tip</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Fiyat</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Alan</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-b hover:bg-slate-50" data-testid="property-row">
                    <td className="px-6 py-4">{property.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${property.property_type === 'sale' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {property.property_type === 'sale' ? 'Satılık' : 'Kiralık'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatPrice(property.price)}</td>
                    <td className="px-6 py-4">{property.net_area ? `${property.net_area} m²` : '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(property)}
                        className="mr-2"
                        data-testid="edit-property-btn"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 hover:text-red-700"
                        data-testid="delete-property-btn"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
