class PregnancyWeekModel {
  final int week;
  final String title;
  final String fruitComparison;
  final String fruitImage;
  final String fetusImage;
  final double weightGrams;
  final double lengthCm;
  final String description;
  final List<String> tips;
  final List<String> symptoms;
  final String motherChanges;

  PregnancyWeekModel({
    required this.week,
    required this.title,
    required this.fruitComparison,
    required this.fruitImage,
    required this.fetusImage,
    required this.weightGrams,
    required this.lengthCm,
    required this.description,
    required this.tips,
    required this.symptoms,
    required this.motherChanges,
  });

  /// Formata o peso para exibição
  String get formattedWeight {
    if (weightGrams < 1000) {
      return '${weightGrams.toStringAsFixed(0)}g';
    } else {
      return '${(weightGrams / 1000).toStringAsFixed(2)}kg';
    }
  }

  /// Formata o comprimento para exibição
  String get formattedLength {
    return '${lengthCm.toStringAsFixed(1)}cm';
  }

  /// Converte para Map
  Map<String, dynamic> toMap() {
    return {
      'week': week,
      'title': title,
      'fruit_comparison': fruitComparison,
      'fruit_image': fruitImage,
      'fetus_image': fetusImage,
      'weight_grams': weightGrams,
      'length_cm': lengthCm,
      'description': description,
      'tips': tips.join('|'),
      'symptoms': symptoms.join('|'),
      'mother_changes': motherChanges,
    };
  }

  /// Cria instância a partir de Map
  factory PregnancyWeekModel.fromMap(Map<String, dynamic> map) {
    return PregnancyWeekModel(
      week: map['week'],
      title: map['title'],
      fruitComparison: map['fruit_comparison'],
      fruitImage: map['fruit_image'],
      fetusImage: map['fetus_image'],
      weightGrams: map['weight_grams'].toDouble(),
      lengthCm: map['length_cm'].toDouble(),
      description: map['description'],
      tips: map['tips'].toString().split('|'),
      symptoms: map['symptoms'].toString().split('|'),
      motherChanges: map['mother_changes'],
    );
  }
}