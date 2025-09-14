import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, Circle } from 'lucide-react';

interface CompletenessMeterProps {
  segments: {
    basic: number;
    full: number;
    allStar: number;
  };
  percent: number;
  missing: {
    basic: string[];
    full: string[];
    allStar: string[];
  };
}

export function CompletenessMeter({ segments, percent, missing }: CompletenessMeterProps) {
  const { basic, full, allStar } = segments;
  
  // Calculate segment positions for visual representation
  const basicWidth = basic;
  const fullWidth = full;
  const allStarWidth = allStar;
  
  const segmentsData = [
    {
      name: 'Basic',
      width: basicWidth,
      color: basicWidth > 0 ? 'bg-blue-500' : 'bg-gray-200',
      icon: basicWidth > 0 ? CheckCircle : Circle,
      missing: missing.basic,
    },
    {
      name: 'Full',
      width: fullWidth,
      color: fullWidth > 0 ? 'bg-indigo-500' : 'bg-gray-200',
      icon: fullWidth > 0 ? CheckCircle : Circle,
      missing: missing.full,
    },
    {
      name: 'All-Star',
      width: allStarWidth,
      color: allStarWidth > 0 ? 'bg-yellow-500' : 'bg-gray-200',
      icon: allStarWidth > 0 ? CheckCircle : Circle,
      missing: missing.allStar,
    },
  ];

  return (
    <div className="w-full max-w-md">
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="flex h-full">
            {segmentsData.map((segment, index) => (
              <div
                key={segment.name}
                className={`h-full transition-all duration-300 ${segment.color}`}
                style={{ width: `${segment.width}%` }}
              />
            ))}
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 min-w-[3rem] text-right">
          {Math.round(percent)}%
        </div>
      </div>

      {/* Segment Labels */}
      <div className="flex justify-between items-center">
        {segmentsData.map((segment) => {
          const Icon = segment.icon;
          const hasMissing = segment.missing.length > 0;
          
          return (
            <TooltipProvider key={segment.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex flex-col items-center gap-1 ${hasMissing ? 'cursor-help' : ''}`}>
                    <Icon 
                      className={`w-5 h-5 ${
                        segment.width > 0 
                          ? 'text-green-600' 
                          : 'text-gray-400'
                      }`} 
                    />
                    <span className={`text-xs font-medium ${
                      segment.width > 0 
                        ? 'text-slate-900' 
                        : 'text-gray-500'
                    }`}>
                      {segment.name}
                    </span>
                  </div>
                </TooltipTrigger>
                {hasMissing && (
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">Missing for {segment.name}:</p>
                      <ul className="text-xs space-y-1">
                        {segment.missing.map((item, index) => (
                          <li key={index} className="text-slate-600">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Overall Status */}
      <div className="mt-3 text-center">
        <p className="text-sm text-slate-600">
          {100 - Math.round(percent)}% remaining to complete
        </p>
      </div>
    </div>
  );
}
