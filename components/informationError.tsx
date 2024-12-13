import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const informationError = (error: any) => {
    // Prioriza erros customizados do backend
    if (error?.response.data.success === false) {
        toast.error(error.response.data.message || 'Erro ao processar dados');
        return;
    }

    // Trata erros de resposta zod
    if (error?.response?.data) {
        const { details, error: errorMessage } = error.response.data;

        if (details && Array.isArray(details)) {
            // Múltiplos erros detalhados
            details.forEach((err) => {
                toast.error(err.message);
            });
        } else {
            // Erro único da API
            toast.error(errorMessage || 'Erro ao processar dados');
        }
        return;
    }

    // Erro de rede ou desconhecido
    if (error.message === 'Falha na rede') {
        toast.error('Sem conexão com o servidor');
    } else {
        toast.error('Erro desconhecido. Tente novamente.');
        console.error('Erro não tratado:', error);
    }
};



// // Verifica se o erro segue o padrão HTTP (response e data presentes)
// if (error?.response && error.response.data) {
//     const errorDetails = error.response.data.details;

//     if (errorDetails && Array.isArray(errorDetails)) {
//         // Exibe cada erro individualmente
//         errorDetails.forEach((err) => {
//             toast.error(err.message);
//         });
//     } else {
//         // Exibe um erro genérico se não houver detalhes específicos
//         toast.error(error.response.data.error || 'Erro ao processar dados');
//     }
// }
// // Verifica se é um erro customizado com success === false
// else if (error?.success === false) {
//     toast.error(error.message || 'Erro ao processar dados');
// }
// // Trata erros desconhecidos
// else {
//     toast.error('Erro desconhecido');
// }