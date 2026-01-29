import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  FileJson,
  Calendar,
  HardDrive,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/admin/components/ui/card";
import { Button } from "@/admin/components/ui/button";
import { Badge } from "@/admin/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/admin/components/ui/alert-dialog";

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
    try {
      await api.delete(`/files/${filename}`);
      fetchFiles();
    } catch (error) {
      console.error("Silme işlemi başarısız", error);
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
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          Scraped Files
        </h2>
        <Badge
          variant="outline"
          className="text-sm py-1 px-3 border-primary/20 bg-primary/5 text-primary"
        >
          Toplam: {files.length} Dosya
        </Badge>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-20 bg-card/50 rounded-2xl border border-border border-dashed">
          <FileJson size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl text-muted-foreground">Henüz hiç veri yok</h3>
          <p className="text-muted-foreground/80 mt-2">
            Yeni bir tarama başlatarak veri oluşturabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <Card
              key={file.name}
              className="group hover:border-primary/50 transition-all hover:shadow-lg bg-card border-border"
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <FileJson size={24} />
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/admin/file/${file.name}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-primary"
                    >
                      <Eye size={16} />
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">
                          Emin misiniz?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          "{file.name}" dosyası kalıcı olarak silinecektir. Bu
                          işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground">
                          İptal
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteFile(file.name)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle
                  className="text-lg truncate mb-2 text-foreground"
                  title={file.name}
                >
                  {file.name}
                </CardTitle>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} />
                    <span>{formatDate(file.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HardDrive size={14} />
                    <span>{formatSize(file.size)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
