class UserModel {
  final int? id;
  final String name;
  final String? email;
  final String? phone;
  final DateTime? birthDate;
  final DateTime? lastMenstrualPeriod; // DUM
  final DateTime? expectedDeliveryDate; // DPP
  final DateTime createdAt;
  final DateTime updatedAt;

  UserModel({
    this.id,
    required this.name,
    this.email,
    this.phone,
    this.birthDate,
    this.lastMenstrualPeriod,
    this.expectedDeliveryDate,
    required this.createdAt,
    required this.updatedAt,
  });

  /// Calcula a semana gestacional atual baseada na DUM ou DPP
  int getCurrentWeek() {
    DateTime referenceDate;
    
    if (lastMenstrualPeriod != null) {
      referenceDate = lastMenstrualPeriod!;
    } else if (expectedDeliveryDate != null) {
      // Se apenas DPP foi fornecida, calcula DUM subtraindo 280 dias (40 semanas)
      referenceDate = expectedDeliveryDate!.subtract(const Duration(days: 280));
    } else {
      return 0;
    }

    final now = DateTime.now();
    final difference = now.difference(referenceDate).inDays;
    final weeks = (difference / 7).floor() + 1;
    
    return weeks > 0 && weeks <= 42 ? weeks : 0;
  }

  /// Calcula a data prevista do parto baseada na DUM
  DateTime? getExpectedDeliveryDate() {
    if (expectedDeliveryDate != null) {
      return expectedDeliveryDate;
    } else if (lastMenstrualPeriod != null) {
      return lastMenstrualPeriod!.add(const Duration(days: 280));
    }
    return null;
  }

  /// Converte o modelo para Map para armazenamento no banco
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'birth_date': birthDate?.millisecondsSinceEpoch,
      'last_menstrual_period': lastMenstrualPeriod?.millisecondsSinceEpoch,
      'expected_delivery_date': expectedDeliveryDate?.millisecondsSinceEpoch,
      'created_at': createdAt.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

  /// Cria uma instância do modelo a partir de um Map do banco
  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      id: map['id'],
      name: map['name'],
      email: map['email'],
      phone: map['phone'],
      birthDate: map['birth_date'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['birth_date'])
          : null,
      lastMenstrualPeriod: map['last_menstrual_period'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['last_menstrual_period'])
          : null,
      expectedDeliveryDate: map['expected_delivery_date'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['expected_delivery_date'])
          : null,
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(map['updated_at']),
    );
  }

  /// Cria uma cópia do modelo com campos atualizados
  UserModel copyWith({
    int? id,
    String? name,
    String? email,
    String? phone,
    DateTime? birthDate,
    DateTime? lastMenstrualPeriod,
    DateTime? expectedDeliveryDate,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      birthDate: birthDate ?? this.birthDate,
      lastMenstrualPeriod: lastMenstrualPeriod ?? this.lastMenstrualPeriod,
      expectedDeliveryDate: expectedDeliveryDate ?? this.expectedDeliveryDate,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}