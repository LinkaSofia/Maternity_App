import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Check, ShoppingCart, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function ShoppingList() {
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "baby",
    priority: "medium",
    price: "",
    store: "",
    notes: ""
  });

  const queryClient = useQueryClient();

  const { data: shoppingItems = [], isLoading } = useQuery({
    queryKey: ['/api/shopping-list'],
  });

  const createShoppingItem = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/shopping-list', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shopping-list'] });
      setShowForm(false);
      setFormData({ name: "", category: "baby", priority: "medium", price: "", store: "", notes: "" });
    },
  });

  const updateShoppingItem = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => 
      apiRequest('PUT', `/api/shopping-list/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shopping-list'] });
    },
  });

  const deleteShoppingItem = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/shopping-list/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shopping-list'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createShoppingItem.mutate({
      name: formData.name,
      category: formData.category,
      priority: formData.priority,
      price: formData.price ? parseFloat(formData.price) : undefined,
      store: formData.store || undefined,
      notes: formData.notes || undefined
    });
  };

  const togglePurchased = (id: number, currentStatus: boolean) => {
    updateShoppingItem.mutate({
      id,
      data: { isPurchased: !currentStatus }
    });
  };

  const categoryColors = {
    baby: 'bg-pink-100 text-pink-800',
    mom: 'bg-purple-100 text-purple-800',
    nursery: 'bg-blue-100 text-blue-800',
    hospital: 'bg-red-100 text-red-800',
    clothing: 'bg-green-100 text-green-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  const groupedItems = shoppingItems.reduce((acc: any, item: any) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryNames = {
    baby: 'Bebê',
    mom: 'Mamãe',
    nursery: 'Quarto do Bebê',
    hospital: 'Maternidade',
    clothing: 'Roupas',
    other: 'Outros'
  };

  const totalItems = shoppingItems.length;
  const purchasedItems = shoppingItems.filter((item: any) => item.isPurchased).length;
  const totalValue = shoppingItems
    .filter((item: any) => item.price)
    .reduce((sum: number, item: any) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/home')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Lista de Compras</h1>
        </div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Resumo das Compras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{purchasedItems}/{totalItems}</div>
                <div className="text-sm text-gray-500">Itens Comprados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totalValue > 0 ? `R$ ${totalValue.toFixed(2)}` : '--'}
                </div>
                <div className="text-sm text-gray-500">Valor Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((purchasedItems / Math.max(totalItems, 1)) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Progresso</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Item Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 bg-green-500 hover:bg-green-600"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Item
          </Button>
        )}

        {/* Add Item Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Novo Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Item</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Ex: Body manga longa"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baby">Bebê</SelectItem>
                        <SelectItem value="mom">Mamãe</SelectItem>
                        <SelectItem value="nursery">Quarto do Bebê</SelectItem>
                        <SelectItem value="hospital">Maternidade</SelectItem>
                        <SelectItem value="clothing">Roupas</SelectItem>
                        <SelectItem value="other">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Preço (R$) - Opcional</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="store">Loja - Opcional</Label>
                    <Input
                      id="store"
                      value={formData.store}
                      onChange={(e) => setFormData(prev => ({ ...prev, store: e.target.value }))}
                      placeholder="Ex: Baby Store"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createShoppingItem.isPending} className="flex-1">
                    {createShoppingItem.isPending ? 'Salvando...' : 'Adicionar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Shopping Items by Category */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : totalItems === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Sua lista de compras está vazia.</p>
                <p className="text-sm text-gray-400">Adicione itens para começar a se preparar!</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedItems).map(([category, items]: [string, any]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                    {categoryNames[category as keyof typeof categoryNames]}
                  </Badge>
                  <span className="text-sm text-gray-500">({items.length} itens)</span>
                </h2>
                
                <div className="space-y-2">
                  {items
                    .sort((a: any, b: any) => {
                      if (a.isPurchased !== b.isPurchased) {
                        return a.isPurchased ? 1 : -1;
                      }
                      const priorityOrder = { high: 0, medium: 1, low: 2 };
                      return priorityOrder[a.priority as keyof typeof priorityOrder] - 
                             priorityOrder[b.priority as keyof typeof priorityOrder];
                    })
                    .map((item: any) => (
                      <Card key={item.id} className={item.isPurchased ? 'opacity-60' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePurchased(item.id, item.isPurchased)}
                                className={`p-1 ${item.isPurchased ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <Check className="w-5 h-5" />
                              </Button>
                              
                              <div className={`flex-1 ${item.isPurchased ? 'line-through text-gray-500' : ''}`}>
                                <div className="font-medium">{item.name}</div>
                                <div className="flex gap-2 mt-1">
                                  <Badge size="sm" className={priorityColors[item.priority as keyof typeof priorityColors]}>
                                    {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Média' : 'Baixa'}
                                  </Badge>
                                  {item.price && (
                                    <Badge variant="outline" size="sm">
                                      R$ {item.price.toFixed(2)}
                                    </Badge>
                                  )}
                                  {item.store && (
                                    <Badge variant="outline" size="sm">
                                      {item.store}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteShoppingItem.mutate(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}