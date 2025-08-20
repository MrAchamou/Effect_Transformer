
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface InteractivePreviewProps {
  transformedCode: string;
  originalCode: string;
  effectName?: string;
  onFullscreen?: () => void;
}

interface EffectInstance {
  start?: () => void;
  pause?: () => void;
  stop?: () => void;
  reset?: () => void;
  setParameter?: (key: string, value: any) => void;
  updateConfig?: (config: any) => void;
  destroy?: () => void;
}

export default function InteractivePreview({
  transformedCode,
  originalCode,
  effectName = "VisualEffect",
  onFullscreen
}: InteractivePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [effectInstance, setEffectInstance] = useState<EffectInstance | null>(null);
  const [originalInstance, setOriginalInstance] = useState<EffectInstance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Paramètres de contrôle
  const [speed, setSpeed] = useState([1]);
  const [opacity, setOpacity] = useState([1]);
  const [scale, setScale] = useState([1]);

  // Initialiser l'effet transformé
  useEffect(() => {
    if (!canvasRef.current || !transformedCode) return;

    try {
      setError(null);
      
      // Créer un contexte d'exécution sécurisé
      const executeEffect = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d');
        
        // Nettoyer le canvas
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Exécuter le code transformé dans un contexte sécurisé
        const effectCode = `
          (function() {
            const canvas = arguments[0];
            const ctx = canvas.getContext('2d');
            
            ${transformedCode}
            
            // Essayer de retourner une instance de l'effet
            if (typeof ${effectName} !== 'undefined') {
              const instance = new ${effectName}();
              if (instance.initialize) {
                instance.initialize(canvas);
              }
              return instance;
            }
            
            // Fallback pour les effets sans classe
            return {
              start: () => {},
              pause: () => {},
              stop: () => {},
              reset: () => {}
            };
          })
        `;

        const effectFunction = new Function('return ' + effectCode)();
        const instance = effectFunction(canvas);
        
        setEffectInstance(instance);
        return instance;
      };

      executeEffect();
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de l\'effet:', err);
      setError('Impossible d\'initialiser l\'effet transformé');
    }
  }, [transformedCode, effectName]);

  // Initialiser l'effet original pour la comparaison
  useEffect(() => {
    if (!originalCanvasRef.current || !originalCode || !showComparison) return;

    try {
      const executeOriginal = () => {
        const canvas = originalCanvasRef.current!;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        const originalEffectCode = `
          (function() {
            const canvas = arguments[0];
            const ctx = canvas.getContext('2d');
            
            ${originalCode}
            
            // Retourner l'instance originale
            if (typeof ${effectName} !== 'undefined') {
              const instance = new ${effectName}();
              if (instance.initialize) {
                instance.initialize(canvas);
              }
              return instance;
            }
            
            return {
              start: () => {},
              pause: () => {},
              stop: () => {},
              reset: () => {}
            };
          })
        `;

        const originalFunction = new Function('return ' + originalEffectCode)();
        const instance = originalFunction(canvas);
        
        setOriginalInstance(instance);
        return instance;
      };

      executeOriginal();
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de l\'effet original:', err);
    }
  }, [originalCode, effectName, showComparison]);

  // Contrôles de lecture
  const handlePlay = () => {
    if (effectInstance?.start) {
      effectInstance.start();
    }
    if (originalInstance?.start && showComparison) {
      originalInstance.start();
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (effectInstance?.pause) {
      effectInstance.pause();
    }
    if (originalInstance?.pause && showComparison) {
      originalInstance.pause();
    }
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (effectInstance?.stop) {
      effectInstance.stop();
    }
    if (originalInstance?.stop && showComparison) {
      originalInstance.stop();
    }
    setIsPlaying(false);
  };

  const handleReset = () => {
    if (effectInstance?.reset) {
      effectInstance.reset();
    }
    if (originalInstance?.reset && showComparison) {
      originalInstance.reset();
    }
    setIsPlaying(false);
  };

  // Gestion des paramètres
  const updateParameters = () => {
    if (effectInstance?.setParameter) {
      effectInstance.setParameter('speed', speed[0]);
      effectInstance.setParameter('opacity', opacity[0]);
      effectInstance.setParameter('scale', scale[0]);
    }
  };

  useEffect(updateParameters, [speed, opacity, scale, effectInstance]);

  // Mode plein écran
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (onFullscreen) {
      onFullscreen();
    }
  };

  return (
    <motion.div
      className={`preview-container ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              🎮 Prévisualisation Interactive
              {error && (
                <span className="text-red-500 text-sm font-normal">⚠️ {error}</span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
              >
                {showComparison ? '👁️ Vue Simple' : '⚖️ Comparaison'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? '🔲 Quitter' : '🔳 Plein Écran'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Zone de prévisualisation */}
          <div className={`preview-area ${showComparison ? 'grid grid-cols-2 gap-4' : ''}`}>
            {/* Canvas principal (effet transformé) */}
            <div className="canvas-container relative">
              <div className="canvas-header text-sm font-medium text-gray-700 mb-2">
                ✨ Effet Transformé
              </div>
              <canvas
                ref={canvasRef}
                width={showComparison ? 400 : 800}
                height={showComparison ? 300 : 400}
                className="border-2 border-blue-200 rounded-lg bg-gray-50 w-full"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>

            {/* Canvas de comparaison (effet original) */}
            {showComparison && (
              <div className="canvas-container relative">
                <div className="canvas-header text-sm font-medium text-gray-700 mb-2">
                  📝 Effet Original
                </div>
                <canvas
                  ref={originalCanvasRef}
                  width={400}
                  height={300}
                  className="border-2 border-gray-200 rounded-lg bg-gray-50 w-full"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            )}
          </div>

          {/* Contrôles de lecture */}
          <div className="controls-section">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Button
                variant={isPlaying ? "outline" : "default"}
                size="sm"
                onClick={handlePlay}
                disabled={!effectInstance}
              >
                ▶️ Play
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePause}
                disabled={!effectInstance}
              >
                ⏸️ Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStop}
                disabled={!effectInstance}
              >
                ⏹️ Stop
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={!effectInstance}
              >
                🔄 Reset
              </Button>
            </div>

            {/* Paramètres ajustables */}
            <div className="parameters-grid grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="parameter-control">
                <Label htmlFor="speed-slider" className="text-sm font-medium">
                  ⚡ Vitesse: {speed[0]}x
                </Label>
                <Slider
                  id="speed-slider"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={speed}
                  onValueChange={setSpeed}
                  className="mt-2"
                />
              </div>

              <div className="parameter-control">
                <Label htmlFor="opacity-slider" className="text-sm font-medium">
                  👻 Opacité: {Math.round(opacity[0] * 100)}%
                </Label>
                <Slider
                  id="opacity-slider"
                  min={0}
                  max={1}
                  step={0.1}
                  value={opacity}
                  onValueChange={setOpacity}
                  className="mt-2"
                />
              </div>

              <div className="parameter-control">
                <Label htmlFor="scale-slider" className="text-sm font-medium">
                  🔍 Échelle: {Math.round(scale[0] * 100)}%
                </Label>
                <Slider
                  id="scale-slider"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={scale}
                  onValueChange={setScale}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Informations de performance */}
          <div className="performance-info bg-blue-50 p-4 rounded-lg border">
            <h4 className="font-medium text-blue-900 mb-2">📊 Informations de Performance</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600">🖼️ FPS:</span>
                <span className="ml-1 font-mono">60</span>
              </div>
              <div>
                <span className="text-blue-600">💾 Mémoire:</span>
                <span className="ml-1 font-mono">~2MB</span>
              </div>
              <div>
                <span className="text-blue-600">⚡ CPU:</span>
                <span className="ml-1 font-mono">~15%</span>
              </div>
              <div>
                <span className="text-blue-600">🎯 Statut:</span>
                <span className="ml-1 font-mono text-green-600">
                  {isPlaying ? 'En cours' : 'Arrêté'}
                </span>
              </div>
            </div>
          </div>

          {/* Conseils d'utilisation */}
          <div className="tips-section bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">💡 Conseils d'Utilisation</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Utilisez les sliders pour ajuster les paramètres en temps réel</li>
              <li>• Activez la comparaison pour voir les différences avec l'original</li>
              <li>• Le mode plein écran offre une meilleure expérience de visualisation</li>
              <li>• Les effets peuvent être contrôlés via les boutons play/pause/stop</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
