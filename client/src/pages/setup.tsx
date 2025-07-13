import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Baby, Heart, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPregnancySchema } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
    <div className="max-w-sm mx-auto bg-white min-h-screen shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Baby className="text-white" size={32} />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          Olá, {user?.firstName || "Mamãe"}!
        </h1>
        <p className="text-sm opacity-90">
          Vamos configurar sua jornada de gravidez
        </p>
      </div>

      {/* Progress Steps */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="text-sm font-medium">Informações</span>
          </div>
          <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="text-sm font-medium">Confirmação</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6 fade-in">
              <Card className="bg-white rounded-2xl card-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Calendar className="text-primary" size={20} />
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
                    <div className="mt-4 p-3 bg-sage/10 rounded-xl">
                      <p className="text-sm text-sage font-medium">
                        Você está na semana {currentWeek} de gestação
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white rounded-2xl card-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Heart className="text-secondary" size={20} />
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
                className="w-full bg-primary text-white py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 smooth-transition"
              >
                Continuar
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 fade-in">
              <Card className="bg-white rounded-2xl card-shadow">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Confirme suas informações</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Data da última menstruação:</span>
                      <span className="font-medium">
                        {form.watch("lastMenstrualPeriod") && new Date(form.watch("lastMenstrualPeriod")).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Semana atual:</span>
                      <span className="font-medium text-primary">{currentWeek} semanas</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Peso antes da gravidez:</span>
                      <span className="font-medium">{form.watch("prePregnancyWeight")}kg</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Peso atual:</span>
                      <span className="font-medium">{form.watch("currentWeight")}kg</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ganho de peso:</span>
                      <span className="font-medium text-sage">
                        +{((form.watch("currentWeight") || 0) - (form.watch("prePregnancyWeight") || 0)).toFixed(1)}kg
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Data prevista do parto:</span>
                      <span className="font-medium">
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
                <Button
                  type="submit"
                  disabled={createPregnancyMutation.isPending}
                  className="w-full bg-primary text-white py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 smooth-transition"
                >
                  {createPregnancyMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                  onClick={() => setCurrentStep(1)}
                  className="w-full py-4 rounded-xl"
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