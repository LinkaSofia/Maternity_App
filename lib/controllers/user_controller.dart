import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../services/database_service.dart';
import '../services/notification_service.dart';

class UserController extends ChangeNotifier {
  final DatabaseService _databaseService = DatabaseService();
  final NotificationService _notificationService = NotificationService();

  UserModel? _currentUser;
  bool _isLoading = false;
  String? _error;

  // Getters
  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasUser => _currentUser != null;

  /// Carrega dados do usuário do banco de dados
  Future<void> loadUser() async {
    _setLoading(true);
    try {
      _currentUser = await _databaseService.getUser();
      _error = null;
      
      // Se há usuário, configurar notificações baseadas na gravidez
      if (_currentUser != null) {
        await _setupPregnancyNotifications();
      }
    } catch (e) {
      _error = 'Erro ao carregar dados do usuário: $e';
      debugPrint(_error);
    } finally {
      _setLoading(false);
    }
  }

  /// Cria ou atualiza dados do usuário
  Future<bool> saveUser({
    required String name,
    String? email,
    String? phone,
    DateTime? birthDate,
    DateTime? lastMenstrualPeriod,
    DateTime? expectedDeliveryDate,
  }) async {
    _setLoading(true);
    _error = null;

    try {
      final now = DateTime.now();
      
      if (_currentUser == null) {
        // Criar novo usuário
        final newUser = UserModel(
          name: name,
          email: email,
          phone: phone,
          birthDate: birthDate,
          lastMenstrualPeriod: lastMenstrualPeriod,
          expectedDeliveryDate: expectedDeliveryDate,
          createdAt: now,
          updatedAt: now,
        );

        final id = await _databaseService.insertUser(newUser);
        _currentUser = newUser.copyWith(id: id);
      } else {
        // Atualizar usuário existente
        _currentUser = _currentUser!.copyWith(
          name: name,
          email: email,
          phone: phone,
          birthDate: birthDate,
          lastMenstrualPeriod: lastMenstrualPeriod,
          expectedDeliveryDate: expectedDeliveryDate,
          updatedAt: now,
        );

        await _databaseService.updateUser(_currentUser!);
      }

      // Configurar notificações após salvar
      await _setupPregnancyNotifications();
      
      return true;
    } catch (e) {
      _error = 'Erro ao salvar dados: $e';
      debugPrint(_error);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Obtém a semana gestacional atual
  int getCurrentWeek() {
    return _currentUser?.getCurrentWeek() ?? 0;
  }

  /// Obtém a data prevista do parto
  DateTime? getExpectedDeliveryDate() {
    return _currentUser?.getExpectedDeliveryDate();
  }

  /// Calcula quantos dias faltam para o parto
  int? getDaysUntilDelivery() {
    final dueDate = getExpectedDeliveryDate();
    if (dueDate == null) return null;
    
    final now = DateTime.now();
    final difference = dueDate.difference(now).inDays;
    return difference > 0 ? difference : 0;
  }

  /// Verifica se está no primeiro trimestre (até 12 semanas)
  bool get isFirstTrimester {
    final week = getCurrentWeek();
    return week > 0 && week <= 12;
  }

  /// Verifica se está no segundo trimestre (13-27 semanas)
  bool get isSecondTrimester {
    final week = getCurrentWeek();
    return week >= 13 && week <= 27;
  }

  /// Verifica se está no terceiro trimestre (28+ semanas)
  bool get isThirdTrimester {
    final week = getCurrentWeek();
    return week >= 28;
  }

  /// Verifica se está próximo do parto (36+ semanas)
  bool get isNearDelivery {
    final week = getCurrentWeek();
    return week >= 36;
  }

  /// Obtém o nome do trimestre atual
  String get currentTrimesterName {
    if (isFirstTrimester) return 'Primeiro Trimestre';
    if (isSecondTrimester) return 'Segundo Trimestre';
    if (isThirdTrimester) return 'Terceiro Trimestre';
    return 'Pré-gestação';
  }

  /// Calcula porcentagem da gravidez concluída
  double get pregnancyProgress {
    final week = getCurrentWeek();
    if (week <= 0) return 0.0;
    return (week / 40).clamp(0.0, 1.0);
  }

  /// Configura notificações baseadas na gravidez
  Future<void> _setupPregnancyNotifications() async {
    if (_currentUser == null) return;

    final dueDate = getExpectedDeliveryDate();
    if (dueDate == null) return;

    try {
      // Cancelar notificações anteriores
      await _notificationService.cancelAllNotifications();

      // Configurar notificações semanais
      await _notificationService.scheduleWeeklyPregnancyNotifications(dueDate);
      
      // Configurar mensagens motivacionais diárias
      await _notificationService.scheduleDailyMotivationalNotifications();
      
      // Configurar lembretes do diário
      await _notificationService.scheduleDiaryReminders();
      
      // Se próximo do parto, configurar notificações de preparação
      final currentWeek = getCurrentWeek();
      if (currentWeek >= 36) {
        await _notificationService.scheduleDeliveryPreparationNotifications(currentWeek);
      }
    } catch (e) {
      debugPrint('Erro ao configurar notificações: $e');
    }
  }

  /// Adiciona lembrete personalizado
  Future<bool> addCustomReminder({
    required String title,
    required String description,
    required DateTime dateTime,
  }) async {
    try {
      final id = DateTime.now().millisecondsSinceEpoch % 1000;
      await _notificationService.scheduleCustomReminder(
        id: id,
        title: title,
        description: description,
        dateTime: dateTime,
      );
      return true;
    } catch (e) {
      _error = 'Erro ao adicionar lembrete: $e';
      debugPrint(_error);
      notifyListeners();
      return false;
    }
  }

  /// Limpa erro atual
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Helper para definir estado de loading
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  /// Obtém informações resumidas do usuário para exibição
  Map<String, String> getUserSummary() {
    if (_currentUser == null) return {};

    final summary = <String, String>{
      'Nome': _currentUser!.name,
    };

    if (_currentUser!.email != null && _currentUser!.email!.isNotEmpty) {
      summary['Email'] = _currentUser!.email!;
    }

    if (_currentUser!.phone != null && _currentUser!.phone!.isNotEmpty) {
      summary['Telefone'] = _currentUser!.phone!;
    }

    final currentWeek = getCurrentWeek();
    if (currentWeek > 0) {
      summary['Semana Gestacional'] = '${currentWeek}ª semana';
    }

    final dueDate = getExpectedDeliveryDate();
    if (dueDate != null) {
      summary['Data Prevista'] = '${dueDate.day}/${dueDate.month}/${dueDate.year}';
    }

    final daysLeft = getDaysUntilDelivery();
    if (daysLeft != null) {
      summary['Dias Restantes'] = '$daysLeft dias';
    }

    return summary;
  }
}