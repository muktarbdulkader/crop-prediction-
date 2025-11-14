
import React from 'react';

interface InputSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  unit: string;
}

const InputSlider: React.FC<InputSliderProps> = ({ label, min, max, step = 1, value, onChange, unit }) => {
  return (
    <div>
      <label className="flex justify-between items-center text-sm font-medium text-text-muted mb-2">
        <span>{label}</span>
        <span className="font-bold text-brand-green-dark bg-brand-green/10 px-2.5 py-1 rounded-full text-xs">{value} {unit}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default InputSlider;