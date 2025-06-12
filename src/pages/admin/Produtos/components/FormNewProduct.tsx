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
import { useProduct, Product } from "@/contexts/ProductContext";

interface FormProps {
  onClose: () => void;
}

export function FormNewProduct({ onClose }: FormProps) {

  const { criarProduto, loadingProducts, errorProducts } = useProduct();

  const [form, setForm] = useState<Omit<Product, 'id'> & { categoria: string; imagePreview: string | null }>({
    nome: "",
    foto: "",
    codigo: "",
    dataCompra: "",
    valorPago: "", 
    categoria: "", 
    imagePreview: null, 
  });


  const [_imageFile, setImageFile] = useState<File | null>(null);

  const filledFieldsCount = useMemo(() => {

    const relevantFields = {
      nome: form.nome,
      foto: form.foto,
      codigo: form.codigo,
      dataCompra: form.dataCompra,
      valorPago: form.valorPago,
      categoria: form.categoria,
    };
    return Object.values(relevantFields).filter((value) => value !== "" && value !== null).length;
  }, [form]);

  const totalFields = Object.keys({
    nome: "", foto: "", codigo: "", dataCompra: "", valorPago: "", categoria: ""
  }).length;
  const progress = Math.round((filledFieldsCount / totalFields) * 100);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, files, value } = event.target;

    if (name === "imagem" && files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);

      setImageFile(file); 
      setForm((prev) => ({
        ...prev,
        foto: imageUrl, 
        imagePreview: imageUrl,
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const productToCreate: Omit<Product, 'id'> = {
      nome: form.nome,
      foto: form.foto, 
      codigo: form.codigo,
      dataCompra: form.dataCompra,
      valorPago: form.valorPago,
    };

    try {
      await criarProduto(productToCreate);
      onClose(); 
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      
      alert(`Erro ao criar produto: ${errorProducts?.message || 'Verifique o console para mais detalhes.'}`);
    }
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-x-8 gap-y-2 mb-4">
            <Label>Nome do produto</Label>
            <Input placeholder="Digite o nome do produto" name="nome" value={form.nome} onChange={handleChange} required />
          </div>

          <div className="grid gap-x-8 gap-y-2 mb-4">
            <Label htmlFor="imagem">Imagem do produto</Label>
            <label
              htmlFor="imagem"
              className={cn(
                "flex flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/40",
                "rounded-xl py-8 text-muted-foreground cursor-pointer hover:bg-muted/40 transition-colors text-sm"
              )}
            >
              {form.imagePreview ? (
                <img src={form.imagePreview} alt="Preview" className="max-h-32 object-contain" />
              ) : (
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
              )}
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

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6 mb-4">
            <Label>Código do produto</Label>
            <Label>Data de compra</Label>

            <Input type="text" placeholder="Digite o código do produto" name="codigo" value={form.codigo} onChange={handleChange} required />
            <Input type="date" placeholder="Selecione a data de compra" name="dataCompra" value={form.dataCompra} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6 mb-8">
            <Label>Preço de venda do produto</Label>
            <Label>Categoria do produto</Label>

            <InputPrice name="valorPago" value={form.valorPago} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)} />
            <Select value={form.categoria} onValueChange={(value) => handleSelectChange("categoria", value)} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a categoria" />
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
            <Button variant="ghost" onClick={onClose} type="button"> 
              Cancelar
            </Button>
            <Button type="submit" disabled={loadingProducts}>
              {loadingProducts ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}