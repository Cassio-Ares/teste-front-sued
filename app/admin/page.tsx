"use client";

import { informationError } from "@/components/informationError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { api, setToken } from "../../connect/api";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}
export default function Login() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("");
  const router = useRouter();

  const handleEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post<LoginResponse>("/access/login", {
        email,
      });

      if (response.data.success === true) {
        toast.success(response.data.message);
        setStep(2);
      }
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToken = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post<LoginResponse>("/access/token", {
        email,
        token: inputToken,
      });

      setToken(response.data.data.token);
      // toast.success(response.data.message || "Login realizado com sucesso");
      router.push("/admin/dashboard");
    } catch (error: any) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex lg:flex-row">
        <div className="lg:flex w-full h-60 lg:h-screen lg:w-[70%] bg-orange-200 bg-admin bg-blend-multiply text-white hidden"></div>
        <div className="flex flex-col bg-white text-black justify-center items-center w-full lg:w-[30%] gap-2 h-screen mx-10 lg:text-start">
          <div className="flex justify-start items-center">
            <img
              className="w-[250px] h-auto"
              src="/assets/images/sued-logo.png"
              alt="logo"
            />
          </div>
          <div className="flex flex-col justify-start items-center w-full text-start">
            <div className="flex flex-col w-full justify-start items-center mt-8 px-4">
              <div className="text-lg w-full">
                <ToastContainer />
                <h1 className="font-bold text-xl">Bem-vindo! 👋</h1>
                {step === 1 ? (
                  <>
                    <h1 className="text-lg">Acesse com o seu e-mail</h1>
                    <br />
                    <div className="flex flex-col gap-4 justify-center w-full items-center px-4">
                      <form
                        onSubmit={handleEmail}
                        className="flex flex-col w-full gap-4"
                      >
                        <Input
                          type="email"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                          placeholder="email@email.com"
                        />
                        <Button
                          disabled={loading}
                          className="mt-2 bg-orange-500 font-bold shadow-lg hover:bg-orange-600 transform duration-500 w-full"
                        >
                          Entrar
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-lg">Acesse com o seu token</h1>
                    <br />
                    <div className="flex flex-col gap-4 justify-center w-full items-center px-4">
                      <form
                        onSubmit={handleToken}
                        className="flex flex-col w-full gap-4"
                      >
                        <Input
                          type="text"
                          onChange={(e) => setInputToken(e.target.value)}
                          value={inputToken}
                          placeholder="Digite seu token"
                        />
                        <Button
                          disabled={loading}
                          className="mt-2 bg-orange-500 font-bold shadow-lg hover:bg-orange-600 transform duration-500 w-full"
                        >
                          Entrar
                        </Button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <footer className="flex flex-col items-center absolute bottom-0 pb-5 text-sm">
            <p>
              ©2024{" "}
              <Link
                href="#"
                className="text-orange-500 hover:text-orange-600 transform duration-150"
              >
                SUED
              </Link>{" "}
              - Todos os direitos reservados.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
