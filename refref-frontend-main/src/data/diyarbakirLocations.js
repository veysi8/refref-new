export const diyarbakirData = {
  city: "Diyarbakır",
  districts: [
    {
      name: "Bağlar",
      neighborhoods: ["Bağcılar", "Şeyh Şamil", "Huzurevleri", "Mezopotamya", "İskenderpaşa", "Huzur", "Şanlıurfa", "Cumhuriyet"]
    },
    {
      name: "Kayapınar",
      neighborhoods: ["Talaytepe", "Diclekent", "Fırat", "Önder", "Medya", "Huzurevleri", "Şafak", "Barış", "Bağlar"]
    },
    {
      name: "Sur",
      neighborhoods: ["Dabanoğlu", "Melikahmet", "Lalebey", "Alibey", "Ziyagökalp", "Cemal Yılmaz", "Fatihpaşa", "Hasırlı", "İnönü", "Cevatpaşa"]
    },
    {
      name: "Yenişehir",
      neighborhoods: ["Yeni Mahalle", "Şeyh Şamil", "Muradiye", "Aziziye", "Gevran", "Şeyhyasin", "Peyas", "Karşıyaka", "Sümer", "Fırat"]
    },
    {
      name: "Bismil",
      neighborhoods: ["Merkez", "Tepe", "Kale", "Yenimahalle"]
    },
    {
      name: "Çermik",
      neighborhoods: ["Merkez", "Kayalıpınar", "Yenişehir"]
    },
    {
      name: "Çınar",
      neighborhoods: ["Merkez", "Cumhuriyet", "Fatih"]
    },
    {
      name: "Çüngüş",
      neighborhoods: ["Merkez", "Yeni Mahalle"]
    },
    {
      name: "Dicle",
      neighborhoods: ["Merkez", "Karşıyaka", "Yenişehir"]
    },
    {
      name: "Eğil",
      neighborhoods: ["Merkez", "Fatih", "Yenimahalle"]
    },
    {
      name: "Ergani",
      neighborhoods: ["Merkez", "Yeni Mahalle", "İstasyon", "Cumhuriyet", "Bahçelievler"]
    },
    {
      name: "Hani",
      neighborhoods: ["Merkez", "Cumhuriyet", "Yenimahalle"]
    },
    {
      name: "Hazro",
      neighborhoods: ["Merkez", "Yenişehir", "Cumhuriyet"]
    },
    {
      name: "Kocaköy",
      neighborhoods: ["Merkez", "Yeni Mahalle"]
    },
    {
      name: "Kulp",
      neighborhoods: ["Merkez", "Cumhuriyet", "Yenimahalle"]
    },
    {
      name: "Lice",
      neighborhoods: ["Merkez", "Cumhuriyet", "Kültür"]
    },
    {
      name: "Silvan",
      neighborhoods: ["Merkez", "Konak", "Tekel", "Yenişehir", "Mimar Sinan", "Bahçelievler"]
    }
  ],
  
  getDistrictNames: function() {
    return this.districts.map(d => d.name);
  },
  
  getNeighborhoodsByDistrict: function(districtName) {
    const district = this.districts.find(d => d.name === districtName);
    return district ? district.neighborhoods : [];
  },
  
  getNeighborhoodsByDistricts: function(districtNames) {
    if (!districtNames || districtNames.length === 0) {
      return [];
    }
    const neighborhoods = [];
    districtNames.forEach(districtName => {
      const district = this.districts.find(d => d.name === districtName);
      if (district) {
        neighborhoods.push(...district.neighborhoods);
      }
    });
    return neighborhoods;
  }
};
