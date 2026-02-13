interface Step {
  title: string;
  status: "complete" | "current" | "pending";
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={index} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    isComplete || isActive
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {stepNumber}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    isComplete || isActive ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-16 h-0.5 bg-gray-300 ml-8"></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-sm text-gray-500">
        <i className="fas fa-clock mr-1"></i>
        Last saved: 2 minutes ago
      </div>
    </div>
  );
}
