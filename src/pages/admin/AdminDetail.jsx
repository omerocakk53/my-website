import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/admin/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/admin/components/ui/tabs";
import { ScrollArea } from "@/admin/components/ui/scroll-area";
import { Button } from "@/admin/components/ui/button";
import { Separator } from "@/admin/components/ui/separator";

const AdminDetail = () => {
  const { filename } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!data) return <div className="text-foreground">Dosya bulunamadı</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/admin">
          <Button variant="outline" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div className="overflow-hidden">
          <h2 className="text-2xl font-bold text-foreground truncate max-w-2xl">
            {filename}
          </h2>
          <p className="text-muted-foreground text-sm truncate">
            {data.metadata?.title}
          </p>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="summary">Özet Görünüm</TabsTrigger>
          <TabsTrigger value="json">Raw JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metadata Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold text-foreground">
                  <Code className="mr-2 text-primary" size={20} />
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase font-bold">
                    Title
                  </label>
                  <p className="text-foreground">
                    {data.metadata?.title || "-"}
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-xs text-muted-foreground uppercase font-bold">
                    Description
                  </label>
                  <p className="text-muted-foreground text-sm">
                    {data.metadata?.description || "-"}
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-xs text-muted-foreground uppercase font-bold">
                    H1 Headers
                  </label>
                  <ul className="list-disc list-inside text-muted-foreground text-sm mt-1">
                    {data.headings?.h1?.length > 0 ? (
                      data.headings.h1.map((h, i) => <li key={i}>{h}</li>)
                    ) : (
                      <li>Başlık bulunamadı</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-card border-border h-fit">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  İstatistikler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-foreground block">
                      {data.links?.length || 0}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center mt-1">
                      <LinkIcon size={14} className="mr-1" /> Link
                    </span>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-foreground block">
                      {data.images?.length || 0}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center mt-1">
                      <ImageIcon size={14} className="mr-1" /> Görsel
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Links List (Scrollable) */}
            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Bulunan Linkler (İlk 50)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-60 w-full rounded-md border border-border p-4">
                  <div className="space-y-2">
                    {data.links?.slice(0, 50).map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-3 bg-secondary/30 rounded-lg hover:bg-secondary/60 transition-colors group"
                      >
                        <div className="text-primary font-medium truncate group-hover:underline">
                          {link.text || "(No Text)"}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {link.href}
                        </div>
                      </a>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="json" className="mt-4">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="bg-muted p-4 rounded-lg overflow-auto max-h-[80vh]">
                <pre className="text-green-500 font-mono text-sm">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDetail;
