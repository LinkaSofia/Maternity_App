import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Baby, Heart, ArrowRight, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPregnancySchema } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import motherBabyImage from "@assets/image_1752428001266.png";
import heartImage from "@assets/image_1752428013534.png";

const setupSchema = z.object({
  lastMenstrualPeriod: z.string().min(1, "Data da última menstruação é obrigatória"),
  prePregnancyWeight: z.number().min(30, "Peso deve ser maior que 30kg").max(200, "Peso deve ser menor que 200kg"),
  currentWeight: z.number().min(30, "Peso deve ser maior que 30kg").max(200, "Peso deve ser menor que 200kg"),
});

type SetupFormData = z.infer<typeof setupSchema>;

export default function Setup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      lastMenstrualPeriod: "",
      prePregnancyWeight: undefined,
      currentWeight: undefined,
    },
  });

  const createPregnancyMutation = useMutation({
    mutationFn: async (data: SetupFormData) => {
      const dueDate = new Date(data.lastMenstrualPeriod);
      dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
      
      return await apiRequest("POST", "/api/pregnancies", {
        lastMenstrualPeriod: data.lastMenstrualPeriod,
        dueDate: dueDate.toISOString().split('T')[0],
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

  const calculateCurrentWeek = () => {
    const lmp = form.watch("lastMenstrualPeriod");
    if (!lmp) return 0;
    
    const lmpDate = new Date(lmp);
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

      {/* Header */}
      <div className="relative p-8 text-center">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl mb-4">
            <img 
              src={motherBabyImage} 
              alt="Mãe e bebê" 
              className="w-16 h-16 object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-200/20 to-transparent rounded-full"></div>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Olá, {user?.firstName || "Mamãe"}!
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Vamos configurar sua jornada de gravidez
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-8 mb-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="text-sm font-medium">Informações</span>
              </div>
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="text-sm font-medium">Confirmação</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-pink-400 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 pb-8 space-y-6 relative">
          {currentStep === 1 && (
            <div className="space-y-6 fade-in">
              <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <Calendar className="text-white" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Data da Última Menstruação</h2>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="lastMenstrualPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Data da última menstruação (DUM)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="rounded-xl"
                            max={new Date().toISOString().split('T')[0]}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {currentWeek > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="text-green-600" size={16} />
                        <p className="text-sm text-green-700 font-medium">
                          Você está na semana {currentWeek} de gestação
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="text-white" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Informações de Peso</h2>
                  </div>
                  
                  <div className="space-y-4">
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
                              type="number"
                              step="0.1"
                              className="rounded-xl"
                              placeholder="Ex: 65.5"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                              type="number"
                              step="0.1"
                              className="rounded-xl"
                              placeholder="Ex: 68.2"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!form.watch("lastMenstrualPeriod") || !form.watch("prePregnancyWeight") || !form.watch("currentWeight")}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Continuar
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 fade-in">
              <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="text-white" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Confirme suas informações</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Data da última menstruação:</span>
                      <span className="font-bold text-gray-800">
                        {form.watch("lastMenstrualPeriod") && new Date(form.watch("lastMenstrualPeriod")).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Semana atual:</span>
                      <span className="font-bold text-pink-600">{currentWeek} semanas</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Peso antes da gravidez:</span>
                      <span className="font-bold text-gray-800">{form.watch("prePregnancyWeight")}kg</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Peso atual:</span>
                      <span className="font-bold text-gray-800">{form.watch("currentWeight")}kg</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Ganho de peso:</span>
                      <span className="font-bold text-green-600">
                        +{((form.watch("currentWeight") || 0) - (form.watch("prePregnancyWeight") || 0)).toFixed(1)}kg
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Data prevista do parto:</span>
                      <span className="font-bold text-purple-600">
                        {form.watch("lastMenstrualPeriod") && (() => {
                          const dueDate = new Date(form.watch("lastMenstrualPeriod"));
                          dueDate.setDate(dueDate.getDate() + 280);
                          return dueDate.toLocaleDateString("pt-BR");
                        })()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Card className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl shadow-2xl border-0 overflow-hidden">
                  <CardContent className="p-6 text-center relative">
                    <div className="absolute top-2 right-2 w-10 h-10 opacity-20">
                      <img src={heartImage} alt="Heart" className="w-full h-full object-contain" />
                    </div>
                    
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Heart className="text-white" size={20} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">
                      Pronta para começar?
                    </h3>
                    <p className="text-white/90 mb-4 text-sm">
                      Suas informações estão corretas
                    </p>
                    
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
                  </CardContent>
                </Card>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="w-full py-4 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
                >
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}