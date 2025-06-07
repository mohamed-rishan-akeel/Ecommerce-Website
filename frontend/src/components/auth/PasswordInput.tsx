import { useState } from 'react';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

const PasswordInput = ({
  id,
  value,
  onChange,
  required = false,
  className = '',
  placeholder,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        required={required}
        className={`${className} pr-10`} // Add padding for the icon
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
      >
        {showPassword ? (
          <span role="img" aria-label="Hide password">
            👁️‍🗨️
          </span>
        ) : (
          <span role="img" aria-label="Show password">
            👁️
          </span>
        )}
      </button>
    </div>
  );
};

export default PasswordInput; 