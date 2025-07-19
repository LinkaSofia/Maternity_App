import 'package:flutter/foundation.dart';
import 'dart:async';
import '../models/contraction_model.dart';
import '../services/database_service.dart';
import '../services/notification_service.dart';

class ContractionController extends ChangeNotifier {
  final DatabaseService _databaseService = DatabaseService();
  final NotificationService _notificationService = NotificationService();

  List<ContractionModel> _contractions = [];
  ContractionModel? _activeContraction;
  Timer? _timer;
  DateTime? _startTime;
  int _elapsedSeconds = 0;
  bool _isLoading = false;
  String? _error;

  // Getters
  List<ContractionModel> get contractions => _contractions;
  ContractionModel? get activeContraction => _activeContraction;
  bool get hasActiveContraction => _activeContraction != null;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get elapsedSeconds => _elapsedSeconds;
  
  /// Tempo formatado da contração ativa
  String get formattedTime {
    final minutes = _elapsedSeconds ~/ 60;
    final seconds = _elapsedSeconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  /// Carrega contrações do banco de dados
  Future<void> loadContractions() async {
    _setLoading(true);
    try {
      _contractions = await _databaseService.getContractions(limit: 50);
      _error = null;
    } catch (e) {
      _error = 'Erro ao carregar contrações: $e';
      debugPrint(_error);
    } finally {
      _setLoading(false);
    }
  }

  /// Inicia uma nova contração
  Future<void> startContraction() async {
    if (_activeContraction != null) {
      debugPrint('Já existe uma contração ativa');
      return;
    }

    _startTime = DateTime.now();
    _elapsedSeconds = 0;
    
    _activeContraction = ContractionModel(
      startTime: _startTime!,
      durationSeconds: 0,
      createdAt: _startTime!,
    );

    // Iniciar timer
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      _elapsedSeconds++;
      notifyListeners();
    });

    // Mostrar notificação
    await _notificationService.showContractionStartNotification();
    
    notifyListeners();
  }

  /// Para a contração atual
  Future<void> stopContraction({int? intensityLevel, String? notes}) async {
    if (_activeContraction == null || _startTime == null) {
      debugPrint('Nenhuma contração ativa para parar');
      return;
    }

    _timer?.cancel();
    final endTime = DateTime.now();
    final duration = endTime.difference(_startTime!).inSeconds;

    try {
      // Criar contração completa
      final completedContraction = _activeContraction!.copyWith(
        endTime: endTime,
        durationSeconds: duration,
        intensityLevel: intensityLevel,
        notes: notes,
      );

      // Salvar no banco de dados
      final id = await _databaseService.insertContraction(completedContraction);
      final savedContraction = completedContraction.copyWith(id: id);

      // Adicionar à lista
      _contractions.insert(0, savedContraction);

      // Limpar contração ativa
      _activeContraction = null;
      _startTime = null;
      _elapsedSeconds = 0;

      // Analisar contrações e verificar se deve ir ao hospital
      await _analyzeContractions();

      _error = null;
    } catch (e) {
      _error = 'Erro ao salvar contração: $e';
      debugPrint(_error);
    }

    notifyListeners();
  }

  /// Cancela a contração atual
  void cancelContraction() {
    _timer?.cancel();
    _activeContraction = null;
    _startTime = null;
    _elapsedSeconds = 0;
    notifyListeners();
  }

  /// Exclui uma contração
  Future<void> deleteContraction(int id) async {
    try {
      await _databaseService.deleteContraction(id);
      _contractions.removeWhere((c) => c.id == id);
      _error = null;
      notifyListeners();
    } catch (e) {
      _error = 'Erro ao excluir contração: $e';
      debugPrint(_error);
      notifyListeners();
    }
  }

  /// Limpa todas as contrações
  Future<void> clearAllContractions() async {
    try {
      await _databaseService.deleteAllContractions();
      _contractions.clear();
      _error = null;
      notifyListeners();
    } catch (e) {
      _error = 'Erro ao limpar contrações: $e';
      debugPrint(_error);
      notifyListeners();
    }
  }

  /// Analisa contrações recentes e verifica necessidade de ir ao hospital
  Future<void> _analyzeContractions() async {
    if (_contractions.length < 10) return;

    final recentContractions = await _databaseService.getRecentContractions(
      const Duration(hours: 2),
    );

    final analysis = ContractionAnalysis(recentContractions);
    
    if (analysis.shouldGoToHospital) {
      await _notificationService.showHospitalAlertNotification();
    }
  }

  /// Obtém análise das contrações
  ContractionAnalysis getAnalysis() {
    return ContractionAnalysis(_contractions);
  }

  /// Obtém contrações das últimas horas
  List<ContractionModel> getRecentContractions(int hours) {
    final cutoff = DateTime.now().subtract(Duration(hours: hours));
    return _contractions
        .where((c) => c.startTime.isAfter(cutoff))
        .toList();
  }

  /// Calcula estatísticas das contrações
  Map<String, dynamic> getStatistics() {
    if (_contractions.isEmpty) {
      return {
        'total': 0,
        'averageDuration': 0.0,
        'averageInterval': 0.0,
        'lastHour': 0,
        'recommendation': 'Registre suas contrações para acompanhamento.',
      };
    }

    final analysis = ContractionAnalysis(_contractions);
    final lastHour = getRecentContractions(1);

    return {
      'total': _contractions.length,
      'averageDuration': analysis.averageDuration,
      'averageInterval': analysis.averageInterval,
      'lastHour': lastHour.length,
      'recommendation': analysis.recommendation,
      'shouldGoToHospital': analysis.shouldGoToHospital,
    };
  }

  /// Obtém gráfico de frequência das contrações (últimas 6 horas)
  List<Map<String, dynamic>> getFrequencyChart() {
    final chart = <Map<String, dynamic>>[];
    final now = DateTime.now();

    for (int i = 5; i >= 0; i--) {
      final hourStart = now.subtract(Duration(hours: i + 1));
      final hourEnd = now.subtract(Duration(hours: i));
      
      final contractionsInHour = _contractions
          .where((c) => 
              c.startTime.isAfter(hourStart) && 
              c.startTime.isBefore(hourEnd))
          .length;

      chart.add({
        'hour': i == 0 ? 'Agora' : '${i}h atrás',
        'count': contractionsInHour,
        'time': hourEnd,
      });
    }

    return chart;
  }

  /// Obtém dados para gráfico de duração
  List<Map<String, dynamic>> getDurationChart() {
    return _contractions.take(10).map((c) => {
      'time': c.startTime,
      'duration': c.durationSeconds,
      'formattedTime': '${c.startTime.hour}:${c.startTime.minute.toString().padLeft(2, '0')}',
      'formattedDuration': c.formattedDuration,
    }).toList();
  }

  /// Verifica se há padrão nas contrações
  bool hasPattern() {
    if (_contractions.length < 5) return false;
    
    final analysis = ContractionAnalysis(_contractions);
    return analysis.averageInterval > 0 && analysis.averageInterval <= 15;
  }

  /// Obtém próxima contração estimada (se há padrão)
  DateTime? getNextContractionEstimate() {
    if (!hasPattern() || _contractions.isEmpty) return null;
    
    final analysis = ContractionAnalysis(_contractions);
    final lastContraction = _contractions.first;
    
    return lastContraction.startTime.add(
      Duration(minutes: analysis.averageInterval.round()),
    );
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

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  /// Formata duração em texto legível
  String formatDuration(int seconds) {
    final minutes = seconds ~/ 60;
    final secs = seconds % 60;
    if (minutes > 0) {
      return '${minutes}min ${secs}s';
    }
    return '${secs}s';
  }

  /// Formata intervalo em texto legível
  String formatInterval(double minutes) {
    if (minutes < 1) {
      return '${(minutes * 60).round()}s';
    }
    return '${minutes.toStringAsFixed(1)}min';
  }

  /// Obtém cor baseada na intensidade
  String getIntensityColor(int? intensity) {
    if (intensity == null) return '#9E9E9E';
    
    switch (intensity) {
      case 1:
      case 2:
        return '#4CAF50'; // Verde
      case 3:
      case 4:
        return '#FFC107'; // Amarelo
      case 5:
      case 6:
        return '#FF9800'; // Laranja
      case 7:
      case 8:
        return '#F44336'; // Vermelho
      case 9:
      case 10:
        return '#D32F2F'; // Vermelho escuro
      default:
        return '#9E9E9E';
    }
  }

  /// Obtém texto da intensidade
  String getIntensityText(int? intensity) {
    if (intensity == null) return 'Não informado';
    
    if (intensity <= 2) return 'Leve';
    if (intensity <= 4) return 'Moderada';
    if (intensity <= 6) return 'Forte';
    if (intensity <= 8) return 'Muito forte';
    return 'Intensa';
  }
}