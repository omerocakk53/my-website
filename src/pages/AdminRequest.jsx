import React, { useState } from "react";
import api from "../api/axios";
import { Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminRequest = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [type, setType] = useState("dynamic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/scrape", {
        url,
        type,
      });

      if (response.data.success) {
        // İşlem başarılıysa dashboard'a yönlendir veya dosyayı göster
        const filename = response.data.info.savedToFile;
        navigate(`/admin/file/${filename}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8">Yeni Tarama Başlat</h2>

      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Hedef URL
            </label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="url"
                required
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Tarama Tipi
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType("dynamic")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  type === "dynamic"
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-600"
                }`}
              >
                <div className="font-semibold mb-1">Dinamik (Puppeteer)</div>
                <div className="text-xs opacity-70">
                  Javascript kullanan modern siteler için (Yavaş ama güçlü)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType("static")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  type === "static"
                    ? "border-green-500 bg-green-500/10 text-green-400"
                    : "border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-600"
                }`}
              >
                <div className="font-semibold mb-1">Statik (Cheerio)</div>
                <div className="text-xs opacity-70">
                  Basit HTML siteler için (Çok hızlı)
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
              loading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-900/50 text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Taranıyor...</span>
              </>
            ) : (
              <span>Taramayı Başlat</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRequest;
