# BabyJourney - Pregnancy Tracking Application

## Overview

BabyJourney is a comprehensive pregnancy tracking application that helps expecting mothers monitor their pregnancy journey. The application provides features for tracking pregnancy progress, maintaining a diary, monitoring appointments, and accessing educational content. It uses a modern full-stack architecture with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: More colorful and vibrant landing page with mother-baby imagery, showing more life and warmth.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Mobile-First Design
- Responsive design optimized for mobile devices
- Mobile-specific breakpoints and touch interactions
- Progressive Web App capabilities

## Key Components

### Authentication System
- **Provider**: Replit Auth using OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Security**: HTTP-only cookies with secure flag for production

### Database Schema
- **Users**: Profile information and authentication data
- **Pregnancies**: Pregnancy tracking with LMP, due dates, and weight monitoring
- **Diary Entries**: Personal journal entries with mood tracking and tags
- **Appointments**: Healthcare appointment scheduling and tracking
- **Weight Entries**: Weight monitoring throughout pregnancy
- **Baby Development**: Weekly development milestones and information

### Core Features
1. **Pregnancy Progress Tracking**
   - Weekly progress calculation based on Last Menstrual Period (LMP)
   - Visual progress indicators and milestone tracking
   - Baby size comparisons with fruit analogies

2. **Diary System**
   - Personal journal entries with rich text support
   - Mood tracking and tagging system
   - Search functionality for past entries

3. **Appointment Management**
   - Healthcare appointment scheduling
   - Upcoming appointment reminders
   - Appointment history tracking

4. **Educational Content**
   - Weekly pregnancy tips and information
   - Health reminders and guidelines
   - Baby development information

## Data Flow

### Authentication Flow
1. User attempts to access protected routes
2. Replit Auth redirects to OpenID Connect provider
3. User authenticates and returns with tokens
4. Session is created and stored in PostgreSQL
5. User profile is created or updated in database

### Pregnancy Tracking Flow
1. User creates pregnancy record with LMP date
2. System calculates current week and due date
3. Progress is calculated and displayed with visual indicators
4. Weekly content is fetched and displayed based on current week

### Diary Entry Flow
1. User creates diary entries through form interface
2. Entries are validated and stored with user association
3. Entries can be searched, filtered, and retrieved
4. Mood and tags are tracked for analytics

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database queries and migrations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **date-fns**: Date manipulation and formatting

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Variant-based component styling
- **lucide-react**: Icon library

### Authentication Dependencies
- **openid-client**: OpenID Connect client implementation
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **Type Checking**: TypeScript compilation with strict mode
- **Database**: Local PostgreSQL with migrations via Drizzle
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPLIT_DOMAINS

### Production Build
- **Frontend**: Vite build with optimizations and code splitting
- **Backend**: esbuild compilation to ESM format
- **Database**: Neon Database with connection pooling
- **Static Assets**: Served from dist/public directory

### Environment Configuration
- **Development**: NODE_ENV=development with detailed logging
- **Production**: NODE_ENV=production with error handling
- **Database**: Automatic migrations on startup
- **Sessions**: Secure cookies with appropriate expiration

### Performance Considerations
- **Query Optimization**: React Query with infinite stale time
- **Bundle Optimization**: Vite's automatic code splitting
- **Image Optimization**: Responsive images with proper sizing
- **Caching**: Server-side caching for static content

The application is designed to be deployed on Replit with automatic database provisioning and authentication integration. The mobile-first approach ensures optimal performance on mobile devices while maintaining desktop compatibility.

## 🔗 **Conexão com o Banco de Dados**

O projeto usa **Neon Database** (PostgreSQL na nuvem) como banco de dados principal. Aqui estão os detalhes da conexão:

### ** Configuração Atual**

```typescript
// server/db.ts
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

// Configuração do WebSocket para Neon
neonConfig.webSocketConstructor = ws;

// Conexão com o banco
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});
export const db = drizzle({ client: pool, schema });
```

### **🔧 Variáveis de Ambiente Necessárias**

Você precisa configurar a variável `DATABASE_URL` no arquivo `.env`:

```env
# Para Neon Database (recomendado)
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

# Para PostgreSQL local
DATABASE_URL=postgresql://usuario:senha@localhost:5432/babyjourney
```

### ** Opções de Banco de Dados**

#### **Opção 1: Neon Database (Recomendado)**
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a `DATABASE_URL` fornecida
5. Cole no arquivo `.env`

#### **Opção 2: PostgreSQL Local**
```bash
# Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Criar banco de dados
sudo -u postgres psql
CREATE DATABASE babyjourney;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE babyjourney TO myuser;
\q

# Configurar .env
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/babyjourney
```

### ** Estrutura do Banco**

O projeto usa **Drizzle ORM** com as seguintes tabelas:

```typescript
<code_block_to_apply_changes_from>
```

### **🚀 Como Configurar**

#### **Passo 1: Criar arquivo .env**
```bash
# Na raiz do projeto
touch .env
```

#### **Passo 2: Adicionar DATABASE_URL**
```env
# Para Neon (recomendado)
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

# Para PostgreSQL local
DATABASE_URL=postgresql://usuario:senha@localhost:5432/babyjourney
```

#### **Passo 3: Executar migrações**
```bash
npm run db:push
```

#### **Passo 4: Verificar conexão**
```bash
npm run dev
```

### **🔍 Verificar se está funcionando**

Se a conexão estiver correta, você verá:
- ✅ Servidor iniciando sem erros
- ✅ Migrações executadas com sucesso
- ✅ Aplicação acessível em `http://localhost:5000`

### **⚠️ Problemas Comuns**

#### **Erro: "DATABASE_URL must be set"**
```bash
# Solução: Criar arquivo .env com a URL do banco
echo "DATABASE_URL=sua_url_aqui" > .env
```

#### **Erro de conexão com Neon**
```bash
# Verificar se a URL está correta
# Deve ter formato: postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require
```

#### **Erro de PostgreSQL local**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Iniciar se necessário
sudo systemctl start postgresql
```

### **🎯 Resumo**

- **Banco**: Neon Database (PostgreSQL na nuvem)
- **ORM**: Drizzle ORM
- **Configuração**: Variável `DATABASE_URL` no `.env`
- **Migrações**: `npm run db:push`
- **Porta**: 5000 (servidor + frontend)

A conexão está configurada para funcionar automaticamente com Neon Database, que é gratuito e fácil de configurar! 🚀

## Recent Changes: Latest modifications with dates

### 2025-07-20 - PWA (Progressive Web App) Configurado ✅ INSTALADO COM SUCESSO
✓ **Aplicativo instalável no celular - FUNCIONANDO**
- Manifest.json configurado com ícones e metadados
- Service Worker registrado para funcionamento offline
- Componente InstallPWA que aparece automaticamente
- Usuário instalou o app na tela inicial com sucesso
- App funciona como aplicativo nativo, não no navegador
- Usuária confirmou que conseguiu instalar e está funcionando

✓ **Configurações mobile otimizadas**
- Meta tags para iOS e Android
- Prevenção de zoom em campos de input
- Orientação portrait otimizada
- Tema rosa/roxo (#ec4899) consistente

✓ **Migração Replit Agent → Replit concluída**
- PostgreSQL database configurado e funcionando
- Todas as dependências instaladas corretamente
- Servidor Express rodando na porta 5000
- App totalmente funcional no ambiente Replit

✓ **Logo personalizada adicionada**
- Nova logo da mãe com bebê implementada
- Imagem adicionada na página de login
- Logo no header principal de todas as páginas
- Ícone do app atualizado para PWA
- Logo agora aparece redonda usando object-cover
- Removida do desenvolvimento semanal mantendo ícone original

✓ **Formulário de cadastro otimizado**
- Campo de email adicionado com preenchimento automático
- Nome e sobrenome consolidados em "Nome Completo"
- Telefone tornou-se campo opcional
- Melhor espaçamento entre steps de progresso
- Preenchimento automático dos dados do usuário logado

### 2025-07-19 - Sistema Completo de Diário e Consultas Implementado
✓ **Diário da gestante com campos personalizados**
- Campo de data/hora personalizada (não mais automático)
- Campo de relato/conteúdo para registrar momentos importantes
- Sistema de humor/mood com emojis visuais
- Upload de imagens nas entradas
- CRUD completo: criar, editar, excluir, buscar
- Tudo salvo no PostgreSQL com sucesso

✓ **Sistema de consultas médicas com calendário**
- Agendamento de consultas com data, hora, tipo
- Campos: médico, local, observações
- Card "Próxima consulta" na página inicial
- Status de consulta realizada/pendente
- CRUD completo para gerenciar consultas
- Tipos: pré-natal, ultrassom, exames, obstetra, etc.

✓ **Navegação e UX aprimoradas**
- Botões coloridos na página inicial para acessar diário e consultas
- Botão de voltar (seta) em todas as páginas secundárias
- Sistema de roteamento funcionando (/diary, /appointments)
- Interface responsiva e moderna

✓ **Banco de dados PostgreSQL funcionando perfeitamente**
- Usuário: Linka Sofia Lunkes cadastrada
- Gravidez: 17 semanas, dados completos
- Primeira entrada do diário salva com sucesso
- Todas as tabelas criadas e funcionais

✓ **Preparação para publicação móvel**
- Código pronto para conversão React Native
- PWA possível para instalação móvel
- Autenticação Replit funcionando
- Todas funcionalidades testadas e validadas