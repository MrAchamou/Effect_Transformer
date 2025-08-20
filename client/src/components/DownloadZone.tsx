import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DownloadZoneProps {
  transformation: {
    id: string;
    originalFilename: string;
    level: number;
  };
  onNewTransformation: () => void;
}

export default function DownloadZone({ transformation, onNewTransformation }: DownloadZoneProps) {
  const { toast } = useToast();

  const handleDownload = async (type: string = 'package') => {
    try {
      const response = await fetch(`/api/download/${transformation.id}?type=${type}`);
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      if (type === 'package') {
        a.download = `${transformation.originalFilename.replace('.js', '')}_complet.zip`;
      } else {
        a.download = transformation.originalFilename.replace('.js', '_transformed.js');
      }
      
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Téléchargement réussi",
        description: type === 'package' 
          ? "Package complet avec documentation téléchargé" 
          : "Code JavaScript téléchargé",
      });
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le fichier",
        variant: "destructive",
      });
    }
  };

  const handlePreview = () => {
    // Ouvrir la documentation dans un nouvel onglet
    window.open(`/api/preview/${transformation.id}`, '_blank');
    toast({
      title: "Documentation ouverte",
      description: "La documentation interactive s'ouvre dans un nouvel onglet",
    });
  };

  const handleShare = () => {
    // This would open share options
    toast({
      title: "Partage",
      description: "Fonctionnalité à venir",
    });
  };

  const levelName = transformation.level === 1 ? 'standard' : 
                   transformation.level === 2 ? 'pro' : 'premium';

  return (
    <Card data-testid="download-zone">
      <CardContent className="p-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Étape 3: Téléchargez votre effet transformé
          </h3>
          
          {/* Download Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button
              onClick={() => handleDownload('package')}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
              data-testid="button-download-package"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Package Complet avec Documentation
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleDownload('code-only')}
              className="px-6 py-3"
              data-testid="button-download-code"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Code Seul (.js)
            </Button>
            
            <Button
              variant="outline"
              onClick={handlePreview}
              className="px-6 py-3"
              data-testid="button-preview"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Documentation Interactive
            </Button>
          </div>
          
          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <div className="text-sm text-blue-800" data-testid="download-info">
              <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <strong>Package Professionnel :</strong> Inclut le code optimisé, documentation complète, 
              exemples d'utilisation, guide d'installation, et licence commerciale. 
              Prêt pour ThemeForest/CodeCanyon !
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="ghost"
              onClick={onNewTransformation}
              className="text-blue-500 hover:text-blue-600"
              data-testid="button-new-transformation"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Transformer un autre effet
            </Button>
            <Button
              variant="ghost"
              onClick={handleShare}
              className="text-gray-600 hover:text-gray-800"
              data-testid="button-share"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Partager les résultats
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
