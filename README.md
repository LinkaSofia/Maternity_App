# 🤱 Maternidade App

Um aplicativo mobile completo de acompanhamento da gestação e maternidade, desenvolvido em Flutter para auxiliar gestantes e puérperas em sua jornada maternal.

## 📱 Funcionalidades Principais

### ✅ Implementadas
- **Cadastro da Usuária**
  - Nome (obrigatório)
  - Email e telefone (opcionais)
  - Data de nascimento (opcional)
  - Data da última menstruação (DUM) ou Data prevista do parto (DPP)
  - Cálculo automático da semana gestacional e data prevista do parto

- **Acompanhamento Semanal da Gravidez**
  - Informações detalhadas para cada semana (1-42)
  - Comparação do tamanho do bebê com frutas/objetos
  - Estimativa de peso e comprimento
  - Imagens ilustrativas (placeholders incluídos)
  - Dicas semanais personalizadas
  - Sintomas comuns por semana
  - Mudanças no corpo da mãe

- **Tela Inicial Personalizada**
  - Saudação com nome da usuária
  - Card da semana gestacional atual
  - Progresso da gravidez com barra visual
  - Contagem regressiva para o parto
  - Ações rápidas para navegação
  - Mensagens motivacionais diárias
  - Dicas da semana atual

- **Sistema de Notificações**
  - Notificações semanais de nova semana gestacional
  - Mensagens motivacionais diárias
  - Lembretes para o diário
  - Notificações de preparação para o parto (36+ semanas)
  - Alertas personalizados (consultas, exames)

- **Interface Moderna e Acessível**
  - Design responsivo com cores suaves (rosa bebê, lilás)
  - Fonte Lexend para melhor legibilidade
  - Navegação intuitiva por abas
  - Animações suaves e feedback visual
  - Tema personalizado com Material Design 3

### 🚧 Em Desenvolvimento
- **Diário da Gestante**
  - Registro de sintomas diários
  - Anotações pessoais
  - Controle de peso
  - Humor e bem-estar

- **Cronômetro de Contrações**
  - Timer para duração das contrações
  - Cálculo de intervalos
  - Análise automática (regra 5-1-1)
  - Alerta para ida à maternidade
  - Gráficos de frequência

- **Funcionalidades Extras Planejadas**
  - Checklist de preparação para o parto
  - Gráficos de ganho de peso
  - Modo pós-parto (amamentação, vacinas)
  - Central de conteúdos educativos
  - Exportação de relatórios em PDF

## 🛠️ Tecnologias Utilizadas

- **Flutter 3.16.9** - Framework multiplataforma
- **Provider** - Gerenciamento de estado
- **SQLite** - Banco de dados local
- **Google Fonts** - Tipografia (Lexend)
- **Local Notifications** - Sistema de notificações
- **Material Design 3** - Interface moderna

### Dependências Principais
```yaml
dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.1           # Gerenciamento de estado
  sqflite: ^2.3.0            # Banco de dados SQLite
  shared_preferences: ^2.2.2  # Preferências locais
  google_fonts: ^6.1.0       # Fontes personalizadas
  flutter_local_notifications: ^16.3.2  # Notificações
  permission_handler: ^11.2.0 # Permissões
  intl: ^0.19.0              # Formatação de datas
  font_awesome_flutter: ^10.6.0  # Ícones extras
```

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura organizada em camadas:

```
lib/
├── models/                 # Modelos de dados
│   ├── user_model.dart
│   ├── pregnancy_week_model.dart
│   ├── diary_entry_model.dart
│   └── contraction_model.dart
├── controllers/            # Lógica de negócio (Provider)
│   ├── user_controller.dart
│   └── contraction_controller.dart
├── services/              # Serviços externos
│   ├── database_service.dart
│   └── notification_service.dart
├── screens/               # Telas da aplicação
│   ├── splash_screen.dart
│   ├── onboarding_screen.dart
│   ├── home_screen.dart
│   ├── week_details_screen.dart
│   ├── diary_screen.dart
│   ├── contractions_screen.dart
│   └── profile_screen.dart
└── main.dart             # Ponto de entrada
```

## 📊 Banco de Dados

### Tabelas Implementadas

1. **users** - Dados da usuária
2. **pregnancy_weeks** - Informações das semanas (pré-populado)
3. **diary_entries** - Entradas do diário
4. **contractions** - Registro de contrações

### Dados Pré-populados

O app inclui informações detalhadas para 11 semanas-chave da gestação:
- Semana 1, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40
- Para cada semana: título, comparação com fruta, peso/tamanho estimado, descrição, dicas, sintomas comuns

## 🚀 Como Executar

### Pré-requisitos
- Flutter SDK 3.16.9 ou superior
- Android Studio / VS Code
- Emulador Android ou dispositivo físico

### Instalação
1. Clone o repositório:
```bash
git clone <repository-url>
cd maternidade_app
```

2. Instale as dependências:
```bash
flutter pub get
```

3. Execute o aplicativo:
```bash
flutter run
```

### Para Web (opcional)
```bash
flutter run -d web
```

## 📱 Fluxo da Aplicação

1. **Splash Screen** - Carregamento inicial e verificação de usuário
2. **Onboarding** - Cadastro inicial (3 etapas)
   - Apresentação do app
   - Dados pessoais
   - Informações da gravidez
3. **Tela Principal** - Dashboard com informações da semana atual
4. **Navegação por Abas**:
   - Início (dashboard)
   - Diário (em desenvolvimento)
   - Contrações (em desenvolvimento)
   - Perfil (em desenvolvimento)

## 🎨 Design System

### Cores Principais
- **Primary**: `#E8B4CB` (Rosa bebê)
- **Secondary**: `#DDA0DD` (Lilás)
- **Background**: `#FFF8F8` (Branco rosado)
- **Surface**: `#FFFFFF` (Branco)
- **On Primary**: `#5D2E45` (Marrom rosado)

### Tipografia
- **Fonte**: Lexend (todas as variações)
- **Tamanhos**: Escala responsiva do Material Design

## 🔔 Sistema de Notificações

### Tipos de Notificação
1. **Semanais**: Nova semana gestacional
2. **Diárias**: Mensagens motivacionais (9h)
3. **Diário**: Lembretes para registro (20h)
4. **Preparação**: Tarefas pré-parto (36+ semanas)
5. **Contrações**: Alertas de frequência
6. **Personalizadas**: Consultas e exames

## 🔧 Funcionalidades Inteligentes

### Cálculos Automáticos
- **Semana Gestacional**: Baseado na DUM ou DPP
- **Data Prevista do Parto**: Automática a partir da DUM
- **Progresso da Gravidez**: Porcentagem visual
- **Dias Restantes**: Contagem regressiva

### Personalização
- **Conteúdo Adaptativo**: Baseado na semana atual
- **Trimestre**: Identificação automática
- **Proximidade do Parto**: Funcionalidades especiais para 36+ semanas

## 🚧 Próximos Passos

### Funcionalidades Prioritárias
1. **Implementar Diário Completo**
   - Interface de edição
   - Seletor de sintomas
   - Gráficos de humor
   - Histórico visual

2. **Cronômetro de Contrações**
   - Timer em tempo real
   - Lista de contrações
   - Análise estatística
   - Alertas automáticos

3. **Tela de Perfil**
   - Edição de dados
   - Configurações
   - Exportação de dados
   - Backup/restauração

### Melhorias Futuras
- Modo offline completo
- Sincronização em nuvem
- Modo parceiro/acompanhante
- Integração com wearables
- Suporte a múltiplas gestações
- Modo pós-parto completo

## 📄 Licença

Este projeto foi desenvolvido como demonstração das capacidades de desenvolvimento Flutter para aplicações de saúde maternal.

## 👥 Contribuição

O projeto está aberto para contribuições. Áreas prioritárias:
- Implementação das telas em desenvolvimento
- Melhoria da UX/UI
- Otimização de performance
- Testes automatizados
- Documentação adicional

---

**Desenvolvido com ❤️ para auxiliar mamães em sua jornada maternal** 🤱👶