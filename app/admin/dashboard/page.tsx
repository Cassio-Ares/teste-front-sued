"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGet } from "@/hook/useGet";
import { usePost } from "@/hook/usePost";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface School {
  id: number;
  state_id: number;
  city_id: number;
  name: string;
  municipality: string;
  type: string;
  functioning: string;
  total_students_morning: number;
  teaching_modality_morning: string;
  total_students_afternoon: number;
  teaching_modality_afternoon: string;
  total_students_night: number;
  teaching_modality_night: string;
  total_students_integral: number;
  teaching_modality_integral: string;
  total_students: number;
  daily_count: number;
  per_capital_gross: number;
  per_capital_net: number;
  energy: number;
  unit_cost: number;
  stock: number;
  phone: string;
  email: string;
  address: string;
  total_invested: string | number;
  student_numbers: {
    morning: number;
    afternoon: number;
    night: number;
    integral: number;
  };
}

interface DashboardResponse {
  schools: School[];
}

interface SchoolInputs {
  morning: string | number;
  afternoon: string | number;
  night: string | number;
  integral: string | number;
}

const Dashboard = () => {
  const { data, loading, error, fetchData } = useGet<DashboardResponse>("dashboard");
  const [schoolInputs, setSchoolInputs] = useState<Record<number, SchoolInputs>>({});
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // API hooks
  const { postData: createMorning } = usePost("numberOfStudents/morning");
  const { postData: createAfternoon } = usePost("numberOfStudents/afternoon");
  const { postData: createNight } = usePost("numberOfStudents/night");
  const { postData: createIntegral } = usePost("numberOfStudents/integral");

  // Mock data for development
  const mockSchools = [
    {
      id: 1,
      state_id: 1,
      city_id: 1,
      name: "Domingos Ferreira",
      municipality: "Juazeiro do Norte",
      type: "EETI",
      functioning: "Integral",
      total_students_morning: 0,
      teaching_modality_morning: "Escola não tem aula neste turno ou não possui esta modalidade",
      total_students_afternoon: 0,
      teaching_modality_afternoon: "Escola não tem aula neste turno ou não possui esta modalidade",
      total_students_night: 0,
      teaching_modality_night: "Escola não tem aula neste turno ou não possui esta modalidade",
      total_students_integral: 190,
      teaching_modality_integral: "Integral",
      total_students: 190,
      daily_count: 162,
      per_capital_gross: 219,
      per_capital_net: 296,
      energy: 6.88,
      unit_cost: 6.88,
      stock: 1184.26,
      phone: "51 999999999",
      email: "escoladomingos@gmail.com",
      address: "Rua Principal, 123",
      total_invested: "1184.26",
      student_numbers: {
        morning: 0,
        afternoon: 0,
        night: 0,
        integral: 162,
      },
    },
    {
      id: 2,
      state_id: 1,
      city_id: 1,
      name: "Maria das Dores",
      municipality: "Juazeiro do Norte",
      type: "EETI",
      functioning: "Integral",
      total_students_morning: 0,
      teaching_modality_morning: "Escola não tem aula neste turno ou não possui esta modalidade",
      total_students_afternoon: 0,
      teaching_modality_afternoon: "Escola não tem aula neste turno ou não possui esta modalidade",
      total_students_night: 0,
      teaching_modality_night: "Escola não tem aula neste turno ou não possui esta modalidade",
      total_students_integral: 250,
      teaching_modality_integral: "Integral",
      total_students: 250,
      daily_count: 250,
      per_capital_gross: 405,
      per_capital_net: 376,
      energy: 5.23,
      unit_cost: 5.23,
      stock: 1380.28,
      phone: "51 999999999",
      email: "escolamaria@gmail.com",
      address: "Avenida Central, 456",
      total_invested: "1380.28",
      student_numbers: {
        morning: 0,
        afternoon: 0,
        night: 0,
        integral: 250,
      },
    },
  ];

  useEffect(() => {
    // For development, use mock data instead of fetching
    // fetchData();
  }, []);

  useEffect(() => {
    // Initialize inputs with mock data for development
    const initialInputs: Record<number, SchoolInputs> = {};
    mockSchools.forEach((school) => {
      initialInputs[school.id] = {
        morning: school.student_numbers.morning || "",
        afternoon: school.student_numbers.afternoon || "",
        night: school.student_numbers.night || "",
        integral: school.student_numbers.integral || "",
      };
    });
    setSchoolInputs(initialInputs);
  }, []);

  const handleInputChange = (schoolId: number, shift: keyof SchoolInputs, value: string) => {
    setSchoolInputs((prev) => ({
      ...prev,
      [schoolId]: {
        ...prev[schoolId],
        [shift]: value,
      },
    }));
  };

  const handleSubmit = async (
    schoolId: number,
    shift: keyof SchoolInputs,
    createFunction: (data: any) => Promise<any>
  ) => {
    try {
      const response = await createFunction({
        student_number: Number(schoolInputs[schoolId][shift]),
        school_id: schoolId,
      });
      toast(response?.message || "Cadastrado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar dados");
    }
  };

  const handleSchoolClick = (school: School) => {
    setSelectedSchool(school);
  };

  const closeSchoolDetail = () => {
    setSelectedSchool(null);
  };

  const renderShiftRow = (
    school: School,
    shift: string,
    count: number,
    modality: string,
    inputKey: keyof SchoolInputs,
    createFn: any
  ) => {
    if (modality !== "Escola não tem aula neste turno ou não possui esta modalidade") {
      return (
        <TableRow>
          <TableCell>{shift}</TableCell>
          <TableCell>{modality}</TableCell>
          <TableCell className="text-center">{count}</TableCell>
          <TableCell className="flex flex-row">
            <Input
              value={schoolInputs[school.id]?.[inputKey] || ""}
              className="w-20 mr-5"
              type="number"
              onChange={(e) => handleInputChange(school.id, inputKey, e.target.value)}
            />
            <Button onClick={() => handleSubmit(school.id, inputKey, createFn)}>Cadastrar</Button>
          </TableCell>
        </TableRow>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col justify-start gap-4">
      <ToastContainer />
      <h1 className="font-bold text-xl">Dados das escolas</h1>

      {/* Table View (like second image) */}
      {!selectedSchool && (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Município</TableHead>
                <TableHead>Escola</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Funcionamento</TableHead>
                <TableHead>Matriculados</TableHead>
                <TableHead>Contagem diária</TableHead>
                <TableHead>Per Capital (Bruto)</TableHead>
                <TableHead>Per Capital (Líquido)</TableHead>
                <TableHead>Energia</TableHead>
                <TableHead>Custo Unitário</TableHead>
                <TableHead>Estoque</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSchools.map((school) => (
                <TableRow
                  key={school.id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSchoolClick(school)}
                >
                  <TableCell>{school.municipality}</TableCell>
                  <TableCell className="font-medium text-blue-600">{school.name}</TableCell>
                  <TableCell>{school.type}</TableCell>
                  <TableCell>{school.functioning}</TableCell>
                  <TableCell>{school.total_students}</TableCell>
                  <TableCell>{school.daily_count}</TableCell>
                  <TableCell>{school.per_capital_gross}</TableCell>
                  <TableCell>{school.per_capital_net}</TableCell>
                  <TableCell>{school.energy}</TableCell>
                  <TableCell>{school.unit_cost}</TableCell>
                  <TableCell>R$ {school.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Detailed School View (like first image) */}
      {selectedSchool && (
        <div>
          <Button onClick={closeSchoolDetail} className="mb-4">
            &larr; Voltar para lista
          </Button>
          <Card className="p-4">
            <h1 className="font-bold text-xl text-center">{selectedSchool.name}</h1>
            <h3 className="font-bold text-sm text-center">Município {selectedSchool.municipality}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
              <div>
                <p>
                  <strong>Tipo:</strong> {selectedSchool.type}
                </p>
                <p>
                  <strong>Funcionamento:</strong> {selectedSchool.functioning}
                </p>
                <p>
                  <strong>Total de alunos:</strong> {selectedSchool.total_students}
                </p>
              </div>
              <div>
                <p>
                  <strong>Custo Unitário:</strong> {selectedSchool.unit_cost}
                </p>
                <p>
                  <strong>Energia:</strong> {selectedSchool.energy}
                </p>
                <p>
                  <strong>Estoque:</strong> R$ {selectedSchool.stock}
                </p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turno</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Número de aluno</TableHead>
                  <TableHead>Contagem diária do turno</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderShiftRow(
                  selectedSchool,
                  "Manhã",
                  selectedSchool.total_students_morning,
                  selectedSchool.teaching_modality_morning,
                  "morning",
                  createMorning
                )}

                {renderShiftRow(
                  selectedSchool,
                  "Tarde",
                  selectedSchool.total_students_afternoon,
                  selectedSchool.teaching_modality_afternoon,
                  "afternoon",
                  createAfternoon
                )}

                {renderShiftRow(
                  selectedSchool,
                  "Noite",
                  selectedSchool.total_students_night,
                  selectedSchool.teaching_modality_night,
                  "night",
                  createNight
                )}

                {renderShiftRow(
                  selectedSchool,
                  "Integral",
                  selectedSchool.total_students_integral,
                  selectedSchool.teaching_modality_integral,
                  "integral",
                  createIntegral
                )}

                <TableRow>
                  <TableCell colSpan={2}>
                    <strong>Per Capital (Bruto):</strong> {selectedSchool.per_capital_gross}
                  </TableCell>
                  <TableCell colSpan={2}>
                    <strong>Per Capital (Líquido):</strong> {selectedSchool.per_capital_net}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={2}>
                    <strong>Total de alunos:</strong> {selectedSchool.total_students}
                  </TableCell>
                  <TableCell colSpan={2}>
                    <strong>Total do estoque:</strong> R$ {selectedSchool.stock}
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableCaption>Email: {selectedSchool.email}</TableCaption>
              <TableCaption>Telefone: {selectedSchool.phone}</TableCaption>
              <TableCaption>Endereço: {selectedSchool.address}</TableCaption>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

// "use client";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useGet } from "@/hook/useGet";
// import { usePost } from "@/hook/usePost";
// import { useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";

// interface School {
//   id: number;
//   state_id: number;
//   city_id: number;
//   name: string;
//   total_students_morning: number;
//   teaching_modality_morning: string;
//   total_students_afternoon: number;
//   teaching_modality_afternoon: string;
//   total_students_nigth: number;
//   teaching_modality_nigth: string;
//   total_students_integral: number;
//   teaching_modality_integral: string;
//   total_students: number;
//   phone: string;
//   email: string;
//   address: string;
//   total_invested: string | number;
//   student_numbers: {
//     morning: number;
//     afternoon: number;
//     night: number;
//     integral: number;
//   };
// }

// interface DashboardResponse {
//   schools: School[];
// }

// // Interface for tracking input values for each school
// interface SchoolInputs {
//   morning: string | number;
//   afternoon: string | number;
//   night: string | number;
//   integral: string | number;
// }

// const Dashboard = () => {
//   const { data, loading, error, fetchData } = useGet<DashboardResponse>("dashboard");

//   // Create a state object to store input values for each school
//   const [schoolInputs, setSchoolInputs] = useState<Record<number, SchoolInputs>>({});

//   // API hooks
//   const { postData: createMorning } = usePost("numberOfStudents/morning");
//   const { postData: createAfternoon } = usePost("numberOfStudents/afternoon");
//   const { postData: createNigth } = usePost("numberOfStudents/nigth");
//   const { postData: createintegral } = usePost("numberOfStudents/integral");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Initialize schoolInputs with current values when data is loaded
//   useEffect(() => {
//     if (data?.schools) {
//       const initialInputs: Record<number, SchoolInputs> = {};
//       data.schools.forEach((school) => {
//         initialInputs[school.id] = {
//           morning: school.student_numbers.morning || "",
//           afternoon: school.student_numbers.afternoon || "",
//           night: school.student_numbers.night || "",
//           integral: school.student_numbers.integral || "",
//         };
//       });
//       setSchoolInputs(initialInputs);
//     }
//   }, [data]);

//   console.log("schoolInputssssssssssssssssssss", data);

//   // Generic input change handler
//   const handleInputChange = (schoolId: number, shift: keyof SchoolInputs, value: string) => {
//     setSchoolInputs((prev) => ({
//       ...prev,
//       [schoolId]: {
//         ...prev[schoolId],
//         [shift]: value,
//       },
//     }));
//   };

//   // Generic submit handler
//   const handleSubmit = async (
//     schoolId: number,
//     shift: keyof SchoolInputs,
//     createFunction: (data: any) => Promise<any>
//   ) => {
//     try {
//       const response = await createFunction({
//         student_number: Number(schoolInputs[schoolId][shift]),
//         school_id: schoolId,
//       });
//       toast(response?.message);
//     } catch (error) {
//       console.error(error);
//       toast.error("Error submitting data");
//     }
//   };

//   return (
//     <div className="flex flex-col justify-start gap-4">
//       <ToastContainer />
//       <h1 className="font-bold text-xl">Dados das escolas</h1>

//       {data?.schools?.map((school) => (
//         <div key={school.id}>
//           <Card>
//             <h1 className="font-bold text-xl text-center">{school.name}</h1>
//             <h3 className="font-bold text-sm text-center">Municipio Joazerio</h3>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Turno</TableHead>
//                   <TableHead>Modalidade</TableHead>
//                   <TableHead>Numero de aluno</TableHead>
//                   <TableHead>Contagem diaria do turno</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {school.teaching_modality_morning !==
//                   "Escola não tem aula neste turno ou não possui esta modalidade" && (
//                   <TableRow>
//                     <TableCell>Manhã</TableCell>
//                     <TableCell>{school.teaching_modality_morning}</TableCell>
//                     <TableCell className="text-center">{school.total_students_morning}</TableCell>
//                     <TableCell className="flex flex-row">
//                       <Input
//                         value={schoolInputs[school.id]?.morning || school.student_numbers.morning || ""}
//                         className="w-20 mr-5"
//                         type="number"
//                         onChange={(e) => handleInputChange(school.id, "morning", e.target.value)}
//                       />
//                       <Button onClick={() => handleSubmit(school.id, "morning", createMorning)}>Cadastrar</Button>
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 {/* Similar structure for afternoon, night, and integral shifts */}
//                 {school.teaching_modality_afternoon !==
//                   "Escola não tem aula neste turno ou não possui esta modalidade" && (
//                   <TableRow>
//                     <TableCell>Tarde</TableCell>
//                     <TableCell>{school.teaching_modality_afternoon}</TableCell>
//                     <TableCell className="text-center">{school.total_students_afternoon}</TableCell>
//                     <TableCell className="flex flex-row">
//                       <Input
//                         value={schoolInputs[school.id]?.afternoon || school.student_numbers.afternoon || ""}
//                         className="w-20 mr-5"
//                         type="number"
//                         onChange={(e) => handleInputChange(school.id, "afternoon", e.target.value)}
//                       />
//                       <Button onClick={() => handleSubmit(school.id, "afternoon", createAfternoon)}>Cadastrar</Button>
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 {school.teaching_modality_nigth !== "Escola não tem aula neste turno ou não possui esta modalidade" && (
//                   <TableRow>
//                     <TableCell>Noite</TableCell>
//                     <TableCell>{school.teaching_modality_nigth}</TableCell>
//                     <TableCell className="text-center">{school.total_students_nigth}</TableCell>
//                     <TableCell className="flex flex-row">
//                       <Input
//                         value={schoolInputs[school.id]?.night || school.student_numbers.night || ""}
//                         className="w-20 mr-5"
//                         type="number"
//                         onChange={(e) => handleInputChange(school.id, "night", e.target.value)}
//                       />
//                       <Button onClick={() => handleSubmit(school.id, "night", createNigth)}>Cadastrar</Button>
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 {school.teaching_modality_integral !==
//                   "Escola não tem aula neste turno ou não possui esta modalidade" && (
//                   <TableRow>
//                     <TableCell>Integral</TableCell>
//                     <TableCell>{school.teaching_modality_integral}</TableCell>
//                     <TableCell className="text-center">{school.total_students_integral}</TableCell>
//                     <TableCell className="flex flex-row">
//                       <Input
//                         value={schoolInputs[school.id]?.integral || school.student_numbers.integral || ""}
//                         className="w-20 mr-5"
//                         type="number"
//                         onChange={(e) => handleInputChange(school.id, "integral", e.target.value)}
//                       />
//                       <Button onClick={() => handleSubmit(school.id, "integral", createintegral)}>Cadastrar</Button>
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 <TableRow>
//                   <TableCell>Total de alunos</TableCell>
//                   <TableCell>{school.total_students}</TableCell>
//                   <TableCell>Total do estoque</TableCell>
//                   <TableCell>R$ {school.total_invested}</TableCell>
//                 </TableRow>
//               </TableBody>
//               <TableCaption>{school.email}</TableCaption>
//               <TableCaption>{school.phone}</TableCaption>
//             </Table>
//           </Card>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;

// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { dataDashboard } from "../../mock/dataDashboard.mock";

// const Dashboard = () => {
//   //   const totalIngredients = new Set(
//   //     recipes.flatMap((recipe) => recipe.ingredients.map((ing) => ing.name))
//   //   ).size;

//   // Get the total number of recipes

//   const date = new Date();
//   const brDate = date.toLocaleDateString("pt-BR");

//   return (
//     <>
//       <div className="flex flex-col justify-start gap-4 ">
//         <h1 className="font-bold text-xl">Dados das escolas </h1>
//         <p></p>
//         <div className="flex justify-end">
//           <div className="w-full">
//             <Table>
//               <TableCaption className="mt-10 text-gray-400">Lista com todas as escolas cadastrados.</TableCaption>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[200px] font-bold">Municipio</TableHead>
//                   <TableHead className="font-bold">Escola</TableHead>
//                   <TableHead className="font-bold">Tipo</TableHead>
//                   <TableHead className="font-bold">Funcionamento</TableHead>
//                   <TableHead className="font-bold">Matriculados</TableHead>
//                   <TableHead className="font-bold">Contagem diaria</TableHead>
//                   <TableHead className="font-bold text-center">Per Capita(Bruto)</TableHead>
//                   <TableHead className="font-bold text-center">Per Capita(Liquido)</TableHead>
//                   <TableHead className="font-bold">Energia</TableHead>
//                   <TableHead className="font-bold text-center">Custo Unitário</TableHead>
//                   <TableHead className="font-bold">Estoque</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {dataDashboard?.map((item) => (
//                   <TableRow key={item.id} className="hover:bg-gray-200">
//                     <TableCell className="font-medium">{item.municipio}</TableCell>
//                     <TableCell className="font-medium">{item.escola}</TableCell>
//                     <TableCell className="font-medium"> {item.tipo}</TableCell>
//                     <TableCell className="font-medium text-center"> {item.funcionamento}</TableCell>
//                     <TableCell className="font-medium text-center"> {item.matriculados}</TableCell>
//                     <TableCell className="font-medium "> {item.contagem}</TableCell>
//                     <TableCell className="font-medium text-center"> {item.perCapitaBruto}</TableCell>
//                     <TableCell className="font-medium text-center"> {item.perCapitaLiquido}</TableCell>
//                     <TableCell className="font-medium text-center"> {item.energia}</TableCell>
//                     <TableCell className="font-medium text-center"> {item.custoUnitario}</TableCell>
//                     <TableCell className="font-medium text-center"> {item.estoque}</TableCell>
//                     <TableCell className="text-right"></TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard;
