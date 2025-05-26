"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Field {
  marker: keyof (SignUpFormData & LoginFormData);
  localizeInfos: {
    title: string;
  };
}

interface SignUpFormData {
  email: string;
  password: string;
  name: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<
    Partial<SignUpFormData & LoginFormData>
  >({});

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get("type");
    setIsSignUp(type !== "login");
  }, [searchParams]);

  const formData: Field[] = isSignUp
    ? [
        {
          marker: "name",
          localizeInfos: { title: "Ad Soyad" },
        },
        {
          marker: "email",
          localizeInfos: { title: "E-posta" },
        },
        {
          marker: "password",
          localizeInfos: { title: "Şifre" },
        },
      ]
    : [
        {
          marker: "email",
          localizeInfos: { title: "E-posta" },
        },
        {
          marker: "password",
          localizeInfos: { title: "Şifre" },
        },
      ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Basit bir kontrol örneği
      if (!inputValues.email || !inputValues.password) {
        throw new Error("Lütfen tüm gerekli alanları doldurun.");
      }

      // Buraya API isteği yazılabilir (örnek):
      // await authRequest({ ...inputValues, isSignUp });

      // Başarılıysa yönlendir:
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setInputValues({});
  };

  return (
    <div className="flex min-h-screen mt-7">
      <div className="w-full max-w-3xl mx-auto flex flex-col lg:flex-row p-3">
        <div>
          <div
            className="mb-8 lg:mb-12 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <ChevronLeft className="text-gray-500 h-6 w-6 sm:h-8 sm:w-8 border-2 rounded-full p-1" />
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent pb-3">
              {isSignUp ? "Kayıt Ol" : "Giriş Yap"}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8">
              {isSignUp
                ? "SahandStore'a katıl, avantajları kaçırma!"
                : "Tekrar hoş geldin! Alışverişe devam et."}
            </p>
          </div>

          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {formData.map((field) => (
              <div key={field.marker}>
                <Label
                  htmlFor={field.marker}
                  className="text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block"
                >
                  {field.localizeInfos.title}
                </Label>
                <Input
                  id={field.marker}
                  type={field.marker === "password" ? "password" : "text"}
                  name={field.marker}
                  className="text-base sm:text-lg p-4 sm:p-6"
                  placeholder={field.localizeInfos.title}
                  value={
                    (inputValues[field.marker] as string | undefined) || ""
                  }
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            ))}

            {error && (
              <div className="text-red-500 mt-2 text-center">{error}</div>
            )}

            <div>
              <Button
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white text-base sm:text-xl font-bold p-4 sm:p-6 rounded-md shadow-xl transition-colors duration-300 ease-in-out cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                ) : isSignUp ? (
                  "Kayıt Ol"
                ) : (
                  "Giriş Yap"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-4 sm:mt-5 flex items-center justify-center">
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              {isSignUp ? "Zaten bir hesabın var mı?" : "Hesabın yok mu?"}
            </p>
            <Button
              variant="link"
              className="text-lg sm:text-xl lg:text-2xl text-gray-500 cursor-pointer"
              onClick={toggleForm}
            >
              {isSignUp ? "Giriş Yap" : "Kayıt Ol"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
