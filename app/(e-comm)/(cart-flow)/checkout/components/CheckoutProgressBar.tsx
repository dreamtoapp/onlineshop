'use client';

import { CheckCircle, Circle } from "lucide-react";

interface CheckoutStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending';
}

interface CheckoutProgressBarProps {
  currentStep: string;
  steps: CheckoutStep[];
}

export default function CheckoutProgressBar({ currentStep, steps }: CheckoutProgressBarProps) {


  const getStepIcon = (step: CheckoutStep) => {
    if (step.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-emerald-600" />;
    }
    if (step.status === 'current') {
      return <Circle className="h-5 w-5 text-blue-600 fill-current" />;
    }
    return <Circle className="h-5 w-5 text-slate-400" />;
  };



  const getProgressPercentage = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        {/* Background Track */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          {/* Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between items-center mt-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
              {/* Step Icon */}
              <div className={`p-2 rounded-full transition-all duration-300 ${step.status === 'completed'
                ? 'bg-emerald-100 border-2 border-emerald-300'
                : step.status === 'current'
                  ? 'bg-blue-100 border-2 border-blue-300'
                  : 'bg-slate-100 border-2 border-slate-200'
                }`}>
                {getStepIcon(step)}
              </div>

              {/* Step Label */}
              <span className={`text-sm font-medium text-center ${step.status === 'completed'
                ? 'text-emerald-700'
                : step.status === 'current'
                  ? 'text-blue-700'
                  : 'text-slate-500'
                }`}>
                {step.label}
              </span>

              {/* Step Number */}
              <span className={`text-xs font-bold ${step.status === 'completed'
                ? 'text-emerald-600'
                : step.status === 'current'
                  ? 'text-blue-600'
                  : 'text-slate-400'
                }`}>
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-blue-700">
            الخطوة {steps.findIndex(step => step.id === currentStep) + 1} من {steps.length}
          </span>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="text-center">
        <p className="text-sm text-slate-600">
          الوقت المتوقع لإكمال الطلب: <span className="font-medium text-slate-700">2-3 دقائق</span>
        </p>
      </div>
    </div>
  );
}
