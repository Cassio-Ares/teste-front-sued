import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  UserRoundPen,
  CookingPot,
  Package,
  ShoppingCart,
  UsersRound,
  Utensils,
  Calculator
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dataDashboard } from '../../mock/dataDashboard.mock'

const Dashboard = () => {
  //   const totalIngredients = new Set(
  //     recipes.flatMap((recipe) => recipe.ingredients.map((ing) => ing.name))
  //   ).size;

  // Get the total number of recipes

  const date = new Date();
  const brDate = date.toLocaleDateString('pt-BR'); 

  return (
    <>
      <div className="flex flex-col justify-start gap-4 ">
        <h1 className="font-bold text-xl">Dados das escolas </h1>
        <p></p>
        <div className="flex justify-end">
          <div className="w-full">
              <Table>
                <TableCaption className="mt-10 text-gray-400">
                  Lista com todas as escolas cadastrados.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                  <TableHead className="w-[200px] font-bold">Municipio</TableHead>
                    <TableHead className="font-bold">Escola</TableHead>
                    <TableHead className="font-bold">Tipo</TableHead>
                    <TableHead className="font-bold">Funcionamento</TableHead>
                    <TableHead className="font-bold">Matriculados</TableHead>
                    <TableHead className="font-bold">Contagem diaria</TableHead>
                  <TableHead className="font-bold text-center">Per Capita(Bruto)</TableHead>
                  <TableHead className="font-bold text-center">Per Capita(Liquido)</TableHead>
                    <TableHead className="font-bold">Energia</TableHead>
                  <TableHead className="font-bold text-center">Custo Unitário</TableHead>
                    <TableHead className="font-bold">Estoque</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataDashboard?.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-200">
                      <TableCell className="font-medium">
                        {item.municipio}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.escola}
                      </TableCell>
                      <TableCell className="font-medium">
                        {" "}
                        {item.tipo}
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        {" "}
                        {item.funcionamento}
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        {" "}
                        {item.matriculados}
                      </TableCell>
                      <TableCell className="font-medium ">
                        {" "}
                        {item.contagem}
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        {" "}
                        {item.perCapitaBruto}
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        {" "}
                        {item.perCapitaLiquido}
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        {" "}
                        {item.energia}
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        {" "}
                        {item.custoUnitario}
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        {" "}
                        {item.estoque}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;


// {/* <div className="grid grid-cols-2 gap-4">
//           <Card className="w-[400px]">
//             <CardHeader>
//               <CardTitle className="flex justify-between gap-4">
//                 <h3 className="font-normal">Alunos Matriculados</h3>
//                 <small>
//                   <UserRoundPen size={18} />
//                 </small>
//               </CardTitle>
//               <CardDescription>
//                 <h1 className="text-2xl font-bold">400</h1>
//               </CardDescription>
//             </CardHeader>
//           </Card>

//           {/* <Card className="w-[300px]">
//             <CardHeader>
//               <CardTitle className="flex justify-between gap-4">
//                 <h3 className="font-normal">Ingredientes</h3>
//                 <small>
//                   <CookingPot size={18} />
//                 </small>
//               </CardTitle>
//               <CardDescription>
//                 <h1 className="text-2xl font-bold">{totalIngredients}</h1>
//               </CardDescription>
//             </CardHeader>
//           </Card> */}

//           <Card className="w-[400px]">
//             <CardHeader>
//               <CardTitle className="flex justify-between gap-4">
//                 <h3 className="font-normal">Contagem de Alunos</h3>
//                 <small>
//                   <Calculator size={18} />
//                 </small>
//               </CardTitle>
//               <CardDescription>
//                 <h1 className="text-2xl font-bold">{brDate} <span className="ml-40">300</span></h1>
//               </CardDescription>
//             </CardHeader>
//           </Card>
//           <Card className="w-[400px]">
//             <CardHeader>
//               <CardTitle className="flex justify-between gap-4">
//                 <h3 className="font-normal">Per Capta Bruto</h3>
//                 <small>
//                   {/* <Calculator size={18} /> */}
//                 </small>
//               </CardTitle>
//               <CardDescription>
//                 <h1 className="text-2xl font-bold"> R$ 162,00 </h1>
//               </CardDescription>
//             </CardHeader>
//           </Card>
//           <Card className="w-[400px]">
//             <CardHeader>
//               <CardTitle className="flex justify-between gap-4">
//                 <h3 className="font-normal">Per Capta Liquido</h3>
//                 <small>
//                   {/* <Calculator size={18} /> */}
//                 </small>
//               </CardTitle>
//               <CardDescription>
//                 <h1 className="text-2xl font-bold"> R$ 219,00 </h1>
//               </CardDescription>
//             </CardHeader>
//           </Card>
//           <Card className="w-[400px]">
//             <CardHeader>
//               <CardTitle className="flex justify-between gap-4">
//                 <h3 className="font-normal">Energia</h3>
//                 <small>
//                   {/* <Calculator size={18} /> */}
//                 </small>
//               </CardTitle>
//               <CardDescription>
//                 <h1 className="text-2xl font-bold"> R$ 296, 00 </h1>
//               </CardDescription>
//             </CardHeader>
//           </Card>
//           <Card className="w-[400px]">
//             <CardHeader>
//               <CardTitle className="flex justify-between gap-4">
//                 <h3 className="font-normal">Custo Unitário</h3>
//                 <small>
//                   {/* <Calculator size={18} /> */}
//                 </small>
//               </CardTitle>
//               <CardDescription>
//                 <h1 className="text-2xl font-bold"> R$ 6.88 </h1>
//               </CardDescription>
//             </CardHeader>
//           </Card>
//           <Card className="w-[400px]">
//             <CardHeader>
//               <CardTitle className="flex justify-between gap-4">
//                 <h3 className="font-normal">Estoque</h3>
//                 <small>
//                   {/* <Calculator size={18} /> */}
//                 </small>
//               </CardTitle>
//               <CardDescription>
//                 <h1 className="text-2xl font-bold"> R$ 1.184,26 </h1>
//               </CardDescription>
//             </CardHeader>
//           </Card>
//         </div > */}