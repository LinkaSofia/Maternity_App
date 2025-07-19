import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../controllers/user_controller.dart';
import '../services/database_service.dart';
import '../models/pregnancy_week_model.dart';
import 'week_details_screen.dart';
import 'contractions_screen.dart';
import 'diary_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  PregnancyWeekModel? _currentWeekData;
  bool _isLoadingWeekData = false;

  @override
  void initState() {
    super.initState();
    _loadCurrentWeekData();
  }

  Future<void> _loadCurrentWeekData() async {
    setState(() {
      _isLoadingWeekData = true;
    });

    final userController = Provider.of<UserController>(context, listen: false);
    final currentWeek = userController.getCurrentWeek();

    if (currentWeek > 0) {
      try {
        final weekData = await DatabaseService().getPregnancyWeek(currentWeek);
        setState(() {
          _currentWeekData = weekData;
        });
      } catch (e) {
        debugPrint('Erro ao carregar dados da semana: $e');
      }
    }

    setState(() {
      _isLoadingWeekData = false;
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = [
      _buildHomePage(),
      const DiaryScreen(),
      const ContractionsScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Início',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.book),
            label: 'Diário',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.timer),
            label: 'Contrações',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }

  Widget _buildHomePage() {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: RefreshIndicator(
        onRefresh: _loadCurrentWeekData,
        child: Consumer<UserController>(
          builder: (context, userController, _) {
            if (userController.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            final currentWeek = userController.getCurrentWeek();
            final daysUntilDelivery = userController.getDaysUntilDelivery();

            return CustomScrollView(
              slivers: [
                // App Bar com saudação
                SliverAppBar(
                  expandedHeight: 120,
                  floating: false,
                  pinned: true,
                  flexibleSpace: FlexibleSpaceBar(
                    title: Text(
                      'Olá, ${userController.currentUser?.name ?? 'Mamãe'}!',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    background: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Theme.of(context).colorScheme.primary,
                            Theme.of(context).colorScheme.secondary,
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

                // Conteúdo principal
                SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      // Card principal da semana
                      if (currentWeek > 0) ...[
                        _buildCurrentWeekCard(currentWeek, daysUntilDelivery),
                        const SizedBox(height: 20),
                      ],

                      // Progress da gravidez
                      if (currentWeek > 0) ...[
                        _buildProgressCard(userController),
                        const SizedBox(height: 20),
                      ],

                      // Ações rápidas
                      _buildQuickActions(),
                      const SizedBox(height: 20),

                      // Frases motivacionais
                      _buildMotivationalCard(),
                      const SizedBox(height: 20),

                      // Dicas da semana
                      if (_currentWeekData != null) ...[
                        _buildWeekTipsCard(),
                        const SizedBox(height: 20),
                      ],

                      // Estatísticas rápidas
                      _buildStatsCards(userController),
                    ]),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildCurrentWeekCard(int currentWeek, int? daysUntilDelivery) {
    return Card(
      elevation: 8,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Theme.of(context).colorScheme.primary.withOpacity(0.1),
              Theme.of(context).colorScheme.secondary.withOpacity(0.1),
            ],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Semana $currentWeek',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primary,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      '${currentWeek}ª',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 16),
              
              if (_currentWeekData != null) ...[
                Row(
                  children: [
                    // Imagem da fruta (placeholder)
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.secondary.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: const Icon(
                        Icons.apple,
                        size: 30,
                        color: Color(0xFF5D2E45),
                      ),
                    ),
                    
                    const SizedBox(width: 16),
                    
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Seu bebê tem o tamanho de',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                          Text(
                            _currentWeekData!.fruitComparison,
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.w600,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                          ),
                          Text(
                            '${_currentWeekData!.formattedWeight} • ${_currentWeekData!.formattedLength}',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 16),
                
                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => WeekDetailsScreen(
                          week: currentWeek,
                          weekData: _currentWeekData!,
                        ),
                      ),
                    );
                  },
                  icon: const Icon(Icons.visibility),
                  label: const Text('Ver detalhes da semana'),
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 44),
                  ),
                ),
              ] else if (_isLoadingWeekData) ...[
                const Center(child: CircularProgressIndicator()),
              ] else ...[
                Text(
                  'Carregando informações da semana...',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
              
              if (daysUntilDelivery != null) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.secondary.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.event,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '$daysUntilDelivery dias para conhecer seu bebê! 💕',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProgressCard(UserController userController) {
    final progress = userController.pregnancyProgress;
    final currentWeek = userController.getCurrentWeek();
    
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Progresso da Gravidez',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                Text(
                  '${(progress * 100).toInt()}%',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Theme.of(context).colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 12),
            
            LinearProgressIndicator(
              value: progress,
              backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.2),
              minHeight: 8,
            ),
            
            const SizedBox(height: 8),
            
            Text(
              userController.currentTrimesterName,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Ações Rápidas',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildActionButton(
                    icon: FontAwesomeIcons.bookOpen,
                    label: 'Diário',
                    onTap: () => _onItemTapped(1),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionButton(
                    icon: FontAwesomeIcons.clock,
                    label: 'Contrações',
                    onTap: () => _onItemTapped(2),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionButton(
                    icon: FontAwesomeIcons.user,
                    label: 'Perfil',
                    onTap: () => _onItemTapped(3),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            FaIcon(
              icon,
              color: Theme.of(context).colorScheme.primary,
              size: 24,
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMotivationalCard() {
    final messages = [
      'Você está fazendo um trabalho incrível! 💪',
      'Seu corpo é incrível! 🌟',
      'Cada dia você está mais perto do seu bebê! 👶',
      'Você é mais forte do que imagina! 💕',
      'Lembre-se de cuidar de você hoje! 🌸',
    ];
    
    final randomMessage = messages[DateTime.now().day % messages.length];
    
    return Card(
      color: Theme.of(context).colorScheme.secondary.withOpacity(0.1),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.secondary,
                borderRadius: BorderRadius.circular(24),
              ),
              child: const Icon(
                Icons.favorite,
                color: Colors.white,
                size: 20,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Mensagem do Dia',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      color: Theme.of(context).colorScheme.secondary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    randomMessage,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWeekTipsCard() {
    if (_currentWeekData == null) return const SizedBox.shrink();
    
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Dicas da Semana',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 12),
            ..._currentWeekData!.tips.take(2).map((tip) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.lightbulb_outline,
                    size: 16,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      tip,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ),
                ],
              ),
            )),
            if (_currentWeekData!.tips.length > 2)
              TextButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => WeekDetailsScreen(
                        week: Provider.of<UserController>(context, listen: false).getCurrentWeek(),
                        weekData: _currentWeekData!,
                      ),
                    ),
                  );
                },
                child: const Text('Ver todas as dicas'),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsCards(UserController userController) {
    return Row(
      children: [
        Expanded(
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Icon(
                    Icons.timeline,
                    color: Theme.of(context).colorScheme.primary,
                    size: 32,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${userController.getCurrentWeek()}',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  Text(
                    'Semanas',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Icon(
                    Icons.calendar_today,
                    color: Theme.of(context).colorScheme.secondary,
                    size: 32,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${userController.getDaysUntilDelivery() ?? 0}',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.secondary,
                    ),
                  ),
                  Text(
                    'Dias restantes',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}