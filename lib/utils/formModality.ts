export const formModality = (modality: string) => {
  switch (modality) {
    case "E.I":
      return "Ensino Infantil(0 a 5 anos)";
    case "E.F":
      return "Ensino Fundamental(6 a 14 anos)";
    case "E.M":
      return "Ensino Medio(15 a 17 anos)";
    case "EJA (E.F)":
      return "EJA Ensino Fundamental(A partir de 15 anos)";
    case "EJA (E.M)":
      return "EJA Ensino Medio(A partir de 18 anos)";
    default:
      return "modalidade de ensino não informada";
  }
};
