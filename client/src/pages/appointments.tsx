import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar, Clock, MapPin, User, Stethoscope, Edit3, Trash2, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Appointment as AppointmentType } from "@shared/schema";

const appointmentSchema = z.object({
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  type: z.string().min(1, "Tipo de consulta é obrigatório"),
  doctor: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function Appointments() {
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentType | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      time: "09:00",
      type: "",
      doctor: "",
      location: "",
      notes: "",
    },
  });

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const { data: upcomingAppointments } = useQuery({
    queryKey: ["/api/appointments/upcoming"],
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointment: AppointmentFormData) => {
      await apiRequest("POST", "/api/appointments", {
        date: `${appointment.date}T${appointment.time}:00.000Z`,
        time: appointment.time,
        type: appointment.type,
        doctor: appointment.doctor,
        location: appointment.location,
        notes: appointment.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments/upcoming"] });
      setShowForm(false);
      form.reset();
      toast({
        title: "Consulta agendada!",
        description: "Sua consulta foi salva com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível agendar a consulta.",
        variant: "destructive",
      });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, appointment }: { id: number; appointment: Partial<AppointmentFormData> }) => {
      await apiRequest("PUT", `/api/appointments/${id}`, {
        date: appointment.date ? `${appointment.date}T${appointment.time}:00.000Z` : undefined,
        time: appointment.time,
        type: appointment.type,
        doctor: appointment.doctor,
        location: appointment.location,
        notes: appointment.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments/upcoming"] });
      setEditingAppointment(null);
      form.reset();
      toast({
        title: "Consulta atualizada!",
        description: "Suas alterações foram salvas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a consulta.",
        variant: "destructive",
      });
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments/upcoming"] });
      toast({
        title: "Consulta removida!",
        description: "A consulta foi cancelada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a consulta.",
        variant: "destructive",
      });
    },
  });

  const toggleCompletedMutation = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: number; isCompleted: boolean }) => {
      await apiRequest("PUT", `/api/appointments/${id}`, {
        isCompleted: !isCompleted,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments/upcoming"] });
      toast({
        title: "Status atualizado!",
        description: "Status da consulta foi atualizado.",
      });
    },
  });

  const handleSubmit = (appointment: AppointmentFormData) => {
    if (editingAppointment) {
      updateAppointmentMutation.mutate({ id: editingAppointment.id, appointment });
    } else {
      createAppointmentMutation.mutate(appointment);
    }
  };

  const handleEdit = (appointment: AppointmentType) => {
    setEditingAppointment(appointment);
    const appointmentDate = new Date(appointment.date);
    form.reset({
      date: appointmentDate.toISOString().split('T')[0],
      time: appointment.time,
      type: appointment.type,
      doctor: appointment.doctor || "",
      location: appointment.location || "",
      notes: appointment.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja cancelar esta consulta?")) {
      deleteAppointmentMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAppointment(null);
    form.reset();
  };

  const appointmentTypes = [
    { value: "prenatal", label: "Pré-natal" },
    { value: "ultrassom", label: "Ultrassom" },
    { value: "exames", label: "Exames" },
    { value: "obstetra", label: "Obstetra" },
    { value: "cardiologista", label: "Cardiologista" },
    { value: "nutricional", label: "Nutricional" },
    { value: "outros", label: "Outros" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM
  };

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Calendar className="mr-2" size={24} />
                Consultas
              </h1>
              <p className="text-sm opacity-90 mt-2">
                Gerencie seus compromissos médicos
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl">🩺</div>
            </div>
          </div>
        </div>
      </div>

      {/* Próxima Consulta Card */}
      {upcomingAppointments && upcomingAppointments.length > 0 && (
        <div className="p-6">
          <Card className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border-0">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Stethoscope className="mr-2 text-blue-500" size={20} />
                Próxima Consulta
              </h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="text-blue-500" size={16} />
                  <span>{formatDate(upcomingAppointments[0].date)}</span>
                  <Clock className="text-blue-500 ml-2" size={16} />
                  <span>{formatTime(upcomingAppointments[0].time)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium">{upcomingAppointments[0].type}</span>
                </div>
                {upcomingAppointments[0].doctor && (
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="text-blue-500" size={16} />
                    <span>{upcomingAppointments[0].doctor}</span>
                  </div>
                )}
                {upcomingAppointments[0].location && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="text-blue-500" size={16} />
                    <span>{upcomingAppointments[0].location}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Button */}
      <div className="px-6 mb-4">
        <Button
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="mr-2" size={20} />
          Agendar Consulta
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="px-6 mb-6">
          <Card className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingAppointment ? "Editar Consulta" : "Nova Consulta"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Data *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Horário *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              className="rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Tipo de Consulta *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {appointmentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doctor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Médico
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome do médico..."
                            className="rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Local
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Hospital, clínica..."
                            className="rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Observações
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Exames para levar, preparações especiais..."
                            className="rounded-xl min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="submit"
                      disabled={createAppointmentMutation.isPending || updateAppointmentMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {createAppointmentMutation.isPending || updateAppointmentMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Salvando...</span>
                        </div>
                      ) : (
                        <>
                          <Calendar className="mr-2" size={16} />
                          {editingAppointment ? "Atualizar" : "Agendar"}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="px-6 py-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Appointments List */}
      <div className="px-6 space-y-4 pb-20">
        {isLoading ? (
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ) : appointments && appointments.length > 0 ? (
          appointments.map((appointment: any) => (
            <Card key={appointment.id} className={`rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 ${
              appointment.isCompleted 
                ? "bg-gradient-to-br from-green-50 to-green-100" 
                : "bg-gradient-to-br from-white to-blue-50"
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="text-blue-500" size={16} />
                      <span className="font-medium">{formatDate(appointment.date)}</span>
                      <Clock className="text-blue-500 ml-2" size={16} />
                      <span>{formatTime(appointment.time)}</span>
                    </div>
                    
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {appointmentTypes.find(t => t.value === appointment.type)?.label || appointment.type}
                    </h3>
                    
                    {appointment.doctor && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                        <User size={14} />
                        <span>{appointment.doctor}</span>
                      </div>
                    )}
                    
                    {appointment.location && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                        <MapPin size={14} />
                        <span>{appointment.location}</span>
                      </div>
                    )}
                    
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCompletedMutation.mutate({ 
                        id: appointment.id, 
                        isCompleted: appointment.isCompleted 
                      })}
                      className={`p-2 rounded-lg transition-colors ${
                        appointment.isCompleted 
                          ? "text-green-600 hover:text-green-700" 
                          : "text-gray-400 hover:text-green-600"
                      }`}
                    >
                      <Check size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(appointment)}
                      className="p-2 text-blue-500 hover:text-blue-600 rounded-lg"
                    >
                      <Edit3 size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(appointment.id)}
                      className="p-2 text-red-500 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0">
            <CardContent className="p-6 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar size={48} className="mx-auto" />
              </div>
              <h3 className="font-medium text-gray-600 mb-2">Nenhuma consulta agendada</h3>
              <p className="text-sm text-gray-500">
                Comece agendando sua primeira consulta
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}