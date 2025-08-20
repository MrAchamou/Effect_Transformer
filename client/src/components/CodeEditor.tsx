
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface CodeEditorProps {
  initialCode: string;
  originalCode: string;
  onCodeChange: (code: string) => void;
  effectName?: string;
  language?: string;
}

interface EditorFeatures {
  lineNumbers: boolean;
  syntaxHighlight: boolean;
  autoComplete: boolean;
  errorDetection: boolean;
}

export default function CodeEditor({
  initialCode,
  originalCode,
  onCodeChange,
  effectName = "VisualEffect",
  language = "javascript"
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [activeTab, setActiveTab] = useState<'editor' | 'diff' | 'errors'>('editor');
  const [errors, setErrors] = useState<string[]>([]);
  const [features, setFeatures] = useState<EditorFeatures>({
    lineNumbers: true,
    syntaxHighlight: true,
    autoComplete: true,
    errorDetection: true
  });
  const [isModified, setIsModified] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Calculer le nombre de lignes
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

  // Gérer les changements de code
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setIsModified(newCode !== initialCode);
    onCodeChange(newCode);
    
    // Validation basique du JavaScript
    if (features.errorDetection) {
      validateCode(newCode);
    }
  };

  // Validation de code simple
  const validateCode = (codeToValidate: string) => {
    const foundErrors: string[] = [];
    
    // Vérification des parenthèses/crochets
    const openBrackets = (codeToValidate.match(/[\(\[\{]/g) || []).length;
    const closeBrackets = (codeToValidate.match(/[\)\]\}]/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      foundErrors.push("Parenthèses/crochets non équilibrés");
    }
    
    // Vérification des mots-clés JavaScript basiques
    const lines = codeToValidate.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('function') && !line.includes('(')) {
        foundErrors.push(`Ligne ${index + 1}: Syntaxe de fonction incorrecte`);
      }
      if (line.includes('if') && !line.includes('(')) {
        foundErrors.push(`Ligne ${index + 1}: Syntaxe de condition incorrecte`);
      }
    });
    
    setErrors(foundErrors);
  };

  // Gérer la position du curseur
  const handleCursorPosition = () => {
    if (editorRef.current) {
      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const lines = code.substring(0, start).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      setCursorPosition({ line, column });
    }
  };

  // Auto-complétion basique
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!features.autoComplete) return;

    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Tab pour indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
      return;
    }

    // Auto-fermeture des parenthèses
    if (e.key === '(' && features.autoComplete) {
      e.preventDefault();
      const newCode = code.substring(0, start) + '()' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
      return;
    }

    // Auto-fermeture des accolades
    if (e.key === '{') {
      e.preventDefault();
      const newCode = code.substring(0, start) + '{\n    \n}' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 6;
      }, 0);
      return;
    }
  };

  // Appliquer la coloration syntaxique (basique)
  const applySyntaxHighlighting = (codeText: string) => {
    if (!features.syntaxHighlight) return codeText;
    
    return codeText
      .replace(/(function|const|let|var|if|else|for|while|return|class|export|import)/g, 
               '<span style="color: #9d4edd; font-weight: bold;">$1</span>')
      .replace(/('.*?'|".*?")/g, '<span style="color: #52b788;">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span style="color: #6c757d; font-style: italic;">$1</span>')
      .replace(/(\d+)/g, '<span style="color: #f77f00;">$1</span>');
  };

  // Réinitialiser le code
  const resetCode = () => {
    setCode(initialCode);
    setIsModified(false);
    onCodeChange(initialCode);
  };

  // Formater le code
  const formatCode = () => {
    try {
      // Formatage basique (indentation)
      let formatted = code;
      const lines = formatted.split('\n');
      let indentLevel = 0;
      
      const formattedLines = lines.map(line => {
        const trimmed = line.trim();
        if (trimmed.includes('}')) indentLevel = Math.max(0, indentLevel - 1);
        const indented = '    '.repeat(indentLevel) + trimmed;
        if (trimmed.includes('{')) indentLevel++;
        return indented;
      });
      
      const newCode = formattedLines.join('\n');
      setCode(newCode);
      onCodeChange(newCode);
    } catch (error) {
      console.error('Erreur de formatage:', error);
    }
  };

  // Calculer les différences avec l'original
  const getDiffLines = () => {
    const originalLines = originalCode.split('\n');
    const currentLines = code.split('\n');
    const maxLines = Math.max(originalLines.length, currentLines.length);
    
    const diffs = [];
    for (let i = 0; i < maxLines; i++) {
      const original = originalLines[i] || '';
      const current = currentLines[i] || '';
      
      if (original !== current) {
        diffs.push({
          line: i + 1,
          original: original,
          current: current,
          type: !original ? 'added' : !current ? 'removed' : 'modified'
        });
      }
    }
    
    return diffs;
  };

  return (
    <motion.div
      className="code-editor-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              💻 Éditeur de Code Intégré
              {isModified && <Badge variant="secondary">Modifié</Badge>}
              {errors.length > 0 && <Badge variant="destructive">{errors.length} erreur(s)</Badge>}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={formatCode}>
                🎨 Formater
              </Button>
              <Button variant="outline" size="sm" onClick={resetCode}>
                🔄 Réinitialiser
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor">
                💻 Éditeur
              </TabsTrigger>
              <TabsTrigger value="diff">
                ⚖️ Comparaison ({getDiffLines().length})
              </TabsTrigger>
              <TabsTrigger value="errors">
                🐛 Erreurs ({errors.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
              <div className="editor-workspace">
                {/* Barre d'outils */}
                <div className="editor-toolbar bg-gray-100 p-3 rounded-t-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        📍 Ligne {cursorPosition.line}, Colonne {cursorPosition.column}
                      </span>
                      <span className="text-sm text-gray-600">
                        📄 {lineCount} lignes
                      </span>
                      <span className="text-sm text-gray-600">
                        🔤 {code.length} caractères
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={features.lineNumbers}
                          onChange={(e) => setFeatures({...features, lineNumbers: e.target.checked})}
                        />
                        N° lignes
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={features.syntaxHighlight}
                          onChange={(e) => setFeatures({...features, syntaxHighlight: e.target.checked})}
                        />
                        Coloration
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={features.autoComplete}
                          onChange={(e) => setFeatures({...features, autoComplete: e.target.checked})}
                        />
                        Auto-complétion
                      </label>
                    </div>
                  </div>
                </div>

                {/* Zone d'édition */}
                <div className="editor-area relative">
                  {features.lineNumbers && (
                    <div className="line-numbers absolute left-0 top-0 w-12 bg-gray-50 border-r text-right text-sm text-gray-500 p-2 font-mono leading-6">
                      {Array.from({ length: lineCount }, (_, i) => (
                        <div key={i + 1}>{i + 1}</div>
                      ))}
                    </div>
                  )}
                  
                  <textarea
                    ref={editorRef}
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onSelect={handleCursorPosition}
                    onClick={handleCursorPosition}
                    className={`w-full h-96 p-4 font-mono text-sm border rounded-b-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 ${
                      features.lineNumbers ? 'pl-16' : 'pl-4'
                    }`}
                    placeholder="Entrez votre code JavaScript ici..."
                    spellCheck={false}
                  />
                </div>

                {/* Conseils d'utilisation */}
                <div className="editor-tips bg-blue-50 p-3 mt-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Raccourcis Éditeur</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-800">
                    <div><kbd>Tab</kbd> : Indentation</div>
                    <div><kbd>(</kbd> : Auto-fermeture</div>
                    <div><kbd>{'{'}</kbd> : Bloc automatique</div>
                    <div><kbd>Ctrl+Z</kbd> : Annuler</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="diff">
              <div className="diff-viewer">
                <h4 className="font-medium mb-4">📊 Comparaison avec le Code Original</h4>
                
                {getDiffLines().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    ✅ Aucune modification détectée
                  </div>
                ) : (
                  <div className="diff-content space-y-2">
                    {getDiffLines().map((diff, index) => (
                      <div key={index} className="diff-line border rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={
                            diff.type === 'added' ? 'default' : 
                            diff.type === 'removed' ? 'destructive' : 
                            'secondary'
                          }>
                            {diff.type === 'added' ? '+ Ajouté' : 
                             diff.type === 'removed' ? '- Supprimé' : 
                             '~ Modifié'}
                          </Badge>
                          <span className="text-sm text-gray-600">Ligne {diff.line}</span>
                        </div>
                        
                        {diff.original && (
                          <div className="bg-red-50 p-2 rounded mb-1">
                            <span className="text-red-700 text-sm font-mono">- {diff.original}</span>
                          </div>
                        )}
                        
                        {diff.current && (
                          <div className="bg-green-50 p-2 rounded">
                            <span className="text-green-700 text-sm font-mono">+ {diff.current}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="errors">
              <div className="errors-panel">
                <h4 className="font-medium mb-4">🐛 Analyse des Erreurs</h4>
                
                {errors.length === 0 ? (
                  <div className="text-center py-8 text-green-600">
                    ✅ Aucune erreur détectée
                  </div>
                ) : (
                  <div className="errors-list space-y-2">
                    {errors.map((error, index) => (
                      <div key={index} className="error-item bg-red-50 border border-red-200 rounded p-3">
                        <div className="flex items-start gap-2">
                          <span className="text-red-500">⚠️</span>
                          <span className="text-red-700 text-sm">{error}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="validation-info bg-yellow-50 p-3 mt-4 rounded-lg border border-yellow-200">
                  <h5 className="font-medium text-yellow-900 mb-2">ℹ️ À propos de la Validation</h5>
                  <p className="text-sm text-yellow-800">
                    Cette validation est basique et vérifie la syntaxe JavaScript de base. 
                    Pour une validation complète, testez votre code dans la prévisualisation interactive.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
