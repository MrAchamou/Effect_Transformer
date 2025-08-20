import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProgressBarProps {
  transformation: {
    status: string;
    level?: number;
  };
}

export default function ProgressBar({ transformation }: ProgressBarProps) {
  // Simulate progress based on time (in real app, this would come from server)
  const getProgress = () => {
    // Simple simulation - in reality this would be tracked server-side
    return 65;
  };

  const getCurrentStep = () => {
    const progress = getProgress();
    if (progress < 30) return "Validation du code original...";
    if (progress < 70) return "Transformation par l'IA en cours...";
    return "Optimisation et finalisation...";
  };

  const getStepStatus = (stepIndex: number) => {
    const progress = getProgress();
    if (stepIndex === 0) return progress > 30 ? 'completed' : 'current';
    if (stepIndex === 1) return progress > 70 ? 'completed' : progress > 30 ? 'current' : 'pending';
    if (stepIndex === 2) return progress > 70 ? 'current' : 'pending';
    return 'pending';
  };

  const steps = [
    { name: 'Validation', icon: '✓' },
    { name: 'Transformation IA', icon: '🤖' },
    { name: 'Optimisation', icon: '⚡' }
  ];

  return (
    <Card className="mb-8" data-testid="progress-card">
      <CardContent className="p-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-500 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Transformation en cours...
          </h3>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${getProgress()}%` }}
              data-testid="progress-fill"
            />
          </div>
          
          {/* Current Step */}
          <div className="text-sm text-gray-600 mb-6">
            <p data-testid="current-step">{getCurrentStep()}</p>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-center space-x-8">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={index} className="flex items-center space-x-2" data-testid={`step-${index}`}>
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'completed' ? 'bg-green-500' :
                    status === 'current' ? 'bg-blue-500 animate-pulse' :
                    'bg-gray-300'
                  }`} />
                  <span className={`text-xs ${
                    status === 'completed' ? 'text-green-600' :
                    status === 'current' ? 'text-blue-600' :
                    'text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Level Info */}
          {transformation.level && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800" data-testid="transformation-info">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 mr-2">
                  Niveau {transformation.level}
                </Badge>
                Transformation avec {transformation.level === 1 ? '7' : transformation.level === 2 ? '13' : '23'} modules IA
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
