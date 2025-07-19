import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../controllers/user_controller.dart';
import 'home_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _pageController = PageController();
  
  // Controllers dos campos
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  
  // Datas
  DateTime? _birthDate;
  DateTime? _lastMenstrualPeriod;
  DateTime? _expectedDeliveryDate;
  
  // Controle de páginas
  int _currentPage = 0;
  bool _useLastMenstrualPeriod = true; // true para DUM, false para DPP

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < 2) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _previousPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _selectDate(BuildContext context, String type) async {
    final initialDate = DateTime.now();
    final firstDate = DateTime(1950);
    final lastDate = type == 'birth' 
        ? DateTime.now() 
        : DateTime.now().add(const Duration(days: 365));

    final pickedDate = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: firstDate,
      lastDate: lastDate,
      locale: const Locale('pt', 'BR'),
    );

    if (pickedDate != null) {
      setState(() {
        switch (type) {
          case 'birth':
            _birthDate = pickedDate;
            break;
          case 'lmp':
            _lastMenstrualPeriod = pickedDate;
            break;
          case 'edd':
            _expectedDeliveryDate = pickedDate;
            break;
        }
      });
    }
  }

  Future<void> _finishOnboarding() async {
    if (!_formKey.currentState!.validate()) return;

    final userController = Provider.of<UserController>(context, listen: false);
    
    final success = await userController.saveUser(
      name: _nameController.text.trim(),
      email: _emailController.text.trim().isEmpty ? null : _emailController.text.trim(),
      phone: _phoneController.text.trim().isEmpty ? null : _phoneController.text.trim(),
      birthDate: _birthDate,
      lastMenstrualPeriod: _useLastMenstrualPeriod ? _lastMenstrualPeriod : null,
      expectedDeliveryDate: _useLastMenstrualPeriod ? null : _expectedDeliveryDate,
    );

    if (success && mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(userController.error ?? 'Erro ao salvar dados'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: SafeArea(
        child: Column(
          children: [
            // Progress indicator
            Container(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  for (int i = 0; i < 3; i++)
                    Expanded(
                      child: Container(
                        height: 4,
                        margin: EdgeInsets.only(left: i > 0 ? 8 : 0),
                        decoration: BoxDecoration(
                          color: i <= _currentPage
                              ? Theme.of(context).colorScheme.primary
                              : Theme.of(context).colorScheme.primary.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                ],
              ),
            ),

            // Content
            Expanded(
              child: PageView(
                controller: _pageController,
                onPageChanged: (page) {
                  setState(() {
                    _currentPage = page;
                  });
                },
                children: [
                  _buildWelcomePage(),
                  _buildPersonalInfoPage(),
                  _buildPregnancyInfoPage(),
                ],
              ),
            ),

            // Navigation buttons
            Container(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  if (_currentPage > 0)
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _previousPage,
                        child: const Text('Voltar'),
                      ),
                    ),
                  if (_currentPage > 0) const SizedBox(width: 16),
                  Expanded(
                    child: Consumer<UserController>(
                      builder: (context, userController, _) {
                        return ElevatedButton(
                          onPressed: userController.isLoading
                              ? null
                              : _currentPage == 2
                                  ? _finishOnboarding
                                  : _nextPage,
                          child: userController.isLoading
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                )
                              : Text(_currentPage == 2 ? 'Finalizar' : 'Continuar'),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomePage() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.favorite,
              size: 50,
              color: Color(0xFF5D2E45),
            ),
          ),
          const SizedBox(height: 32),
          Text(
            'Bem-vinda!',
            style: Theme.of(context).textTheme.displayMedium,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Text(
            'Vamos acompanhar juntas sua jornada na maternidade. Este app foi feito especialmente para cuidar de você e do seu bebê.',
            style: Theme.of(context).textTheme.bodyLarge,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _buildFeatureItem(Icons.timeline, 'Acompanhamento semanal'),
                  _buildFeatureItem(Icons.book, 'Diário pessoal'),
                  _buildFeatureItem(Icons.timer, 'Cronômetro de contrações'),
                  _buildFeatureItem(Icons.notifications, 'Lembretes importantes'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(
            icon,
            color: Theme.of(context).colorScheme.primary,
            size: 24,
          ),
          const SizedBox(width: 16),
          Text(
            text,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }

  Widget _buildPersonalInfoPage() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Vamos nos conhecer',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'Conte-nos um pouco sobre você',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Theme.of(context).colorScheme.onBackground.withOpacity(0.7),
              ),
            ),
            const SizedBox(height: 32),
            
            // Nome (obrigatório)
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Nome *',
                hintText: 'Como você gostaria de ser chamada?',
                prefixIcon: Icon(Icons.person),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Por favor, digite seu nome';
                }
                return null;
              },
              textCapitalization: TextCapitalization.words,
            ),
            
            const SizedBox(height: 16),
            
            // Email (opcional)
            TextFormField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Email (opcional)',
                hintText: 'seuemail@exemplo.com',
                prefixIcon: Icon(Icons.email),
              ),
              keyboardType: TextInputType.emailAddress,
              validator: (value) {
                if (value != null && value.trim().isNotEmpty) {
                  if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                    return 'Digite um email válido';
                  }
                }
                return null;
              },
            ),
            
            const SizedBox(height: 16),
            
            // Telefone (opcional)
            TextFormField(
              controller: _phoneController,
              decoration: const InputDecoration(
                labelText: 'Telefone (opcional)',
                hintText: '(11) 99999-9999',
                prefixIcon: Icon(Icons.phone),
              ),
              keyboardType: TextInputType.phone,
            ),
            
            const SizedBox(height: 16),
            
            // Data de nascimento (opcional)
            InkWell(
              onTap: () => _selectDate(context, 'birth'),
              child: InputDecorator(
                decoration: const InputDecoration(
                  labelText: 'Data de nascimento (opcional)',
                  prefixIcon: Icon(Icons.cake),
                  suffixIcon: Icon(Icons.calendar_today),
                ),
                child: Text(
                  _birthDate != null
                      ? DateFormat('dd/MM/yyyy').format(_birthDate!)
                      : 'Selecione sua data de nascimento',
                  style: _birthDate != null
                      ? null
                      : TextStyle(
                          color: Theme.of(context).hintColor,
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPregnancyInfoPage() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Sobre sua gravidez',
            style: Theme.of(context).textTheme.headlineLarge,
          ),
          const SizedBox(height: 8),
          Text(
            'Para calcularmos sua semana gestacional',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: Theme.of(context).colorScheme.onBackground.withOpacity(0.7),
            ),
          ),
          const SizedBox(height: 32),
          
          // Escolha entre DUM ou DPP
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Escolha uma opção:',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 16),
                  
                  RadioListTile<bool>(
                    title: const Text('Data da última menstruação (DUM)'),
                    subtitle: const Text('Data do primeiro dia da sua última menstruação'),
                    value: true,
                    groupValue: _useLastMenstrualPeriod,
                    onChanged: (value) {
                      setState(() {
                        _useLastMenstrualPeriod = value!;
                        _expectedDeliveryDate = null;
                      });
                    },
                  ),
                  
                  RadioListTile<bool>(
                    title: const Text('Data prevista do parto (DPP)'),
                    subtitle: const Text('Data estimada pelo médico'),
                    value: false,
                    groupValue: _useLastMenstrualPeriod,
                    onChanged: (value) {
                      setState(() {
                        _useLastMenstrualPeriod = value!;
                        _lastMenstrualPeriod = null;
                      });
                    },
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Campo de data baseado na escolha
          if (_useLastMenstrualPeriod)
            InkWell(
              onTap: () => _selectDate(context, 'lmp'),
              child: InputDecorator(
                decoration: const InputDecoration(
                  labelText: 'Data da última menstruação *',
                  prefixIcon: Icon(Icons.calendar_month),
                  suffixIcon: Icon(Icons.calendar_today),
                ),
                child: Text(
                  _lastMenstrualPeriod != null
                      ? DateFormat('dd/MM/yyyy').format(_lastMenstrualPeriod!)
                      : 'Selecione a data',
                  style: _lastMenstrualPeriod != null
                      ? null
                      : TextStyle(color: Theme.of(context).hintColor),
                ),
              ),
            )
          else
            InkWell(
              onTap: () => _selectDate(context, 'edd'),
              child: InputDecorator(
                decoration: const InputDecoration(
                  labelText: 'Data prevista do parto *',
                  prefixIcon: Icon(Icons.child_care),
                  suffixIcon: Icon(Icons.calendar_today),
                ),
                child: Text(
                  _expectedDeliveryDate != null
                      ? DateFormat('dd/MM/yyyy').format(_expectedDeliveryDate!)
                      : 'Selecione a data',
                  style: _expectedDeliveryDate != null
                      ? null
                      : TextStyle(color: Theme.of(context).hintColor),
                ),
              ),
            ),
          
          const SizedBox(height: 24),
          
          // Informação adicional
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.info_outline,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Essas informações nos ajudam a calcular sua semana gestacional e personalizar o conteúdo para você.',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}