type inputType = {
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: "text" | "password";
  value: string;
};
export const LabelledInput = ({
  label,
  placeholder,
  onChange,
  type,
  value,
}: inputType) => {
  return (
  <div>
    <label
      htmlFor={label}
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
    >
      {label}
    </label>
    <input
      type={type}
      id={label}
      value={value}
      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      placeholder={placeholder}
      required
      onChange={onChange}
    />
  </div>
);

};
