
import React from 'react';

interface SelectInputProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, options, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-text-muted mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;