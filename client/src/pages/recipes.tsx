import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Clock, Users, ChefHat } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Recipes() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTrimester, setSelectedTrimester] = useState<string>("all");
  const [expandedRecipe, setExpandedRecipe] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['/api/recipes'],
  });

  const { data: favoriteRecipes = [] } = useQuery({
    queryKey: ['/api/favorite-recipes'],
  });

  const toggleFavorite = useMutation({
    mutationFn: ({ recipeId, isFavorite }: { recipeId: number, isFavorite: boolean }) => {
      if (isFavorite) {
        const favorite = favoriteRecipes.find((f: any) => f.recipeId === recipeId);
        return apiRequest('DELETE', `/api/favorite-recipes/${favorite.id}`);
      } else {
        return apiRequest('POST', '/api/favorite-recipes', { recipeId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorite-recipes'] });
    },
  });

  const categoryColors = {
    breakfast: 'bg-yellow-100 text-yellow-800',
    lunch: 'bg-green-100 text-green-800',
    dinner: 'bg-blue-100 text-blue-800',
    snack: 'bg-purple-100 text-purple-800'
  };

  const trimesterColors = {
    first: 'bg-orange-100 text-orange-800',
    second: 'bg-teal-100 text-teal-800',
    third: 'bg-rose-100 text-rose-800',
    all: 'bg-gray-100 text-gray-800'
  };

  const categoryNames = {
    breakfast: 'Café da Manhã',
    lunch: 'Almoço',
    dinner: 'Jantar',
    snack: 'Lanche'
  };

  const trimesterNames = {
    first: '1º Trimestre',
    second: '2º Trimestre',
    third: '3º Trimestre',
    all: 'Todos'
  };

  const filteredRecipes = recipes.filter((recipe: any) => {
    const categoryMatch = selectedCategory === "all" || recipe.category === selectedCategory;
    const trimesterMatch = selectedTrimester === "all" || recipe.trimesterRecommended === selectedTrimester || recipe.trimesterRecommended === "all";
    return categoryMatch && trimesterMatch;
  });

  const isFavorite = (recipeId: number) => {
    return favoriteRecipes.some((f: any) => f.recipeId === recipeId);
  };

  const handleToggleFavorite = (recipeId: number) => {
    const favorite = isFavorite(recipeId);
    toggleFavorite.mutate({ recipeId, isFavorite: favorite });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
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
          <h1 className="text-2xl font-bold text-gray-900">Receitas Saudáveis</h1>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    <SelectItem value="breakfast">Café da Manhã</SelectItem>
                    <SelectItem value="lunch">Almoço</SelectItem>
                    <SelectItem value="dinner">Jantar</SelectItem>
                    <SelectItem value="snack">Lanche</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Trimestre</label>
                <Select value={selectedTrimester} onValueChange={setSelectedTrimester}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Trimestres</SelectItem>
                    <SelectItem value="first">1º Trimestre</SelectItem>
                    <SelectItem value="second">2º Trimestre</SelectItem>
                    <SelectItem value="third">3º Trimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipes List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Carregando receitas...</div>
          ) : filteredRecipes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhuma receita encontrada para os filtros selecionados.</p>
              </CardContent>
            </Card>
          ) : (
            filteredRecipes.map((recipe: any) => (
              <Card key={recipe.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{recipe.title}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFavorite(recipe.id)}
                          disabled={toggleFavorite.isPending}
                          className={isFavorite(recipe.id) ? 'text-red-500' : 'text-gray-400'}
                        >
                          <Heart className={`w-5 h-5 ${isFavorite(recipe.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={categoryColors[recipe.category]}>
                          {categoryNames[recipe.category as keyof typeof categoryNames]}
                        </Badge>
                        <Badge className={trimesterColors[recipe.trimesterRecommended]}>
                          {trimesterNames[recipe.trimesterRecommended as keyof typeof trimesterNames]}
                        </Badge>
                        {recipe.prepTime && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {recipe.prepTime + (recipe.cookTime || 0)} min
                          </Badge>
                        )}
                        {recipe.servings && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {recipe.servings} porções
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3">{recipe.description}</p>

                      {recipe.nutritionBenefits && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                          <p className="font-medium text-green-800 mb-1">🌿 Benefícios Nutricionais:</p>
                          <p className="text-green-700 text-sm">{recipe.nutritionBenefits}</p>
                        </div>
                      )}

                      {expandedRecipe === recipe.id && (
                        <div className="space-y-4 mt-4">
                          {/* Ingredients */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Ingredientes:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {recipe.ingredients?.map((ingredient: string, index: number) => (
                                <li key={index} className="text-gray-700 text-sm">{ingredient}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Instructions */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Modo de Preparo:</h4>
                            <ol className="list-decimal pl-5 space-y-2">
                              {recipe.instructions?.map((instruction: string, index: number) => (
                                <li key={index} className="text-gray-700 text-sm">{instruction}</li>
                              ))}
                            </ol>
                          </div>

                          {/* Time breakdown */}
                          {(recipe.prepTime || recipe.cookTime) && (
                            <div className="flex gap-4 text-sm text-gray-600">
                              {recipe.prepTime && (
                                <span>⏱️ Preparo: {recipe.prepTime} min</span>
                              )}
                              {recipe.cookTime && (
                                <span>🔥 Cozimento: {recipe.cookTime} min</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                        className="mt-3 w-full"
                      >
                        {expandedRecipe === recipe.id ? 'Ocultar Receita' : 'Ver Receita Completa'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Favorite Recipes Summary */}
        {favoriteRecipes.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Minhas Receitas Favoritas ({favoriteRecipes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {favoriteRecipes.map((favorite: any) => {
                  const recipe = recipes.find((r: any) => r.id === favorite.recipeId);
                  return recipe ? (
                    <div key={favorite.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{recipe.title}</div>
                        <div className="text-xs text-gray-500">
                          {categoryNames[recipe.category as keyof typeof categoryNames]}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nutrition Tips */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="font-semibold text-orange-800 mb-1">🥗 Dicas de Alimentação na Gravidez:</p>
              <ul className="text-orange-700 text-sm space-y-1">
                <li>• Consuma bastante ácido fólico (verduras escuras, feijão)</li>
                <li>• Inclua ferro na dieta (carnes magras, leguminosas)</li>
                <li>• Cálcio é essencial (laticínios, sardinha, brócolis)</li>
                <li>• Evite peixes com alto teor de mercúrio</li>
                <li>• Mantenha-se sempre hidratada</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}