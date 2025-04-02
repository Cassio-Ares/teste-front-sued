"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGet } from "@/hook/useGet";
import { usePost } from "@/hook/usePost";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const Dashboard = () => {
  const { data, loading, error, fetchData } = useGet<any>("dashboard");
  const [schoolInputs, setSchoolInputs] = useState<any>({});
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [groupedSchools, setGroupedSchools] = useState<any>({});

  // API hooks
  const { postData: createMorning } = usePost<any>("numberOfStudents/morning");
  const { postData: createAfternoon } = usePost<any>("numberOfStudents/afternoon");
  const { postData: createNight } = usePost<any>("numberOfStudents/night");
  const { postData: createIntegral } = usePost<any>("numberOfStudents/integral");

  useEffect(() => {
    fetchData();
  }, []);

  // Group schools by state and municipality and initialize inputs
  useEffect(() => {
    if (data?.schools) {
      // Group schools by state and municipality
      const grouped = {};
      const initialInputs = {};

      data.schools.forEach((school) => {
        // For grouping, we'd need state and municipality data which isn't in your sample
        // Let's assume we get it from the API or we can add mock data
        const stateId = school.state_id;
        const cityId = school.city_id;
        const stateName = getStateName(stateId) || "Estado " + stateId;
        const cityName = getCityName(cityId) || "Município " + cityId;

        if (!grouped[stateName]) {
          grouped[stateName] = {};
        }
        if (!grouped[stateName][cityName]) {
          grouped[stateName][cityName] = [];
        }

        grouped[stateName][cityName].push(enrichSchoolData(school));

        // Initialize inputs
        initialInputs[school.id] = {
          morning: school.student_numbers?.morning || "",
          afternoon: school.student_numbers?.afternoon || "",
          night: school.student_numbers?.night || "",
          integral: school.student_numbers?.integral || "",
        };
      });

      setGroupedSchools(grouped);
      setSchoolInputs(initialInputs);
    }
  }, [data]);

  // Helper function to enrich school data with calculated fields
  const enrichSchoolData = (school) => {
    // Extract values from average_result_details or set defaults
    let perCapitalGross = "0";
    let perCapitalNet = "0";
    let energy = "0";
    let unitCost = "0";
    let stock = school.total_invested || "0";
    let dailyCount = 0;

    // Calculate daily count from student_numbers
    if (school.student_numbers) {
      dailyCount =
        (parseInt(school.student_numbers.morning) || 0) +
        (parseInt(school.student_numbers.afternoon) || 0) +
        (parseInt(school.student_numbers.night) || 0) +
        (parseInt(school.student_numbers.integral) || 0);
    }

    // Process average_result_details if available
    if (
      school.average_result_details &&
      school.average_result_details.total &&
      school.average_result_details.total[0]
    ) {
      const totalDetails = school.average_result_details.total[0];

      // Get gross weight with unit
      if (totalDetails.average_gross_weight && totalDetails.unit_measure_gross) {
        perCapitalGross = `${totalDetails.average_gross_weight} ${totalDetails.unit_measure_gross}`;
      }

      // Get net weight with unit
      if (totalDetails.average_cooked_weight && totalDetails.unit_measure_weight) {
        perCapitalNet = `${totalDetails.average_cooked_weight} ${totalDetails.unit_measure_weight}`;
      }

      // Get energy value
      if (totalDetails.average_kcal) {
        energy = totalDetails.average_kcal;
      }

      // Get cost per serving
      if (totalDetails.average_cost_per_serving) {
        unitCost = totalDetails.average_cost_per_serving;
      }
    }

    // Return enriched school object
    return {
      ...school,
      perCapitalGross,
      perCapitalNet,
      energy,
      unitCost,
      stock,
      dailyCount,
    };
  };

  // Mock functions to get state and city names (replace with real data)
  const getStateName = (stateId) => {
    const states = {
      1: "Rio Grande do Sul",
      // Add more state mappings as needed
    };
    return states[stateId];
  };

  const getCityName = (cityId) => {
    const cities = {
      1: "Torres",
      // Add more city mappings as needed
    };
    return cities[cityId];
  };

  const handleInputChange = (schoolId, shift, value) => {
    setSchoolInputs((prev) => ({
      ...prev,
      [schoolId]: {
        ...prev[schoolId],
        [shift]: value,
      },
    }));
  };

  const handleSubmit = async (schoolId, shift, createFunction) => {
    try {
      const response = await createFunction({
        student_number: Number(schoolInputs[schoolId][shift]),
        school_id: schoolId,
      });
      toast(response?.message || "Dados salvos com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar dados");
    }
  };

  const handleSchoolClick = (school) => {
    setSelectedSchool(school);
  };

  const closeSchoolDetail = () => {
    setSelectedSchool(null);
  };

  // Check if a shift exists and has students
  const shiftExists = (school, shiftKey) => {
    const totalStudentsKey = `total_students_${shiftKey}`;
    const modalityKey = `teaching_modality_${shiftKey}`;

    return (
      school[totalStudentsKey] > 0 &&
      school[modalityKey] !== "Escola não tem aula neste turno ou não possui esta modalidade"
    );
  };

  // Get shift details for a specific shift
  const getShiftDetails = (school, shiftKey) => {
    const totalStudentsKey = `total_students_${shiftKey}`;
    const modalityKey = `teaching_modality_${shiftKey}`;

    // Map shift keys to their respective detail keys in the API data
    const detailKeyMap = {
      morning: "morningSnack",
      afternoon: "afternoonSnack",
      night: "nightSnack",
      nigth: "nightSnack", // Handle typo in API
      integral: "integral",
    };

    const detailKey = detailKeyMap[shiftKey];
    const details = school.average_result_details?.[detailKey]?.[0] || null;

    return {
      count: school[totalStudentsKey] || 0,
      modality: school[modalityKey] || "",
      details: details,
    };
  };

  // Format shift name for display
  const formatShiftName = (shiftKey) => {
    const shiftNames = {
      morning: "Manhã",
      afternoon: "Tarde",
      night: "Noite",
      nigth: "Noite", // Handle typo in API
      integral: "Integral",
    };

    return shiftNames[shiftKey] || shiftKey;
  };

  // Determine which shifts to render for a school
  const getActiveShifts = (school) => {
    const shifts: string[] = [];

    if (shiftExists(school, "morning")) shifts.push("morning");
    if (shiftExists(school, "afternoon")) shifts.push("afternoon");
    if (shiftExists(school, "nigth")) shifts.push("nigth"); // Note the typo in API
    if (shiftExists(school, "integral")) shifts.push("integral");

    return shifts;
  };

  // Render a row for a specific shift
  const renderShiftRow = (school, shiftKey, createFn) => {
    const { count, modality, details } = getShiftDetails(school, shiftKey);
    const shiftName = formatShiftName(shiftKey);

    // Determine which API function to use based on shift key
    const apiFunction =
      {
        morning: createMorning,
        afternoon: createAfternoon,
        night: createNight,
        nigth: createNight, // Handle typo in API
        integral: createIntegral,
      }[shiftKey] || createFn;

    return (
      <TableRow key={`${school.id}-${shiftKey}`}>
        <TableCell>{shiftName}</TableCell>
        <TableCell>{modality}</TableCell>
        <TableCell className="text-center">{count}</TableCell>

        {details ? (
          <>
            <TableCell>{details.average_cost_per_serving || "-"}</TableCell>
            <TableCell>
              {details.average_cooked_weight} {details.unit_measure_weight}
            </TableCell>
            <TableCell>
              {details.average_gross_weight} {details.unit_measure_gross}
            </TableCell>
            <TableCell>{details.average_kcal || "-"}</TableCell>
          </>
        ) : (
          <TableCell colSpan={4} className="text-center text-gray-500">
            Nenhum detalhe nutricional disponível
          </TableCell>
        )}

        {/* Daily count input */}
        <TableCell className="flex flex-row items-center">
          <Input
            value={schoolInputs[school.id]?.[shiftKey === "nigth" ? "night" : shiftKey] || ""}
            className="w-20 mr-2"
            type="number"
            min="0"
            onChange={(e) => handleInputChange(school.id, shiftKey === "nigth" ? "night" : shiftKey, e.target.value)}
          />
          <Button
            size="sm"
            onClick={() => handleSubmit(school.id, shiftKey === "nigth" ? "night" : shiftKey, apiFunction)}
          >
            Salvar
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando dados das escolas...</div>;
  }

  if (error) {
    return <div className="flex justify-center p-8 text-red-500">Erro ao carregar dados: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="font-bold text-2xl">Dashboard de Escolas</h1>

      {/* School List View */}
      {!selectedSchool && (
        <>
          {Object.entries(groupedSchools).map(([stateName, municipalities]) => (
            <div key={stateName} className="mb-6">
              <h2 className="font-bold text-xl mb-2">{stateName}</h2>

              {Object.entries(municipalities || {}).map(([municipalityName, schools]) => (
                <div key={municipalityName} className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 pl-2 border-l-4 border-blue-500">{municipalityName}</h3>

                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Escola</TableHead>
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
                          {schools.map((school) => (
                            <TableRow
                              key={school.id}
                              className="cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSchoolClick(school)}
                            >
                              <TableCell className="font-medium text-blue-600">{school.name}</TableCell>
                              <TableCell>{school.total_students || 0}</TableCell>
                              <TableCell>{school.dailyCount || 0}</TableCell>
                              <TableCell>{school.perCapitalGross || "-"}</TableCell>
                              <TableCell>{school.perCapitalNet || "-"}</TableCell>
                              <TableCell>{school.energy || "-"}</TableCell>
                              <TableCell>{school.unitCost || "-"}</TableCell>
                              <TableCell>
                                {school.stock ? `R$ ${parseFloat(school.stock).toFixed(2)}` : "R$ 0,00"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Detailed School View */}
      {selectedSchool && (
        <div>
          <Button onClick={closeSchoolDetail} className="mb-4">
            &larr; Voltar para lista
          </Button>

          <Card className="p-4">
            <div className="text-center mb-6">
              <h1 className="font-bold text-2xl">{selectedSchool.name}</h1>
              <h3 className="text-gray-600">
                {getCityName(selectedSchool.city_id)}, {getStateName(selectedSchool.state_id)}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 bg-blue-50">
                <h3 className="font-semibold text-sm text-gray-500">Total de Alunos</h3>
                <p className="text-2xl font-bold">{selectedSchool.total_students || 0}</p>
              </Card>

              <Card className="p-4 bg-green-50">
                <h3 className="font-semibold text-sm text-gray-500">Contagem Diária</h3>
                <p className="text-2xl font-bold">{selectedSchool.dailyCount || 0}</p>
              </Card>

              <Card className="p-4 bg-yellow-50">
                <h3 className="font-semibold text-sm text-gray-500">Custo Unitário</h3>
                <p className="text-2xl font-bold">{selectedSchool.unitCost || "R$ 0,00"}</p>
              </Card>

              <Card className="p-4 bg-purple-50">
                <h3 className="font-semibold text-sm text-gray-500">Estoque Total</h3>
                <p className="text-2xl font-bold">
                  {selectedSchool.stock ? `R$ ${parseFloat(selectedSchool.stock).toFixed(2)}` : "R$ 0,00"}
                </p>
              </Card>
            </div>

            <div className="mb-4">
              <h2 className="font-bold text-lg mb-2">Detalhes por Turno</h2>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Turno</TableHead>
                      <TableHead>Modalidade</TableHead>
                      <TableHead>Alunos</TableHead>
                      <TableHead>Custo/Porção</TableHead>
                      <TableHead>Peso Líquido</TableHead>
                      <TableHead>Peso Bruto</TableHead>
                      <TableHead>Energia (kcal)</TableHead>
                      <TableHead>Contagem Diária</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Render all active shifts dynamically */}
                    {getActiveShifts(selectedSchool).map((shift) =>
                      renderShiftRow(
                        selectedSchool,
                        shift,
                        shift === "morning"
                          ? createMorning
                          : shift === "afternoon"
                          ? createAfternoon
                          : shift === "nigth" || shift === "night"
                          ? createNight
                          : createIntegral
                      )
                    )}

                    {/* Show message if no shifts are active */}
                    {getActiveShifts(selectedSchool).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          Nenhum turno ativo encontrado para esta escola
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div>
                <h3 className="font-semibold mb-2">Informações de Contato</h3>
                <p>
                  <strong>Email:</strong> {selectedSchool.email || "Não informado"}
                </p>
                <p>
                  <strong>Telefone:</strong> {selectedSchool.phone || "Não informado"}
                </p>
                <p>
                  <strong>Endereço:</strong> {selectedSchool.address || "Não informado"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Resumo Nutricional</h3>
                {selectedSchool.average_result_details?.total?.[0] ? (
                  <>
                    <p>
                      <strong>Custo Médio por Porção:</strong>{" "}
                      {selectedSchool.average_result_details.total[0].average_cost_per_serving}
                    </p>
                    <p>
                      <strong>Peso Médio Cozido:</strong>{" "}
                      {selectedSchool.average_result_details.total[0].average_cooked_weight}{" "}
                      {selectedSchool.average_result_details.total[0].unit_measure_weight}
                    </p>
                    <p>
                      <strong>Peso Médio Bruto:</strong>{" "}
                      {selectedSchool.average_result_details.total[0].average_gross_weight}{" "}
                      {selectedSchool.average_result_details.total[0].unit_measure_gross}
                    </p>
                    <p>
                      <strong>Energia Média:</strong> {selectedSchool.average_result_details.total[0].average_kcal} kcal
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">Nenhuma informação nutricional disponível</p>
                )}
              </div>
            </div>
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

/**
 * forma final de fazer o dashboard
 */

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
//   municipality: string;
//   type: string;
//   functioning: string;
//   total_students_morning: number;
//   teaching_modality_morning: string;
//   total_students_afternoon: number;
//   teaching_modality_afternoon: string;
//   total_students_night: number;
//   teaching_modality_night: string;
//   total_students_integral: number;
//   teaching_modality_integral: string;
//   total_students: number;
//   daily_count: number;
//   per_capital_gross: number;
//   per_capital_net: number;
//   energy: number;
//   unit_cost: number;
//   stock: number;
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

// interface SchoolInputs {
//   morning: string | number;
//   afternoon: string | number;
//   night: string | number;
//   integral: string | number;
// }

// const Dashboard = () => {
//   const { data, loading, error, fetchData } = useGet<DashboardResponse>("dashboard");
//   const [schoolInputs, setSchoolInputs] = useState<Record<number, SchoolInputs>>({});
//   const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

//   // API hooks
//   const { postData: createMorning } = usePost("numberOfStudents/morning");
//   const { postData: createAfternoon } = usePost("numberOfStudents/afternoon");
//   const { postData: createNight } = usePost("numberOfStudents/night");
//   const { postData: createIntegral } = usePost("numberOfStudents/integral");

//   // Mock data for development
//   const mockSchools = [
//     {
//       id: 1,
//       state_id: 1,
//       city_id: 1,
//       name: "Domingos Ferreira",
//       municipality: "Juazeiro do Norte",
//       type: "EETI",
//       functioning: "Integral",
//       total_students_morning: 0,
//       teaching_modality_morning: "Escola não tem aula neste turno ou não possui esta modalidade",
//       total_students_afternoon: 0,
//       teaching_modality_afternoon: "Escola não tem aula neste turno ou não possui esta modalidade",
//       total_students_night: 0,
//       teaching_modality_night: "Escola não tem aula neste turno ou não possui esta modalidade",
//       total_students_integral: 190,
//       teaching_modality_integral: "Integral",
//       total_students: 190,
//       daily_count: 162,
//       per_capital_gross: 219,
//       per_capital_net: 296,
//       energy: 6.88,
//       unit_cost: 6.88,
//       stock: 1184.26,
//       phone: "51 999999999",
//       email: "escoladomingos@gmail.com",
//       address: "Rua Principal, 123",
//       total_invested: "1184.26",
//       student_numbers: {
//         morning: 0,
//         afternoon: 0,
//         night: 0,
//         integral: 162,
//       },
//     },
//     {
//       id: 2,
//       state_id: 1,
//       city_id: 1,
//       name: "Maria das Dores",
//       municipality: "Juazeiro do Norte",
//       type: "EETI",
//       functioning: "Integral",
//       total_students_morning: 0,
//       teaching_modality_morning: "Escola não tem aula neste turno ou não possui esta modalidade",
//       total_students_afternoon: 0,
//       teaching_modality_afternoon: "Escola não tem aula neste turno ou não possui esta modalidade",
//       total_students_night: 0,
//       teaching_modality_night: "Escola não tem aula neste turno ou não possui esta modalidade",
//       total_students_integral: 250,
//       teaching_modality_integral: "Integral",
//       total_students: 250,
//       daily_count: 250,
//       per_capital_gross: 405,
//       per_capital_net: 376,
//       energy: 5.23,
//       unit_cost: 5.23,
//       stock: 1380.28,
//       phone: "51 999999999",
//       email: "escolamaria@gmail.com",
//       address: "Avenida Central, 456",
//       total_invested: "1380.28",
//       student_numbers: {
//         morning: 0,
//         afternoon: 0,
//         night: 0,
//         integral: 250,
//       },
//     },
//   ];

//   useEffect(() => {
//     // For development, use mock data instead of fetching
//     fetchData();
//   }, []);

//   useEffect(() => {
//     //    Initialize inputs with mock data for development
//     const initialInputs: Record<number, SchoolInputs> = {};
//     mockSchools.forEach((school) => {
//       initialInputs[school.id] = {
//         morning: school.student_numbers.morning || "",
//         afternoon: school.student_numbers.afternoon || "",
//         night: school.student_numbers.night || "",
//         integral: school.student_numbers.integral || "",
//       };
//     });
//     setSchoolInputs(initialInputs);
//   }, []);

//   const handleInputChange = (schoolId: number, shift: keyof SchoolInputs, value: string) => {
//     setSchoolInputs((prev) => ({
//       ...prev,
//       [schoolId]: {
//         ...prev[schoolId],
//         [shift]: value,
//       },
//     }));
//   };

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
//       toast(response?.message || "Cadastrado com sucesso!");
//     } catch (error) {
//       console.error(error);
//       toast.error("Erro ao cadastrar dados");
//     }
//   };

//   const handleSchoolClick = (school: School) => {
//     setSelectedSchool(school);
//   };

//   const closeSchoolDetail = () => {
//     setSelectedSchool(null);
//   };

//   const renderShiftRow = (
//     school: School,
//     shift: string,
//     count: number,
//     modality: string,
//     inputKey: keyof SchoolInputs,
//     createFn: any
//   ) => {
//     if (modality !== "Escola não tem aula neste turno ou não possui esta modalidade") {
//       return (
//         <TableRow>
//           <TableCell>{shift}</TableCell>
//           <TableCell>{modality}</TableCell>
//           <TableCell className="text-center">{count}</TableCell>
//           <TableCell className="flex flex-row">
//             <Input
//               value={schoolInputs[school.id]?.[inputKey] || ""}
//               className="w-20 mr-5"
//               type="number"
//               onChange={(e) => handleInputChange(school.id, inputKey, e.target.value)}
//             />
//             <Button onClick={() => handleSubmit(school.id, inputKey, createFn)}>Cadastrar</Button>
//           </TableCell>
//         </TableRow>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="flex flex-col justify-start gap-4">
//       <ToastContainer />
//       <h1 className="font-bold text-xl">Dados das escolas</h1>

//       {/* Table View (like second image) */}
//       {!selectedSchool && (
//         <Card className="p-4">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Município</TableHead>
//                 <TableHead>Escola</TableHead>
//                 <TableHead>Tipo</TableHead>
//                 <TableHead>Funcionamento</TableHead>
//                 <TableHead>Matriculados</TableHead>
//                 <TableHead>Contagem diária</TableHead>
//                 <TableHead>Per Capital (Bruto)</TableHead>
//                 <TableHead>Per Capital (Líquido)</TableHead>
//                 <TableHead>Energia</TableHead>
//                 <TableHead>Custo Unitário</TableHead>
//                 <TableHead>Estoque</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {mockSchools.map((school) => (
//                 <TableRow
//                   key={school.id}
//                   className="cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSchoolClick(school)}
//                 >
//                   <TableCell>{school.municipality}</TableCell>
//                   <TableCell className="font-medium text-blue-600">{school.name}</TableCell>
//                   <TableCell>{school.type}</TableCell>
//                   <TableCell>{school.functioning}</TableCell>
//                   <TableCell>{school.total_students}</TableCell>
//                   <TableCell>{school.daily_count}</TableCell>
//                   <TableCell>{school.per_capital_gross}</TableCell>
//                   <TableCell>{school.per_capital_net}</TableCell>
//                   <TableCell>{school.energy}</TableCell>
//                   <TableCell>{school.unit_cost}</TableCell>
//                   <TableCell>R$ {school.stock}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Card>
//       )}

//       {/* Detailed School View (like first image) */}
//       {selectedSchool && (
//         <div>
//           <Button onClick={closeSchoolDetail} className="mb-4">
//             &larr; Voltar para lista
//           </Button>
//           <Card className="p-4">
//             <h1 className="font-bold text-xl text-center">{selectedSchool.name}</h1>
//             <h3 className="font-bold text-sm text-center">Município {selectedSchool.municipality}</h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
//               <div>
//                 <p>
//                   <strong>Tipo:</strong> {selectedSchool.type}
//                 </p>
//                 <p>
//                   <strong>Funcionamento:</strong> {selectedSchool.functioning}
//                 </p>
//                 <p>
//                   <strong>Total de alunos:</strong> {selectedSchool.total_students}
//                 </p>
//               </div>
//               <div>
//                 <p>
//                   <strong>Custo Unitário:</strong> {selectedSchool.unit_cost}
//                 </p>
//                 <p>
//                   <strong>Energia:</strong> {selectedSchool.energy}
//                 </p>
//                 <p>
//                   <strong>Estoque:</strong> R$ {selectedSchool.stock}
//                 </p>
//               </div>
//             </div>

//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Turno</TableHead>
//                   <TableHead>Modalidade</TableHead>
//                   <TableHead>Número de aluno</TableHead>
//                   <TableHead>Contagem diária do turno</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {renderShiftRow(
//                   selectedSchool,
//                   "Manhã",
//                   selectedSchool.total_students_morning,
//                   selectedSchool.teaching_modality_morning,
//                   "morning",
//                   createMorning
//                 )}

//                 {renderShiftRow(
//                   selectedSchool,
//                   "Tarde",
//                   selectedSchool.total_students_afternoon,
//                   selectedSchool.teaching_modality_afternoon,
//                   "afternoon",
//                   createAfternoon
//                 )}

//                 {renderShiftRow(
//                   selectedSchool,
//                   "Noite",
//                   selectedSchool.total_students_night,
//                   selectedSchool.teaching_modality_night,
//                   "night",
//                   createNight
//                 )}

//                 {renderShiftRow(
//                   selectedSchool,
//                   "Integral",
//                   selectedSchool.total_students_integral,
//                   selectedSchool.teaching_modality_integral,
//                   "integral",
//                   createIntegral
//                 )}

//                 <TableRow>
//                   <TableCell colSpan={2}>
//                     <strong>Per Capital (Bruto):</strong> {selectedSchool.per_capital_gross}
//                   </TableCell>
//                   <TableCell colSpan={2}>
//                     <strong>Per Capital (Líquido):</strong> {selectedSchool.per_capital_net}
//                   </TableCell>
//                 </TableRow>

//                 <TableRow>
//                   <TableCell colSpan={2}>
//                     <strong>Total de alunos:</strong> {selectedSchool.total_students}
//                   </TableCell>
//                   <TableCell colSpan={2}>
//                     <strong>Total do estoque:</strong> R$ {selectedSchool.stock}
//                   </TableCell>
//                 </TableRow>
//               </TableBody>
//               <TableCaption>Email: {selectedSchool.email}</TableCaption>
//               <TableCaption>Telefone: {selectedSchool.phone}</TableCaption>
//               <TableCaption>Endereço: {selectedSchool.address}</TableCaption>
//             </Table>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
