import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ImagePlus, X } from "lucide-react";
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputPrice } from "./InputPrice";
import { cn } from "@/lib/utils";

interface FormProps {
  onClose: () => void;
}

export function FormNewProduct({ onClose }: FormProps) {
  const [form, setForm] = useState({
    nome: "",
    image: "",
    dataCompra: "",
    codigo: "",
    preco: "",
    categoria: ""
  });

  const filledFieldsCount = useMemo(() => {
    return Object.values(form).filter((value) => value.trim() !== "").length;
  }, [form]);

  const totalFields = Object.keys(form).length;

  const progress = Math.round((filledFieldsCount / totalFields) * 100);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, files, value } = event.target;

    if (name === "imagem" && files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);

      setForm((prev) => ({
        ...prev,
        image: imageUrl, // url para preview
        // Se precisar guardar o file em si para upload, crie outro campo no estado
        // file: file,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }



  function handleSelectChange(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <Card className="w-[60%] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background shadow-2xl p-12">
      <Button variant="ghost" size="icon"
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Fechar formulário">
        <X className="w-6 h-6" />
      </Button>
      <CardHeader>
        <Progress value={progress} className="w-[50%] mx-auto mb-8" />
        <CardTitle className="text-3xl text-center">Adicionar novo produto</CardTitle>
        <CardDescription className="text-center">Registre um novo produto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-x-8 gap-y-2">
          <Label>Nome do produto</Label>
          <Input placeholder="Digite o nome do produto" name="nome" value={form.nome} onChange={handleChange} />
        </div>

        <div className="grid gap-x-8 gap-y-2">
          <Label htmlFor="imagem">Imagem do produto</Label>

          <label
            htmlFor="imagem"
            className={cn(
              "flex flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/40",
              "rounded-xl py-8 text-muted-foreground cursor-pointer hover:bg-muted/40 transition-colors text-sm"
            )}
          >
            <ImagePlus className="w-8 h-8 text-muted-foreground" />
            
            <Input
              id="imagem"
              type="file"
              accept="image/*"
              name="imagem"
              onChange={handleChange} 
              className="border-none mx-auto text-center w-fit block p-0"
            />
          </label>
        </div>


        <h1 className="text-2xl">Detalhes</h1>
        <Separator />

        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6">
          <Label>Código do produto</Label>
          <Label>Data de compra</Label>
          
          <Input type="text" placeholder="Digite o código do produto" name="codigo" value={form.codigo} onChange={handleChange} />
          <Input type="date" placeholder="Selecione a data de compra" name="dataCompra" value={form.dataCompra} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6">
          <Label>Preço de venda do produto</Label>
          <Label>Categoria do produto</Label>
          
          <InputPrice name="preco" value={form.preco} onChange={handleChange} />
          <Select value={form.categoria} onValueChange={(value) => handleSelectChange("categoria", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a escolaridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Suplementos">Suplementos</SelectItem>
              <SelectItem value="Bebidas">Bebidas</SelectItem>
              <SelectItem value="Equipamentos">Equipamentos</SelectItem>
              <SelectItem value="Vestuários">Vestuários</SelectItem>
            </SelectContent>
          </Select>
        </div>

        
        <div className="flex justify-end gap-2 mt-8">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
