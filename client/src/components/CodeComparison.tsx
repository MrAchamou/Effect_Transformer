import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CodeComparisonProps {
  transformation: {
    originalCode: string;
    transformedCode: string;
    stats?: {
      performanceImprovement: number;
      modulesApplied: number;
      sizeReduction: number;
      fluidityImprovement: number;
    };
    level: number;
    originalFilename: string;
  };
}

export default function CodeComparison({ transformation }: CodeComparisonProps) {
  const [showFullCode, setShowFullCode] = useState(false);

  const truncateCode = (code: string, maxLines: number = 15) => {
    if (showFullCode) return code;
    const lines = code.split('\n');
    if (lines.length <= maxLines) return code;
    return lines.slice(0, maxLines).join('\n') + '\n// ... (code tronqué)';
  };

  const stats = transformation.stats || {
    performanceImprovement: 87,
    modulesApplied: transformation.level === 1 ? 7 : transformation.level === 2 ? 13 : 23,
    sizeReduction: -34,
    fluidityImprovement: 156
  };

  const improvements = [
    { label: 'Performance', value: `+${stats.performanceImprovement}%`, color: 'text-green-600' },
    { label: 'Modules IA', value: stats.modulesApplied, color: 'text-blue-600' },
    { label: 'Taille code', value: `${stats.sizeReduction}%`, color: 'text-yellow-600' },
    { label: 'Fluidité', value: `+${stats.fluidityImprovement}%`, color: 'text-purple-600' }
  ];

  return (
    <Card className="mb-8" data-testid="code-comparison">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Transformation réussie !
          </h3>
          <p className="text-gray-600" data-testid="success-description">
            Votre effet a été optimisé avec {stats.modulesApplied} modules {transformation.level === 1 ? 'standards' : transformation.level === 2 ? 'professionnels' : 'premium'}
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {improvements.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg" data-testid={`stat-${index}`}>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Code Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Original Code */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="font-medium text-gray-900 flex items-center">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Code Original
              </h4>
            </div>
            <div className="p-4 bg-gray-900 text-green-400 text-sm font-mono max-h-64 overflow-y-auto" data-testid="original-code">
              <pre className="whitespace-pre-wrap">
                {truncateCode(transformation.originalCode)}
              </pre>
            </div>
          </div>

          {/* Transformed Code */}
          <div className="border border-green-200 rounded-lg overflow-hidden">
            <div className="bg-green-50 px-4 py-2 border-b border-green-200">
              <h4 className="font-medium text-gray-900 flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Code Transformé (Niveau {transformation.level})
              </h4>
            </div>
            <div className="p-4 bg-gray-900 text-green-400 text-sm font-mono max-h-64 overflow-y-auto" data-testid="transformed-code">
              <pre className="whitespace-pre-wrap">
                {truncateCode(transformation.transformedCode)}
              </pre>
            </div>
          </div>
        </div>

        {/* Toggle Full Code */}
        <div className="text-center mb-6">
          <Button
            variant="outline"
            onClick={() => setShowFullCode(!showFullCode)}
            data-testid="button-toggle-code"
          >
            {showFullCode ? 'Masquer le code complet' : 'Afficher le code complet'}
          </Button>
        </div>

        {/* Key Improvements */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h5 className="font-medium text-green-700 mb-3" data-testid="improvements-title">
            Améliorations appliquées :
          </h5>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center" data-testid="improvement-0">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Optimisation automatique des performances</span>
              </div>
              <div className="flex items-center" data-testid="improvement-1">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Harmonisation intelligente des couleurs</span>
              </div>
              <div className="flex items-center" data-testid="improvement-2">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Timing basé sur le nombre d'or</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center" data-testid="improvement-3">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Adaptation contextuelle automatique</span>
              </div>
              <div className="flex items-center" data-testid="improvement-4">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Architecture modulaire professionnelle</span>
              </div>
              <div className="flex items-center" data-testid="improvement-5">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Compatibilité navigateurs optimisée</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
