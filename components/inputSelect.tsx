import { useEffect, useState } from "react";
import { Input } from "./ui/input";

interface InputSelectProps {
    options: any[],
    value: any
    onChange: (value: any) => void;
    onSearchChange?: (searchTerm: string) => void; // Novo prop opcional
    placeholder: string;
    field: string;
}

export const InputSelect =({
    options,
    value ,
    onChange,
    onSearchChange, 
    placeholder,
    field,
}: InputSelectProps) => {
    const [inputValue, setInputValue] = useState(value);
    const [showOptions, setShowOptions] = useState<boolean>(false);
                                      
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleOptionSelect = (option: any) => {
        setInputValue(option[field]);
        onChange(option.id);
        setShowOptions(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setShowOptions(true);

        // Chamar onSearchChange se estiver definido
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

            {showOptions && inputValue && (
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



// interface Option {
//     id: string | number,
//     name: string
// }
// interface InputSelectProps {
//     options: Option[] ,
//     value: string | number | [string | number] | undefined;
//     onChange: (value: string | number) => void,
//     placeholder: string;
//     field: string;
// }

// export const InputSelect= ({
//     options,
//     value,
//     onChange,
//     placeholder,
//     field
// }: InputSelectProps) => {
//     const [inputValue, setInputValue] = useState<string | number | [string | number] | undefined>(value);
//     const [showOptions, setShowOptions] = useState<boolean>(false);

//     // const filteredOptions = options.filter((option) =>
//     //    option.name.toLowerCase().includes((inputValue || '').toLowerCase()) 
//     // );
    
//     // const filteredOptions = options.filter((option) =>
//     //     typeof option.name === 'string' && option.name.toLowerCase().includes((inputValue || '').toLowerCase())
//     // );
    
//     // const filteredOptions = options.filter((option) => {
//     //     // Make sure inputValue is a string before calling toLowerCase
//     //     if (typeof inputValue === 'string') {
//     //         return option.name.toLowerCase().includes(inputValue.toLowerCase());
//     //     }
//     //     return false; // If inputValue is not a string, do not include this option
//     // });
    
    

//     const handleOptionSelect = (option: Option) => {
//         setInputValue(option.name);
//         onChange(option.id); 
//         setShowOptions(false);
//     };

//     return (
//         <div className="relative w-full">
//             <Input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => {
//                     setInputValue(e.target.value);
//                     setShowOptions(true);
//                 }}
//                 onFocus={() => setShowOptions(true)}
//                 placeholder={placeholder}
//                 className="w-full p-2 border rounded"
//             />

//             {showOptions && inputValue && (
//                 <ul className="absolute z-10 w-full border rounded mt-1 max-h-40 overflow-y-auto bg-white shadow-lg">
//                     {options?.map((option) => (
//                         <li
//                             key={option.id}
//                             onClick={() => handleOptionSelect(option)}
//                             className="p-2 hover:bg-gray-100 cursor-pointer"
//                         >
//                             {option[field]} 
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };