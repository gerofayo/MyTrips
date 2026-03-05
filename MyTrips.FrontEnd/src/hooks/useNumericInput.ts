import { useState, useCallback } from "react";

/**
 * Hook para manejar inputs numéricos que permiten borrar el valor a vacío
 * mientras se mantiene el comportamiento de número en el form submission.
 * 
 * @param initialValue - Valor inicial numérico
 * @returns [value, onChange, getValue, setValue]
 * - value: valor para el input (string vacío cuando es 0, para permitir borrado)
 * - onChange: handler para onChange del input (acepta ChangeEvent o número directo)
 * - getValue: función para obtener el valor numérico real
 * - setValue: función para establecer un valor numérico
 */
export function useNumericInput(initialValue: number = 0) {
  const [value, setValue] = useState<string>(
    initialValue === 0 ? "" : String(initialValue)
  );

  const onChange = useCallback((eventOrValue: React.ChangeEvent<HTMLInputElement> | number) => {
    let newValue: string;
    
    if (typeof eventOrValue === 'number') {
      newValue = eventOrValue === 0 ? "" : String(eventOrValue);
    } else {
      newValue = eventOrValue.target.value;
      // Allow empty string for visual clearing, but also handle "0" 
      if (newValue !== "" && newValue !== "-" && isNaN(Number(newValue))) {
        return; // Don't update if invalid
      }
    }
    setValue(newValue);
  }, []);

  const getValue = useCallback(() => {
    if (value === "" || value === "-") return 0;
    return Number(value);
  }, [value]);

  const setNumericValue = useCallback((num: number) => {
    setValue(num === 0 ? "" : String(num));
  }, []);

  return [value, onChange, getValue, setNumericValue] as const;
}

