import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Download,
} from "lucide-react";

const AdminDetail = () => {
  const { filename } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary"); // summary, json

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/files/${filename}`);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Veri yüklenemedi", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filename]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) return <div className="text-white">Dosya bulunamadı</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link
          to="/admin"
          className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white truncate max-w-2xl">
            {filename}
          </h2>
          <p className="text-gray-400 text-sm">{data.metadata?.title}</p>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-gray-700 pb-1">
        <button
          onClick={() => setActiveTab("summary")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === "summary"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          Özet Görünüm
        </button>
        <button
          onClick={() => setActiveTab("json")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === "json"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          Raw JSON
        </button>
      </div>

      {activeTab === "summary" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Metadata Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Code className="mr-2 text-blue-400" size={20} />
              Metadata
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase">Title</label>
                <p className="text-gray-200">{data.metadata?.title || "-"}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">
                  Description
                </label>
                <p className="text-gray-300 text-sm">
                  {data.metadata?.description || "-"}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">
                  H1 Headers
                </label>
                <ul className="list-disc list-inside text-gray-300 text-sm">
                  {data.headings?.h1?.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              İstatistikler
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <span className="text-3xl font-bold text-white block">
                  {data.links?.length || 0}
                </span>
                <span className="text-sm text-gray-400 flex items-center">
                  <LinkIcon size={14} className="mr-1" /> Link
                </span>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <span className="text-3xl font-bold text-white block">
                  {data.images?.length || 0}
                </span>
                <span className="text-sm text-gray-400 flex items-center">
                  <ImageIcon size={14} className="mr-1" /> Görsel
                </span>
              </div>
            </div>
          </div>

          {/* Links List (Scrollable) */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">
              Bulunan Linkler (İlk 50)
            </h3>
            <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {data.links?.slice(0, 50).map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-3 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <div className="text-blue-400 font-medium truncate group-hover:underline">
                    {link.text || "(No Text)"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {link.href}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 overflow-auto">
          <pre className="text-green-400 font-mono text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AdminDetail;
