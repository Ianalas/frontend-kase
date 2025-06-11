import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface InputPriceProps {
  name?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputPrice({
  name = "preco",
  value = "",
  onChange,
}: InputPriceProps) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    setDisplayValue(formatCurrency(value));
  }, [value]);

  function formatCurrency(value: string): string {
    const numeric = value.replace(/\D/g, "");
    const number = parseFloat(numeric) / 100;

    if (isNaN(number)) return "";

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const numeric = raw.replace(/\D/g, "");
    const formatted = formatCurrency(numeric);

    setDisplayValue(formatted);

    // Cria um evento sintético compatível
    const customEvent = {
      ...e,
      target: {
        ...e.target,
        name: name,
        value: numeric,
      },
    };

    onChange(customEvent as React.ChangeEvent<HTMLInputElement>);
  }

  return (
    <Input
      id={name}
      name={name}
      inputMode="numeric"
      placeholder="Ex.: R$ 15,99"
      value={displayValue}
      onChange={handleChange}
    />
  );
}
