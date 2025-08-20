import { Badge } from "@/components/ui/badge";

interface Level {
  name: string;
  description: string;
  modules: string[];
}

interface LevelSelectorProps {
  levels?: Record<string, Level>;
  selectedLevel: number;
  onLevelSelect: (level: number) => void;
}

export default function LevelSelector({ levels, selectedLevel, onLevelSelect }: LevelSelectorProps) {
  if (!levels) {
    return (
      <div className="text-center py-8" data-testid="loading-levels">
        <div className="text-gray-500">Chargement des niveaux...</div>
      </div>
    );
  }

  const levelConfigs = [
    { key: 'level1', number: 1, badge: 'Gratuit', badgeClass: 'bg-green-100 text-green-800' },
    { key: 'level2', number: 2, badge: 'Recommandé', badgeClass: 'bg-blue-100 text-blue-800' },
    { key: 'level3', number: 3, badge: 'Premium', badgeClass: 'bg-yellow-100 text-yellow-800' }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {levelConfigs.map(({ key, number, badge, badgeClass }) => {
        const level = levels[key];
        if (!level) return null;

        const isSelected = selectedLevel === number;
        const isRecommended = number === 2;

        return (
          <div
            key={number}
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
            }`}
            onClick={() => onLevelSelect(number)}
            data-testid={`level-option-${number}`}
          >
            {isRecommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className={badgeClass} data-testid="badge-recommended">
                  {badge}
                </Badge>
              </div>
            )}
            
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                number === 1 ? 'bg-gray-100' : 
                number === 2 ? 'bg-blue-500' : 
                'bg-gradient-to-br from-yellow-400 to-orange-500'
              }`}>
                <span className={`text-xl font-bold ${
                  number === 1 ? 'text-gray-600' : 'text-white'
                }`} data-testid={`level-number-${number}`}>
                  {number}
                </span>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2" data-testid={`level-name-${number}`}>
                {level.name}
              </h4>
              <p className="text-sm text-gray-600 mb-4" data-testid={`level-description-${number}`}>
                {level.description}
              </p>
              
              <div className="space-y-2 text-left">
                {level.modules.slice(0, 3).map((module, index) => (
                  <div key={index} className="flex items-center text-sm" data-testid={`module-${number}-${index}`}>
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{module.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
                
                {level.modules.length > 3 && (
                  <div className="text-center mt-4">
                    <span className="text-xs text-gray-500" data-testid={`additional-modules-${number}`}>
                      + {level.modules.length - 3} autres modules
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Badge variant="outline" className={badgeClass} data-testid={`level-badge-${number}`}>
                  {badge}
                </Badge>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
