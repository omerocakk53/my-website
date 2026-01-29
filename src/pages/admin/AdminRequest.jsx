import React, { useState } from "react";
import api from "../../api/axios";
import { Search, Loader2, Globe, FileText } from "lucide-react";
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
    <div className="max-w-2xl mx-auto p-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Yeni Tarama Başlat</CardTitle>
          <CardDescription>
            URL girerek otomatik veri kazıma işlemi başlatabilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Hedef URL</Label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  id="url"
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tarama Tipi</Label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setType("dynamic")}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col gap-2 ${
                    type === "dynamic"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card hover:bg-accent/50 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <Globe size={18} />
                    Dinamik (Puppeteer)
                  </div>
                  <div className="text-xs opacity-80">
                    Javascript kullanan modern siteler için (Yavaş ama güçlü)
                  </div>
                </div>

                <div
                  onClick={() => setType("static")}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col gap-2 ${
                    type === "static"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card hover:bg-accent/50 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <FileText size={18} />
                    Statik (Cheerio)
                  </div>
                  <div className="text-xs opacity-80">
                    Basit HTML siteler için (Çok hızlı)
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Taranıyor...
                </>
              ) : (
                "Taramayı Başlat"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRequest;
