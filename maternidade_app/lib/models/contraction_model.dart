class ContractionModel {
  final int? id;
  final DateTime startTime;
  final DateTime? endTime;
  final int durationSeconds;
  final int? intensityLevel; // 1-10
  final String? notes;
  final DateTime createdAt;

  ContractionModel({
    this.id,
    required this.startTime,
    this.endTime,
    required this.durationSeconds,
    this.intensityLevel,
    this.notes,
    required this.createdAt,
  });

  /// Duração formatada em minutos e segundos
  String get formattedDuration {
    final minutes = durationSeconds ~/ 60;
    final seconds = durationSeconds % 60;
    return '${minutes}m ${seconds}s';
  }

  /// Verifica se a contração está em andamento
  bool get isActive => endTime == null;

  /// Converte para Map
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'start_time': startTime.millisecondsSinceEpoch,
      'end_time': endTime?.millisecondsSinceEpoch,
      'duration_seconds': durationSeconds,
      'intensity_level': intensityLevel,
      'notes': notes,
      'created_at': createdAt.millisecondsSinceEpoch,
    };
  }

  /// Cria instância a partir de Map
  factory ContractionModel.fromMap(Map<String, dynamic> map) {
    return ContractionModel(
      id: map['id'],
      startTime: DateTime.fromMillisecondsSinceEpoch(map['start_time']),
      endTime: map['end_time'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['end_time'])
          : null,
      durationSeconds: map['duration_seconds'],
      intensityLevel: map['intensity_level'],
      notes: map['notes'],
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
    );
  }

  /// Cria cópia com campos atualizados
  ContractionModel copyWith({
    int? id,
    DateTime? startTime,
    DateTime? endTime,
    int? durationSeconds,
    int? intensityLevel,
    String? notes,
    DateTime? createdAt,
  }) {
    return ContractionModel(
      id: id ?? this.id,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      durationSeconds: durationSeconds ?? this.durationSeconds,
      intensityLevel: intensityLevel ?? this.intensityLevel,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}

/// Classe para análise das contrações
class ContractionAnalysis {
  final List<ContractionModel> contractions;
  
  ContractionAnalysis(this.contractions);

  /// Calcula o intervalo médio entre contrações em minutos
  double get averageInterval {
    if (contractions.length < 2) return 0;
    
    double totalInterval = 0;
    for (int i = 1; i < contractions.length; i++) {
      final interval = contractions[i].startTime
          .difference(contractions[i - 1].startTime)
          .inMinutes;
      totalInterval += interval;
    }
    
    return totalInterval / (contractions.length - 1);
  }

  /// Calcula a duração média das contrações em segundos
  double get averageDuration {
    if (contractions.isEmpty) return 0;
    
    final totalDuration = contractions
        .map((c) => c.durationSeconds)
        .reduce((a, b) => a + b);
    
    return totalDuration / contractions.length;
  }

  /// Verifica se está na hora de ir para o hospital
  /// Baseado na regra 5-1-1: contrações a cada 5 minutos, 
  /// durando 1 minuto, por 1 hora
  bool get shouldGoToHospital {
    if (contractions.length < 12) return false; // Menos de 1 hora de dados
    
    // Pega as últimas 12 contrações (1 hora se a cada 5 minutos)
    final recentContractions = contractions
        .where((c) => DateTime.now().difference(c.startTime).inHours <= 1)
        .toList();
    
    if (recentContractions.length < 10) return false;
    
    final analysis = ContractionAnalysis(recentContractions);
    
    // Intervalo médio menor que 6 minutos e duração maior que 45 segundos
    return analysis.averageInterval <= 6 && analysis.averageDuration >= 45;
  }

  /// Obtém recomendação baseada na análise
  String get recommendation {
    if (contractions.isEmpty) {
      return 'Registre suas contrações para acompanhamento.';
    }
    
    if (shouldGoToHospital) {
      return 'É hora de ir para a maternidade! Suas contrações estão regulares e frequentes.';
    }
    
    if (averageInterval <= 10 && averageInterval > 6) {
      return 'Contrações estão se tornando mais frequentes. Continue monitorando.';
    }
    
    if (averageInterval > 15) {
      return 'Contrações ainda irregulares. Continue registrando e descanse.';
    }
    
    return 'Continue monitorando suas contrações.';
  }
}