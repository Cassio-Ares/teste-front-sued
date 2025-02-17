import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Trash } from "lucide-react";
import { ToastContainer } from "react-toastify";

const inventoryData = [
  {
    id: 1,
    name: "Estados",
    description: "Estados",
    quantity: 0,
  },
];

const StatePage = () => {
  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Estados</h1>
      <div className="flex justify-end">
        <ToastContainer />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="bg-orange-500 hover:bg-orange-600 text-white hover:text-white font-bold">
              + Novo Estado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar novo Estado</DialogTitle>
              <DialogDescription>Adicione um novo item ao seu estoque</DialogDescription>
            </DialogHeader>
            {/* <form onSubmit={}>
            <div className="flex justify-start items-center w-[300px] gap-4">
              <Label>Nome da Instituição</Label>
              <InputSelect
                options={searchSchool}
                value={selectedSchool?.id}
                onChange={handleSchoolSelect}
                onSearchChange={(query) => setQuerySchool(query)}
                placeholder="Selecione uma Instituição"
                forceReset={resetSchoolInput}
                field="name"
              />
            </div>
            <div className="flex w-full gap-4 mt-4 text-start">
              <div className="flex w-full flex-col gap-2">
                <Label>Nome do ingrediente</Label>
                <InputSelect
                  options={ingredientData}
                  value={selectedIngredient?.id}
                  onChange={handleIngredientSelect}
                  onSearchChange={(query) => setQueryIngredient(query)}
                  placeholder="Selecione um ingrediente"
                  forceReset={resetIngredientInput}
                  field="description"
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Label>Nome da marca</Label>
                <Input
                  value={stock.brand || ""}
                  onChange={(event) => setStock({ ...stock, brand: event.target.value })}
                  placeholder="Marca"
                />
              </div>
            </div>
            <div className="flex w-full gap-4 mt-4 text-start">
              <div className="flex w-full flex-col gap-2">
                <Label>Contém na embalagem</Label>
                <Input
                  type="number"
                  value={stock.quantity_min || ""}
                  onChange={(event) =>
                    setStock({
                      ...stock,
                      quantity_min: parseFloat(event.target.value),
                    })
                  }
                  placeholder="Quantidade"
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Label>Unidade de medida da unidade minima</Label>
                <Select
                  value={stock.unit_of_measure}
                  onValueChange={(value) => setStock({ ...stock, unit_of_measure: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar medida" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Quilogramas (Kg)</SelectItem>
                    <SelectItem value="g">Gramas (g)</SelectItem>
                    <SelectItem value="L">Litros (L)</SelectItem>
                    <SelectItem value="ml">Mililitros (ml)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex w-full gap-4 mt-4 text-start">
              <div className="flex w-full flex-col gap-2">
                <Label>Preço por unidade</Label>
                <Input value={formatMoney(unitPrice)} onChange={handleChange} placeholder="Preço da unidade mínima" />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Label>Quantidade total comprada</Label>
                <Input
                  type="number"
                  value={stock.total_quantity || ""}
                  onChange={(event) =>
                    setStock({
                      ...stock,
                      total_quantity: parseFloat(event.target.value),
                    })
                  }
                  placeholder="Quantidade total"
                />
              </div>
            </div>
            <div className="flex w-full gap-4 mt-4 text-start">
              <div className="flex w-full flex-col gap-2">
                <Label>Data de validade</Label>
                <Input
                  type="date"
                  value={
                    stock.expiration_date instanceof Date
                      ? stock.expiration_date.toISOString().split("T")[0]
                      : stock.expiration_date
                  }
                  onChange={(event) =>
                    setStock({
                      ...stock,
                      expiration_date: event.target.value,
                    })
                  }
                  placeholder="Data de validade"
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-orange-500 hover:bg-orange-600 font-bold">Adicionar</Button>
            </DialogFooter>
          </form> */}
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-evenly items-center">
        <div className="flex justify-start items-center w-[300px] gap-4">
          {/* <Label>Nome da Instituição</Label>
        <InputSelect
          options={searchSchool}
          value={selectedSchool?.id}
          onChange={handleSchoolSelect}
          onSearchChange={(query) => setQuerySchool(query)}
          placeholder="Selecione uma Instituição"
          forceReset={resetSchoolInput}
          field="name"
        /> */}
        </div>
        <div className="flex justify-start items-center w-[300px] gap-4">
          <Search size={16} />
          <Input placeholder="Pesquisar..." />
        </div>
      </div>
      <div className="flex">
        <Card className="w-full p-4">
          <Table>
            <TableCaption className="mt-10 text-gray-400">Lista com todos os itens cadastrados.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-bold">Ingredientes</TableHead>
                <TableHead className="font-bold">Marca</TableHead>
                <TableHead className="font-bold">Pacote ou unidade minima</TableHead>
                <TableHead className="font-bold">Unid. med.</TableHead>
                <TableHead className="font-bold">Preço por unidade</TableHead>
                <TableHead className="font-bold">Quantidade total comprada</TableHead>
                <TableHead className="font-bold">Total de investimento</TableHead>
                <TableHead className="font-bold text-center">Data de validade</TableHead>
                <TableHead className="font-bold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData?.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>{stock.description}</TableCell>
                  <TableCell>{stock.name}</TableCell>

                  <TableCell className="font-medium text-center">
                    <Dialog>
                      <DialogTrigger>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Deseja remover o item do estoque?</DialogTitle>
                          <DialogDescription>Essa ação não poderá ser desfeita.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          {/* <Button variant="destructive" onClick={() => removeItem(stock.id || 0)}>
                          Remover
                        </Button> */}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default StatePage;

/**
 * const StatePage = () => {
  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Estados</h1>
      <div className="flex justify-end"></div>
    </div>
  );
};

export default StatePage;

 */
