import React, { useState, useRef, useEffect } from "react";

interface OptionType {
  label: string;
  value: string | number;
}

interface DropdownProps {
  options: OptionType[];
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = "Select...",
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option: OptionType) => {
    if (onChange) {
      onChange(option.value);
    }
    setIsOpen(false);
  };

  return (
    <div
      className={`relative w-auto ${className}`}
      ref={dropdownRef}
      tabIndex={-1}
    >
      <button
        type="button"
        className={`w-full text-left  border border-gray-300 rounded px-4 py-2 cursor-pointer flex justify-between items-center transition focus:outline-none ${
          disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""
        }`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && !disabled && (
        <ul
          className="absolute left-0 right-0 z-10 mt-1  border bg-white border-gray-300 rounded shadow-lg max-h-56 overflow-y-auto"
          role="listbox"
        >
          {options.length === 0 && (
            <li className="px-4 py-2 text-black">No options</li>
          )}
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-4 py-2 cursor-pointer text-black hover:bg-gray-200 ${
                option.value === value ? "bg-red-500  font-semibold" : ""
              }`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
