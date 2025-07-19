import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, MessageCircle, Heart, Reply, Users, Filter } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function Community() {
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showReplies, setShowReplies] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    isAnonymous: false
  });

  const queryClient = useQueryClient();

  const { data: communityPosts = [], isLoading } = useQuery({
    queryKey: ['/api/community-posts'],
  });

  const { data: replies = [] } = useQuery({
    queryKey: ['/api/community-replies'],
    enabled: showReplies !== null
  });

  const createPost = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/community-posts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-posts'] });
      setShowForm(false);
      setFormData({ title: "", content: "", category: "general", isAnonymous: false });
    },
  });

  const createReply = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/community-replies', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-replies'] });
      setReplyText("");
    },
  });

  const toggleLike = useMutation({
    mutationFn: ({ postId, isLiked }: { postId: number, isLiked: boolean }) => {
      if (isLiked) {
        // Remove like logic would go here
        return Promise.resolve();
      } else {
        return apiRequest('POST', '/api/community-likes', { postId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-posts'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      isAnonymous: formData.isAnonymous
    });
  };

  const handleReply = (postId: number) => {
    if (replyText.trim()) {
      createReply.mutate({
        postId,
        content: replyText,
        isAnonymous: false
      });
    }
  };

  const categoryColors = {
    general: 'bg-blue-100 text-blue-800',
    first_trimester: 'bg-green-100 text-green-800',
    second_trimester: 'bg-yellow-100 text-yellow-800',
    third_trimester: 'bg-orange-100 text-orange-800',
    tips: 'bg-purple-100 text-purple-800',
    questions: 'bg-pink-100 text-pink-800'
  };

  const categoryNames = {
    general: 'Geral',
    first_trimester: '1º Trimestre',
    second_trimester: '2º Trimestre',
    third_trimester: '3º Trimestre',
    tips: 'Dicas',
    questions: 'Perguntas'
  };

  const filteredPosts = selectedCategory === "all" 
    ? communityPosts 
    : communityPosts.filter((post: any) => post.category === selectedCategory);

  const getPostReplies = (postId: number) => {
    return replies.filter((reply: any) => reply.postId === postId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
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
          <h1 className="text-2xl font-bold text-gray-900">Comunidade de Mães</h1>
        </div>

        {/* Community Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Comunidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{communityPosts.length}</div>
                <div className="text-sm text-gray-500">Posts Publicados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {communityPosts.reduce((sum: number, post: any) => sum + (post.repliesCount || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Total de Respostas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {communityPosts.reduce((sum: number, post: any) => sum + (post.likesCount || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Curtidas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtrar Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="general">Geral</SelectItem>
                <SelectItem value="first_trimester">1º Trimestre</SelectItem>
                <SelectItem value="second_trimester">2º Trimestre</SelectItem>
                <SelectItem value="third_trimester">3º Trimestre</SelectItem>
                <SelectItem value="tips">Dicas</SelectItem>
                <SelectItem value="questions">Perguntas</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* New Post Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 bg-indigo-500 hover:bg-indigo-600"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Publicação
          </Button>
        )}

        {/* New Post Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Nova Publicação</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título (opcional)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Assunto da sua publicação"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                    placeholder="Compartilhe sua experiência, dúvida ou dica..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Geral</SelectItem>
                      <SelectItem value="first_trimester">1º Trimestre</SelectItem>
                      <SelectItem value="second_trimester">2º Trimestre</SelectItem>
                      <SelectItem value="third_trimester">3º Trimestre</SelectItem>
                      <SelectItem value="tips">Dicas</SelectItem>
                      <SelectItem value="questions">Perguntas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="anonymous"
                    checked={formData.isAnonymous}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAnonymous: checked }))}
                  />
                  <Label htmlFor="anonymous">Publicar anonimamente</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createPost.isPending} className="flex-1">
                    {createPost.isPending ? 'Publicando...' : 'Publicar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Community Posts */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Carregando publicações...</div>
          ) : filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhuma publicação encontrada.</p>
                <p className="text-sm text-gray-400">Seja a primeira a compartilhar!</p>
              </CardContent>
            </Card>
          ) : (
            filteredPosts
              .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((post: any) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {post.isAnonymous ? '?' : post.authorName?.charAt(0) || 'M'}
                          </div>
                          <div>
                            <p className="font-medium">
                              {post.isAnonymous ? 'Anônimo' : post.authorName || 'Mamãe'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString('pt-BR')} às {new Date(post.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <Badge className={categoryColors[post.category as keyof typeof categoryColors]}>
                          {categoryNames[post.category as keyof typeof categoryNames]}
                        </Badge>
                      </div>

                      {post.title && (
                        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                      )}
                      <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center gap-4 pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike.mutate({ postId: post.id, isLiked: false })}
                        className="text-gray-500 hover:text-pink-500"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        {post.likesCount || 0}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReplies(showReplies === post.id ? null : post.id)}
                        className="text-gray-500 hover:text-indigo-500"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.repliesCount || 0}
                      </Button>
                    </div>

                    {/* Replies Section */}
                    {showReplies === post.id && (
                      <div className="mt-4 pt-4 border-t">
                        {/* Reply Form */}
                        <div className="flex gap-2 mb-4">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            V
                          </div>
                          <div className="flex-1">
                            <Textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Escreva sua resposta..."
                              rows={2}
                              className="mb-2"
                            />
                            <Button
                              onClick={() => handleReply(post.id)}
                              disabled={!replyText.trim() || createReply.isPending}
                              size="sm"
                            >
                              <Reply className="w-3 h-3 mr-1" />
                              {createReply.isPending ? 'Enviando...' : 'Responder'}
                            </Button>
                          </div>
                        </div>

                        {/* Existing Replies */}
                        <div className="space-y-3">
                          {getPostReplies(post.id).map((reply: any) => (
                            <div key={reply.id} className="flex gap-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {reply.isAnonymous ? '?' : reply.authorName?.charAt(0) || 'M'}
                              </div>
                              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">
                                    {reply.isAnonymous ? 'Anônimo' : reply.authorName || 'Mamãe'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.createdAt).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
          )}
        </div>

        {/* Community Guidelines */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <p className="font-semibold text-indigo-800 mb-1">👥 Diretrizes da Comunidade:</p>
              <ul className="text-indigo-700 text-sm space-y-1">
                <li>• Seja respeitosa e empática com outras mães</li>
                <li>• Compartilhe experiências e dicas úteis</li>
                <li>• Não forneça conselhos médicos - sempre consulte profissionais</li>
                <li>• Mantenha um ambiente acolhedor e positivo</li>
                <li>• Respeite a privacidade e escolhas de outras mães</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}