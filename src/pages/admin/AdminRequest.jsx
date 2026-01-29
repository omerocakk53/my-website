import React, { useState } from "react";
import api from "../../api/axios";
import {
  Search,
  Loader2,
  Globe,
  FileText,
  Plus,
  Trash2,
  Code,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/admin/components/ui/tabs";

const AdminRequest = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("dynamic"); // static, dynamic
  const [scrapeType, setScrapeType] = useState("general"); // general, custom
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Custom selectors state
  const [selectors, setSelectors] = useState([
    { name: "", selector: "", attr: "" },
  ]);

  const handleAddSelector = () => {
    setSelectors([...selectors, { name: "", selector: "", attr: "" }]);
  };

  const handleRemoveSelector = (index) => {
    const newSelectors = selectors.filter((_, i) => i !== index);
    setSelectors(newSelectors);
  };

  const handleSelectorChange = (index, field, value) => {
    const newSelectors = [...selectors];
    newSelectors[index][field] = value;
    setSelectors(newSelectors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        url,
        method,
        scrapeType,
      };

      if (scrapeType === "custom") {
        // Filter out empty selectors
        const validSelectors = selectors.filter((s) => s.name && s.selector);
        if (validSelectors.length === 0) {
          throw new Error("En az bir geçerli seçici girmelisiniz.");
        }
        payload.selectors = validSelectors;
      }

      const response = await api.post("/scrape", payload);

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
    <div className="max-w-3xl mx-auto p-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Yeni Tarama Başlat</CardTitle>
          <CardDescription>
            İhtiyacınıza uygun tarama tipini seçerek veri kazıma işlemini
            başlatın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="general"
            value={scrapeType}
            onValueChange={setScrapeType}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="general">Fix Kazıma (Genel)</TabsTrigger>
              <TabsTrigger value="custom">Özel İçerik Kazıma</TabsTrigger>
            </TabsList>

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
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tarama Yöntemi</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setMethod("dynamic")}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col gap-2 ${
                      method === "dynamic"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:bg-accent/50 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Globe size={18} />
                      Dinamik (Puppeteer)
                    </div>
                    <div className="text-xs opacity-80">
                      JS yoğun siteler için (Yavaş, Güçlü)
                    </div>
                  </div>

                  <div
                    onClick={() => setMethod("static")}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col gap-2 ${
                      method === "static"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:bg-accent/50 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <FileText size={18} />
                      Statik (Cheerio)
                    </div>
                    <div className="text-xs opacity-80">
                      HTML siteler için (Çok Hızlı)
                    </div>
                  </div>
                </div>
              </div>

              <TabsContent
                value="custom"
                className="space-y-4 pt-4 border-t border-border mt-6"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-primary flex items-center gap-2">
                    <Code size={18} />
                    CSS Seçicileri
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSelector}
                  >
                    <Plus size={16} className="mr-1" /> Alan Ekle
                  </Button>
                </div>

                <div className="space-y-3">
                  {selectors.map((selector, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-start animate-in fade-in slide-in-from-top-2"
                    >
                      <div className="flex-1 space-y-1">
                        {index === 0 && (
                          <Label className="text-xs text-muted-foreground">
                            Alan Adı (örn: fiyat)
                          </Label>
                        )}
                        <Input
                          placeholder="Alan Adı"
                          value={selector.name}
                          onChange={(e) =>
                            handleSelectorChange(index, "name", e.target.value)
                          }
                          required={scrapeType === "custom"}
                        />
                      </div>
                      <div className="flex-[2] space-y-1">
                        {index === 0 && (
                          <Label className="text-xs text-muted-foreground">
                            CSS Seçici (örn: .product-price)
                          </Label>
                        )}
                        <Input
                          placeholder="CSS Selector"
                          value={selector.selector}
                          onChange={(e) =>
                            handleSelectorChange(
                              index,
                              "selector",
                              e.target.value,
                            )
                          }
                          required={scrapeType === "custom"}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        {index === 0 && (
                          <Label className="text-xs text-muted-foreground">
                            Attr (Opsiyonel)
                          </Label>
                        )}
                        <Input
                          placeholder="href, src..."
                          value={selector.attr}
                          onChange={(e) =>
                            handleSelectorChange(index, "attr", e.target.value)
                          }
                        />
                      </div>
                      <div className={index === 0 ? "pt-5" : ""}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveSelector(index)}
                          disabled={selectors.length === 1}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">
                  * Metin içeriği almak için "Attr" kısmını boş bırakın. Link
                  (href) veya resim (src) almak için özelliği belirtin.
                </p>
              </TabsContent>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRequest;
