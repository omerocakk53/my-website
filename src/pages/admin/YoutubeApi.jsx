import React, { useState } from "react";
import api from "../../api/axios";
import {
  Youtube,
  Play,
  Loader2,
  Terminal,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/admin/components/ui/card";
import { Input } from "@/admin/components/ui/input";
import { Button } from "@/admin/components/ui/button";
import { Label } from "@/admin/components/ui/label";
import { Badge } from "@/admin/components/ui/badge";

const YoutubeApi = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [limit, setLimit] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        url,
        limit: parseInt(limit, 10),
      };

      const response = await api.post("/scrape/youtube", payload);

      if (response.data.success) {
        const filename = response.data.info.savedToFile;
        navigate(`/admin/file/${filename}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || err.response?.data?.error || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header Section - Apify Style */}
      <div className="flex items-start gap-4 mb-8">
        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <Youtube className="w-10 h-10 text-red-600" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              YouTube Comment Scraper
            </h1>
            <Badge variant="secondary" className="text-xs font-normal">
              v1.0.0
            </Badge>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-green-200">
              Public
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            YouTube videolarından yorumları, yazarları, beğenileri ve tarihleri
            otomatik olarak çeker.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Input Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Input Parameters</CardTitle>
              </div>
              <CardDescription>
                Kazıma işlemi için gerekli parametreleri girin.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="url"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    YouTube Video URL
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-12 font-mono text-sm"
                  />
                  <p className="text-[13px] text-muted-foreground">
                    Yorumlarını çekmek istediğiniz YouTube videosunun tam
                    bağlantısı.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="limit"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    Maksimum Yorum Sayısı (Limit)
                  </Label>
                  <Input
                    id="limit"
                    type="number"
                    min="1"
                    placeholder="100"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="h-12 font-mono text-sm"
                  />
                  <p className="text-[13px] text-muted-foreground">
                    Kaç adet yorum çekileceğini belirleyin. Hepsini çekmek için
                    çok yüksek bir sayı girin (örn: 10000).
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-sm font-medium">{error}</div>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base font-semibold shadow-md transition-all hover:scale-[1.01]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        İşleniyor (Bu işlem biraz sürebilir)...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5 fill-current" />
                        Çalıştır (Run Actor)
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info / Sidebar Column */}
        <div className="space-y-6">
          <Card className="bg-muted/30 border-border">
            <CardHeader>
              <CardTitle className="text-base">Bilgi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Fiyatlandırma</span>
                <span className="font-medium">Ücretsiz</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Platform</span>
                <span className="font-medium">YouTube</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Çıktı Formatı</span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  JSON
                </span>
              </div>
              <div className="pt-2">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Özellikler
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs ml-1">
                  <li>Yorum metni</li>
                  <li>Yazar bilgisi</li>
                  <li>Beğeni sayıları</li>
                  <li>Tarih bilgisi</li>
                  <li>Avatar URL</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default YoutubeApi;
