import { useEffect, useState } from "react";
import { Input } from "./ui/input";

export const InputSelect = ({
  options,
  value,
  onChange,
  onSearchChange,
  placeholder,
  field,
  forceReset = false,
}: InputSelectProps) => {
  const [inputValue, setInputValue] = useState(value ?? "");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Efeito para encontrar item quando value ou options mudam
  useEffect(() => {
    if (value && options) {
      const foundItem = options.find((option) => option.id === value);
      if (foundItem) {
        setInputValue(foundItem[field]);
        setSelectedItem(foundItem);
      }
    }
  }, [value, options, field]);

  // Novo efeito para handle de reset
  useEffect(() => {
    if (forceReset) {
      setInputValue("");
      setSelectedItem(null);
      setShowOptions(false);

      // Limpa a busca no componente pai
      if (onSearchChange) {
        onSearchChange("");
      }
    }
  }, [forceReset, onSearchChange]);

  // Seleciona uma opção da lista
  const handleOptionSelect = (option: any) => {
    setInputValue(option[field]);

    onChange(option.id);

    setSelectedItem(option);
    setShowOptions(false);
  };

  // Manipula mudanças no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setInputValue(newValue);
    setShowOptions(true);

    // Reseta item selecionado se o input mudar
    setSelectedItem(null);

    // Chama onSearchChange se definido
    if (onSearchChange) {
      onSearchChange(newValue);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowOptions(true)}
        placeholder={placeholder}
        className="w-full p-2 border rounded"
      />

      {showOptions && inputValue && !selectedItem && (
        <ul className="absolute z-10 w-full border rounded mt-1 max-h-40 overflow-y-auto bg-white shadow-lg">
          {options?.map((option) => (
            <li
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {option[field]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// export const InputSelect = ({
//   options,
//   value,
//   onChange,
//   onSearchChange,
//   placeholder,
//   field,
// }: InputSelectProps) => {
//   const [inputValue, setInputValue] = useState(value ?? "");
//   const [showOptions, setShowOptions] = useState<boolean>(false);
//   const [selectedItem, setSelectedItem] = useState<any>(null);

//   useEffect(() => {
//     if (value && options) {
//       const foundItem = options.find((option) => option.id === value);
//       if (foundItem) {
//         setInputValue(foundItem[field]);
//         setSelectedItem(foundItem);
//       }
//     }
//   }, [value, options, field]);

//   const handleOptionSelect = (option: any) => {
//     setInputValue(option[field]);

//     onChange(option.id);

//     setSelectedItem(option);

//     setShowOptions(false);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = e.target.value;
//     setInputValue(newValue);
//     setShowOptions(true);

//     setSelectedItem(null);

//     if (onSearchChange) {
//       onSearchChange(newValue);
//     }
//   };

//   return (
//     <div className="relative w-full">
//       <Input
//         type="text"
//         value={inputValue}
//         onChange={handleInputChange}
//         onFocus={() => setShowOptions(true)}
//         placeholder={placeholder}
//         className="w-full p-2 border rounded"
//       />

//       {showOptions && inputValue && !selectedItem && (
//         <ul className="absolute z-10 w-full border rounded mt-1 max-h-40 overflow-y-auto bg-white shadow-lg">
//           {options?.map((option) => (
//             <li
//               key={option.id}
//               onClick={() => handleOptionSelect(option)}
//               className="p-2 hover:bg-gray-100 cursor-pointer"
//             >
//               {option[field]}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };
