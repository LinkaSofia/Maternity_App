class DiaryEntryModel {
  final int? id;
  final DateTime date;
  final String? content;
  final List<String> symptoms;
  final double? weight;
  final int? moodRating; // 1-5
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  DiaryEntryModel({
    this.id,
    required this.date,
    this.content,
    this.symptoms = const [],
    this.weight,
    this.moodRating,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  /// Converte para Map para banco de dados
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'date': date.millisecondsSinceEpoch,
      'content': content,
      'symptoms': symptoms.join('|'),
      'weight': weight,
      'mood_rating': moodRating,
      'notes': notes,
      'created_at': createdAt.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

  /// Cria instância a partir de Map do banco
  factory DiaryEntryModel.fromMap(Map<String, dynamic> map) {
    return DiaryEntryModel(
      id: map['id'],
      date: DateTime.fromMillisecondsSinceEpoch(map['date']),
      content: map['content'],
      symptoms: map['symptoms'] != null && map['symptoms'].toString().isNotEmpty
          ? map['symptoms'].toString().split('|')
          : [],
      weight: map['weight']?.toDouble(),
      moodRating: map['mood_rating'],
      notes: map['notes'],
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(map['updated_at']),
    );
  }

  /// Cria cópia com campos atualizados
  DiaryEntryModel copyWith({
    int? id,
    DateTime? date,
    String? content,
    List<String>? symptoms,
    double? weight,
    int? moodRating,
    String? notes,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return DiaryEntryModel(
      id: id ?? this.id,
      date: date ?? this.date,
      content: content ?? this.content,
      symptoms: symptoms ?? this.symptoms,
      weight: weight ?? this.weight,
      moodRating: moodRating ?? this.moodRating,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}