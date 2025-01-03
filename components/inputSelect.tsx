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
  className = "",
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(value ?? "");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (value && options) {
      const foundItem = options.find((option) => option.id === value);
      if (foundItem) {
        setInputValue(foundItem[field]);
        setSelectedItem(foundItem);
      }
    }
  }, [value, options, field]);

  useEffect(() => {
    if (forceReset) {
      setInputValue("");
      setSelectedItem(null);
      setShowOptions(false);
      if (onSearchChange) onSearchChange("");
    }
  }, [forceReset, onSearchChange]);

  const handleOptionSelect = (option) => {
    setInputValue(option[field]);
    onChange(option.id);
    setSelectedItem(option);
    setShowOptions(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Se o input estiver vazio, notifica o componente pai
    if (newValue === "") {
      onChange(null); // Envia null para indicar que nenhum item está selecionado
      setSelectedItem(null);
    }

    setShowOptions(true);

    if (onSearchChange) {
      onSearchChange(newValue);
    }
  };

  const handleKeyDown = (e) => {
    // Se pressionar backspace quando há um item selecionado, limpa a seleção
    if (e.key === "Backspace" && selectedItem) {
      setInputValue("");
      setSelectedItem(null);
      onChange(null);
      if (onSearchChange) onSearchChange("");
    }
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowOptions(true)}
        placeholder={placeholder}
        className={`w-full p-2 border rounded ${
          disabled ? "cursor-not-allowed opacity-80" : ""
        }`}
        disabled={disabled}
      />

      {showOptions && inputValue && !selectedItem && !disabled && (
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

export default InputSelect;

// // interface OptionType {
// //   id: string | number;
// //   [key: string]: any;
// // }

// // interface InputSelectProps {
// //   options: OptionType[];
// //   value: string | number | null;
// //   onChange: (value: string | number) => void;
// //   onSearchChange?: (search: string) => void;
// //   placeholder?: string;
// //   field: string;
// //   forceReset?: boolean;
// // }

// export const InputSelect = ({
//   options,
//   value,
//   onChange,
//   onSearchChange,
//   placeholder,
//   field,
//   forceReset = false,
//   className = "",
//   disabled = false,
// }) => {
//   const [inputValue, setInputValue] = useState(value ?? "");
//   const [showOptions, setShowOptions] = useState<boolean>(false);
//   const [selectedItem, setSelectedItem] = useState<any>(null);

//   // Efeito para encontrar item quando value ou options mudam
//   useEffect(() => {
//     if (value && options) {
//       const foundItem = options.find((option) => option.id === value);
//       if (foundItem) {
//         setInputValue(foundItem[field]);
//         setSelectedItem(foundItem);
//       }
//     }
//   }, [value, options, field]);

//   // Novo efeito para handle de reset
//   // useEffect(() => {
//   //   if (forceReset) {
//   //     setInputValue("");
//   //     setSelectedItem(null);
//   //     setShowOptions(false);

//   //     // Limpa a busca no componente pai
//   //     if (onSearchChange) {
//   //       onSearchChange("");
//   //     }
//   //   }
//   // }, [forceReset, onSearchChange]);

//   useEffect(() => {
//     if (forceReset) {
//       setInputValue(""); // Limpa o valor do input
//       setSelectedItem(null); // Limpa o item selecionado
//       setShowOptions(false); // Esconde as opções
//       if (onSearchChange) onSearchChange(""); // Limpa a busca
//     }
//   }, [forceReset, onSearchChange]);

//   // Seleciona uma opção da lista
//   const handleOptionSelect = (option: any) => {
//     setInputValue(option[field]);

//     onChange(option.id);

//     setSelectedItem(option);
//     setShowOptions(false);
//   };

//   // Manipula mudanças no input
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = e.target.value;

//     setInputValue(newValue);

//     // Se o input estiver vazio, notifica o componente pai
//     if (newValue === "") {
//       onChange(null); // Envia null para indicar que nenhum item está selecionado
//       setSelectedItem(null);
//     }
//     setShowOptions(true);

//     // Reseta item selecionado se o input mudar
//     setSelectedItem(null);

//     // Chama onSearchChange se definido
//     if (onSearchChange) {
//       onSearchChange(newValue);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     // Se pressionar backspace quando há um item selecionado, limpa a seleção
//     if (e.key === "Backspace" && selectedItem) {
//       setInputValue("");
//       setSelectedItem(null);
//       onChange(null);
//       if (onSearchChange) onSearchChange("");
//     }
//   };

//   return (
//     <div className="relative w-full">
//       <Input
//         type="text"
//         value={inputValue}
//         onChange={handleInputChange}
//         onKeyDown={handleKeyDown}
//         onFocus={() => setShowOptions(true)}
//         placeholder={placeholder}
//         className={`w-full p-2 border rounded ${
//           disabled ? "cursor-not-allowed opacity-80" : ""
//         }`}
//         disabled={disabled}
//       />

//       {showOptions && inputValue && !selectedItem && !disabled && (
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
