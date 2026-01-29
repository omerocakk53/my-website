import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { FileJson, Calendar, HardDrive, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await api.get("/files");
      if (response.data.success) {
        setFiles(response.data.files);
      }
    } catch (error) {
      console.error("Dosyalar yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (filename) => {
    if (!window.confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;

    try {
      await api.delete(`/files/${filename}`);
      fetchFiles(); // Listeyi güncelle
    } catch (error) {
      alert("Silme işlemi başarısız");
      return error;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("tr-TR");
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Scraped Files</h2>
        <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-400 border border-gray-700">
          Toplam: {files.length} Dosya
        </span>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700 border-dashed">
          <FileJson size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl text-gray-400">Henüz hiç veri yok</h3>
          <p className="text-gray-500 mt-2">
            Yeni bir tarama başlatarak veri oluşturabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <div
              key={file.name}
              className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-900/10 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                  <FileJson size={24} />
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to={`/admin/file/${file.name}`}
                    className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                    title="Görüntüle"
                  >
                    <Eye size={18} />
                  </Link>
                  <button
                    onClick={() => deleteFile(file.name)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                    title="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3
                className="text-lg font-semibold text-gray-200 truncate mb-2"
                title={file.name}
              >
                {file.name}
              </h3>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar size={14} />
                  <span>{formatDate(file.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HardDrive size={14} />
                  <span>{formatSize(file.size)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
