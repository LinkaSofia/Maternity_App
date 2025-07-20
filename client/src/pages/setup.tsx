import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Baby, Heart, ArrowRight, Camera, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPregnancySchema } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const setupSchema = z.object({
  // Dados pessoais
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  fullName: z.string().min(2, "Nome completo deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  profileImageData: z.string().optional(),
  
  // Dados da gravidez
  dateType: z.enum(["lmp", "due"], { required_error: "Escolha uma opção de data" }),
  lastMenstrualPeriod: z.string().optional(),
  dueDate: z.string().optional(),
  prePregnancyWeight: z.number().optional(),
  currentWeight: z.number().optional(),
}).refine((data) => {
  if (data.dateType === "lmp" && !data.lastMenstrualPeriod) {
    return false;
  }
  if (data.dateType === "due" && !data.dueDate) {
    return false;
  }
  return true;
}, {
  message: "Preencha a data selecionada",
  path: ["dateType"],
});

type SetupFormData = z.infer<typeof setupSchema>;

export default function Setup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      fullName: "",
      phone: "",
      birthDate: "",
      profileImageData: "",
      dateType: undefined,
      lastMenstrualPeriod: "",
      dueDate: "",
      prePregnancyWeight: undefined,
      currentWeight: undefined,
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<SetupFormData>) => {
      return await apiRequest("PUT", "/api/auth/user", userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const createPregnancyMutation = useMutation({
    mutationFn: async (data: SetupFormData) => {
      // Primeiro atualiza os dados do usuário
      await updateUserMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        phone: data.phone,
        birthDate: data.birthDate,
        profileImageData: data.profileImageData,
      });

      // Depois cria a gravidez
      let lastMenstrualPeriod: string;
      let dueDate: string;
      
      if (data.dateType === "lmp") {
        lastMenstrualPeriod = data.lastMenstrualPeriod!;
        const dueDateObj = new Date(data.lastMenstrualPeriod!);
        dueDateObj.setDate(dueDateObj.getDate() + 280); // 40 weeks
        dueDate = dueDateObj.toISOString().split('T')[0];
      } else {
        dueDate = data.dueDate!;
        const lmpObj = new Date(data.dueDate!);
        lmpObj.setDate(lmpObj.getDate() - 280); // 40 weeks back
        lastMenstrualPeriod = lmpObj.toISOString().split('T')[0];
      }
      
      return await apiRequest("POST", "/api/pregnancies", {
        lastMenstrualPeriod,
        dueDate,
        prePregnancyWeight: data.prePregnancyWeight,
        currentWeight: data.currentWeight,
        isActive: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pregnancies/active"] });
      toast({
        title: "Perfil criado com sucesso!",
        description: "Bem-vinda ao BabyJourney! Sua jornada começa agora.",
      });
      // Redirect to home
      window.location.href = "/";
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar perfil",
        description: "Não foi possível salvar suas informações. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SetupFormData) => {
    createPregnancyMutation.mutate(data);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setValue("profileImageData", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateCurrentWeek = () => {
    const dateType = form.watch("dateType");
    const lmp = form.watch("lastMenstrualPeriod");
    const dueDate = form.watch("dueDate");
    
    let lmpDate: Date;
    
    if (dateType === "lmp" && lmp) {
      lmpDate = new Date(lmp);
    } else if (dateType === "due" && dueDate) {
      lmpDate = new Date(dueDate);
      lmpDate.setDate(lmpDate.getDate() - 280); // 40 weeks back
    } else {
      return 0;
    }
    
    const today = new Date();
    const diffInDays = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.floor(diffInDays / 7);
  };

  const currentWeek = calculateCurrentWeek();

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-indigo-200 rounded-full opacity-25 animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-pink-300 rounded-full opacity-15 animate-pulse delay-500"></div>
      </div>

      <div className="p-4 space-y-4 relative">
        {/* Header and Progress in one card */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center relative overflow-hidden shadow-xl mb-4">
                <img src="/logo.png" alt="BabyJourney Logo" className="w-7 h-7 rounded-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-200/20 to-transparent rounded-full"></div>
              </div>
              
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Olá, {user?.firstName || "Mamãe"}!
              </h1>
              <p className="text-gray-700 font-medium">
                Vamos configurar sua jornada de gravidez
              </p>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="text-sm font-medium">Perfil</span>
              </div>
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="text-sm font-medium">Gravidez</span>
              </div>
              <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-pink-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 3 ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="text-sm font-medium">Confirmação</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-pink-400 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative">
            {currentStep === 1 && (
              <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Profile Picture */}
                    <div className="text-center mb-6">
                      <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-lg">
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt="Foto de perfil" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="text-pink-400" size={32} />
                          )}
                        </div>
                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200">
                          <Camera className="text-white" size={16} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Clique para adicionar sua foto</p>
                    </div>

                    {/* Form Fields */}
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Nome *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xl"
                              placeholder="Seu nome"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Sobrenome *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xl"
                              placeholder="Seu sobrenome"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Nome Completo *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xl"
                              placeholder="Nome completo"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Telefone *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xl"
                              placeholder="(11) 99999-9999"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Data de Nascimento *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xl"
                              type="date"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:shadow-xl transition-all duration-300"
                    >
                      Próximo
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <img src="/logo.png" alt="Baby" className="w-6 h-6 rounded-full" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">Dados da Gravidez</h2>
                      <p className="text-gray-600">Vamos calcular sua semana gestacional</p>
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="dateType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Como você prefere informar? *
                            </FormLabel>
                            <div className="space-y-2">
                              <label className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-pink-50">
                                <input
                                  type="radio"
                                  value="lmp"
                                  checked={field.value === "lmp"}
                                  onChange={() => field.onChange("lmp")}
                                  className="text-pink-500"
                                />
                                <div>
                                  <div className="font-medium">Data da última menstruação (DUM)</div>
                                  <div className="text-sm text-gray-600">Primeira data do último ciclo</div>
                                </div>
                              </label>
                              <label className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-pink-50">
                                <input
                                  type="radio"
                                  value="due"
                                  checked={field.value === "due"}
                                  onChange={() => field.onChange("due")}
                                  className="text-pink-500"
                                />
                                <div>
                                  <div className="font-medium">Data prevista do parto (DPP)</div>
                                  <div className="text-sm text-gray-600">Data estimada pelo médico</div>
                                </div>
                              </label>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("dateType") === "lmp" && (
                        <FormField
                          control={form.control}
                          name="lastMenstrualPeriod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Data da Última Menstruação *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="rounded-xl"
                                  type="date"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {form.watch("dateType") === "due" && (
                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Data Prevista do Parto *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="rounded-xl"
                                  type="date"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="prePregnancyWeight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Peso antes da gravidez (kg)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="rounded-xl"
                                  type="number"
                                  step="0.1"
                                  placeholder="65.0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="currentWeight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Peso atual (kg)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="rounded-xl"
                                  type="number"
                                  step="0.1"
                                  placeholder="67.0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="w-full py-4 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
                      >
                        Voltar
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:shadow-xl transition-all duration-300"
                      >
                        Próximo
                        <ArrowRight className="ml-2" size={20} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-center text-white space-y-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Heart className="text-white" size={24} />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">
                      Pronta para começar?
                    </h3>
                    <p className="text-white/90 mb-4 text-sm">
                      Suas informações estão corretas
                    </p>
                    
                    {currentWeek > 0 && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                        <p className="text-sm text-white/80 mb-1">Você está na</p>
                        <p className="text-2xl font-bold text-white">{currentWeek}ª semana</p>
                        <p className="text-sm text-white/80">de gestação</p>
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      disabled={createPregnancyMutation.isPending}
                      className="w-full bg-white text-purple-600 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {createPregnancyMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Salvando...</span>
                        </div>
                      ) : (
                        <>
                          <Heart className="mr-2" size={20} />
                          Começar Minha Jornada
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="w-full py-4 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/40 transition-all duration-300"
                    >
                      Voltar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}