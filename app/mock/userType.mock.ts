interface UserData {
  id: number;
  value: string;
  user_type: string;
}
export const userTypeData: UserData[] = [
  {
    id: 1,
    value: "Administrador",
    user_type: "adm",
  },
  {
    id: 2,
    value: "Nutricionista",
    user_type: "nutri",
  },
  {
    id: 3,
    value: "Estado",
    user_type: "state",
  },
  {
    id: 4,
    value: "Municipio/ Cidade",
    user_type: "city",
  },
  {
    id: 5,
    value: "Instituição",
    user_type: "school",
  },
];
