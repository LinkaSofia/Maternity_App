import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/user_model.dart';
import '../models/diary_entry_model.dart';
import '../models/contraction_model.dart';
import '../models/pregnancy_week_model.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  static Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'maternidade.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDatabase,
    );
  }

  Future<void> _createDatabase(Database db, int version) async {
    // Tabela de usuárias
    await db.execute('''
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        birth_date INTEGER,
        last_menstrual_period INTEGER,
        expected_delivery_date INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    ''');

    // Tabela de entradas do diário
    await db.execute('''
      CREATE TABLE diary_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date INTEGER NOT NULL,
        content TEXT,
        symptoms TEXT,
        weight REAL,
        mood_rating INTEGER,
        notes TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    ''');

    // Tabela de contrações
    await db.execute('''
      CREATE TABLE contractions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        duration_seconds INTEGER NOT NULL,
        intensity_level INTEGER,
        notes TEXT,
        created_at INTEGER NOT NULL
      )
    ''');

    // Tabela de semanas da gravidez (dados pré-populados)
    await db.execute('''
      CREATE TABLE pregnancy_weeks (
        week INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        fruit_comparison TEXT NOT NULL,
        fruit_image TEXT NOT NULL,
        fetus_image TEXT NOT NULL,
        weight_grams REAL NOT NULL,
        length_cm REAL NOT NULL,
        description TEXT NOT NULL,
        tips TEXT NOT NULL,
        symptoms TEXT NOT NULL,
        mother_changes TEXT NOT NULL
      )
    ''');

    // Inserir dados das semanas da gravidez
    await _insertPregnancyWeeksData(db);
  }

  // CRUD para Usuárias
  Future<int> insertUser(UserModel user) async {
    final db = await database;
    return await db.insert('users', user.toMap());
  }

  Future<UserModel?> getUser() async {
    final db = await database;
    final maps = await db.query('users', limit: 1);
    
    if (maps.isNotEmpty) {
      return UserModel.fromMap(maps.first);
    }
    return null;
  }

  Future<int> updateUser(UserModel user) async {
    final db = await database;
    return await db.update(
      'users',
      user.toMap(),
      where: 'id = ?',
      whereArgs: [user.id],
    );
  }

  // CRUD para Entradas do Diário
  Future<int> insertDiaryEntry(DiaryEntryModel entry) async {
    final db = await database;
    return await db.insert('diary_entries', entry.toMap());
  }

  Future<List<DiaryEntryModel>> getDiaryEntries({int? limit}) async {
    final db = await database;
    final maps = await db.query(
      'diary_entries',
      orderBy: 'date DESC',
      limit: limit,
    );
    
    return maps.map((map) => DiaryEntryModel.fromMap(map)).toList();
  }

  Future<DiaryEntryModel?> getDiaryEntryByDate(DateTime date) async {
    final db = await database;
    final startOfDay = DateTime(date.year, date.month, date.day);
    final endOfDay = startOfDay.add(const Duration(days: 1));
    
    final maps = await db.query(
      'diary_entries',
      where: 'date >= ? AND date < ?',
      whereArgs: [
        startOfDay.millisecondsSinceEpoch,
        endOfDay.millisecondsSinceEpoch,
      ],
    );
    
    if (maps.isNotEmpty) {
      return DiaryEntryModel.fromMap(maps.first);
    }
    return null;
  }

  Future<int> updateDiaryEntry(DiaryEntryModel entry) async {
    final db = await database;
    return await db.update(
      'diary_entries',
      entry.toMap(),
      where: 'id = ?',
      whereArgs: [entry.id],
    );
  }

  Future<int> deleteDiaryEntry(int id) async {
    final db = await database;
    return await db.delete(
      'diary_entries',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // CRUD para Contrações
  Future<int> insertContraction(ContractionModel contraction) async {
    final db = await database;
    return await db.insert('contractions', contraction.toMap());
  }

  Future<List<ContractionModel>> getContractions({int? limit}) async {
    final db = await database;
    final maps = await db.query(
      'contractions',
      orderBy: 'start_time DESC',
      limit: limit,
    );
    
    return maps.map((map) => ContractionModel.fromMap(map)).toList();
  }

  Future<List<ContractionModel>> getRecentContractions(Duration duration) async {
    final db = await database;
    final cutoff = DateTime.now().subtract(duration);
    
    final maps = await db.query(
      'contractions',
      where: 'start_time >= ?',
      whereArgs: [cutoff.millisecondsSinceEpoch],
      orderBy: 'start_time DESC',
    );
    
    return maps.map((map) => ContractionModel.fromMap(map)).toList();
  }

  Future<int> updateContraction(ContractionModel contraction) async {
    final db = await database;
    return await db.update(
      'contractions',
      contraction.toMap(),
      where: 'id = ?',
      whereArgs: [contraction.id],
    );
  }

  Future<int> deleteContraction(int id) async {
    final db = await database;
    return await db.delete(
      'contractions',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<int> deleteAllContractions() async {
    final db = await database;
    return await db.delete('contractions');
  }

  // Buscar informações de uma semana específica
  Future<PregnancyWeekModel?> getPregnancyWeek(int week) async {
    final db = await database;
    final maps = await db.query(
      'pregnancy_weeks',
      where: 'week = ?',
      whereArgs: [week],
    );
    
    if (maps.isNotEmpty) {
      return PregnancyWeekModel.fromMap(maps.first);
    }
    return null;
  }

  Future<List<PregnancyWeekModel>> getAllPregnancyWeeks() async {
    final db = await database;
    final maps = await db.query('pregnancy_weeks', orderBy: 'week');
    
    return maps.map((map) => PregnancyWeekModel.fromMap(map)).toList();
  }

  // Inserir dados pré-definidos das semanas da gravidez
  Future<void> _insertPregnancyWeeksData(Database db) async {
    final weeks = _getPregnancyWeeksData();
    
    for (final week in weeks) {
      await db.insert('pregnancy_weeks', week.toMap());
    }
  }

  // Dados das semanas da gravidez
  List<PregnancyWeekModel> _getPregnancyWeeksData() {
    return [
      PregnancyWeekModel(
        week: 1,
        title: 'Primeira Semana',
        fruitComparison: 'Semente de papoula',
        fruitImage: 'assets/fruits/poppy_seed.png',
        fetusImage: 'assets/fetus/week_1.png',
        weightGrams: 0.1,
        lengthCm: 0.1,
        description: 'Tecnicamente, você ainda não está grávida. Esta semana marca o início do seu ciclo menstrual.',
        tips: [
          'Comece a tomar ácido fólico',
          'Evite álcool e cigarro',
          'Mantenha uma dieta equilibrada'
        ],
        symptoms: ['Menstruação'],
        motherChanges: 'Seu corpo está se preparando para uma possível gravidez.',
      ),
      PregnancyWeekModel(
        week: 4,
        title: 'Quarta Semana - Implantação',
        fruitComparison: 'Semente de chia',
        fruitImage: 'assets/fruits/chia_seed.png',
        fetusImage: 'assets/fetus/week_4.png',
        weightGrams: 0.2,
        lengthCm: 0.2,
        description: 'O embrião agora tem o tamanho de uma semente de chia e está se implantando no útero.',
        tips: [
          'Continue tomando ácido fólico',
          'Evite exercícios muito intensos',
          'Mantenha-se hidratada'
        ],
        symptoms: ['Possível sangramento de implantação', 'Seios sensíveis'],
        motherChanges: 'Você pode começar a sentir os primeiros sintomas da gravidez.',
      ),
      PregnancyWeekModel(
        week: 8,
        title: 'Oitava Semana - Formação dos Órgãos',
        fruitComparison: 'Framboesa',
        fruitImage: 'assets/fruits/raspberry.png',
        fetusImage: 'assets/fetus/week_8.png',
        weightGrams: 1.5,
        lengthCm: 1.6,
        description: 'Seu bebê tem o tamanho de uma framboesa. Os órgãos principais estão se formando.',
        tips: [
          'Coma pequenas refeições frequentes',
          'Descanse bastante',
          'Evite odores fortes se estiver com náuseas'
        ],
        symptoms: ['Náuseas matinais', 'Fadiga', 'Aversões alimentares'],
        motherChanges: 'Seus seios podem estar maiores e mais sensíveis.',
      ),
      PregnancyWeekModel(
        week: 12,
        title: 'Décima Segunda Semana - Fim do Primeiro Trimestre',
        fruitComparison: 'Ameixa',
        fruitImage: 'assets/fruits/plum.png',
        fetusImage: 'assets/fetus/week_12.png',
        weightGrams: 14,
        lengthCm: 5.4,
        description: 'Seu bebê tem o tamanho de uma ameixa. O risco de aborto diminui significativamente.',
        tips: [
          'Pode ser hora de contar a novidade',
          'Continue com o pré-natal regular',
          'Comece a usar protetor solar'
        ],
        symptoms: ['Náuseas podem diminuir', 'Mais energia'],
        motherChanges: 'Você pode notar uma pequena barriga começando a aparecer.',
      ),
      PregnancyWeekModel(
        week: 16,
        title: 'Décima Sexta Semana - Segundo Trimestre',
        fruitComparison: 'Abacate',
        fruitImage: 'assets/fruits/avocado.png',
        fetusImage: 'assets/fetus/week_16.png',
        weightGrams: 100,
        lengthCm: 11.6,
        description: 'Seu bebê tem o tamanho de um abacate e você pode começar a sentir os primeiros movimentos.',
        tips: [
          'Comece exercícios leves para gestantes',
          'Use roupas mais confortáveis',
          'Hidrate bem a pele'
        ],
        symptoms: ['Mais energia', 'Possíveis primeiros movimentos'],
        motherChanges: 'Sua barriga está mais evidente e você se sente melhor.',
      ),
      PregnancyWeekModel(
        week: 20,
        title: 'Vigésima Semana - Metade da Gravidez',
        fruitComparison: 'Banana',
        fruitImage: 'assets/fruits/banana.png',
        fetusImage: 'assets/fetus/week_20.png',
        weightGrams: 300,
        lengthCm: 16.4,
        description: 'Seu bebê tem o tamanho de uma banana. É a metade da gravidez!',
        tips: [
          'Ultrassom morfológico importante',
          'Comece a pensar no enxoval',
          'Mantenha atividade física regular'
        ],
        symptoms: ['Movimentos do bebê mais evidentes', 'Possível azia'],
        motherChanges: 'Sua barriga está crescendo rapidamente.',
      ),
      PregnancyWeekModel(
        week: 24,
        title: 'Vigésima Quarta Semana - Viabilidade',
        fruitComparison: 'Milho',
        fruitImage: 'assets/fruits/corn.png',
        fetusImage: 'assets/fetus/week_24.png',
        weightGrams: 600,
        lengthCm: 21,
        description: 'Seu bebê tem o tamanho de um milho e agora tem chances de sobreviver fora do útero.',
        tips: [
          'Teste de diabetes gestacional',
          'Comece a pensar no parto',
          'Durma de lado'
        ],
        symptoms: ['Movimentos mais fortes', 'Possível falta de ar'],
        motherChanges: 'Você pode sentir contrações de treinamento (Braxton Hicks).',
      ),
      PregnancyWeekModel(
        week: 28,
        title: 'Vigésima Oitava Semana - Terceiro Trimestre',
        fruitComparison: 'Berinjela',
        fruitImage: 'assets/fruits/eggplant.png',
        fetusImage: 'assets/fetus/week_28.png',
        weightGrams: 1000,
        lengthCm: 25,
        description: 'Seu bebê tem o tamanho de uma berinjela. Bem-vinda ao terceiro trimestre!',
        tips: [
          'Pré-natal mais frequente',
          'Curso de gestantes',
          'Organize a casa para o bebê'
        ],
        symptoms: ['Falta de ar', 'Azia', 'Insônia'],
        motherChanges: 'Seus órgãos estão sendo comprimidos pelo bebê em crescimento.',
      ),
      PregnancyWeekModel(
        week: 32,
        title: 'Trigésima Segunda Semana - Crescimento Acelerado',
        fruitComparison: 'Coco',
        fruitImage: 'assets/fruits/coconut.png',
        fetusImage: 'assets/fetus/week_32.png',
        weightGrams: 1700,
        lengthCm: 28,
        description: 'Seu bebê tem o tamanho de um coco e está ganhando peso rapidamente.',
        tips: [
          'Prepare a mala da maternidade',
          'Descanse sempre que possível',
          'Monitore os movimentos do bebê'
        ],
        symptoms: ['Inchaço', 'Dor nas costas', 'Contrações de treinamento'],
        motherChanges: 'Você pode se sentir desconfortável e cansada.',
      ),
      PregnancyWeekModel(
        week: 36,
        title: 'Trigésima Sexta Semana - Quase Pronto',
        fruitComparison: 'Melão',
        fruitImage: 'assets/fruits/melon.png',
        fetusImage: 'assets/fetus/week_36.png',
        weightGrams: 2600,
        lengthCm: 32,
        description: 'Seu bebê tem o tamanho de um melão e está quase pronto para nascer.',
        tips: [
          'Finalize os preparativos',
          'Descanse bastante',
          'Monitore contrações'
        ],
        symptoms: ['Pressão pélvica', 'Contrações mais frequentes'],
        motherChanges: 'O bebê pode estar se encaixando na pelve.',
      ),
      PregnancyWeekModel(
        week: 40,
        title: 'Quarentena Semana - Hora do Nascimento',
        fruitComparison: 'Melancia pequena',
        fruitImage: 'assets/fruits/watermelon.png',
        fetusImage: 'assets/fetus/week_40.png',
        weightGrams: 3400,
        lengthCm: 36,
        description: 'Seu bebê está pronto para nascer! Tem o tamanho de uma melancia pequena.',
        tips: [
          'Esteja pronta para ir à maternidade',
          'Mantenha-se calma',
          'Monitore sinais de trabalho de parto'
        ],
        symptoms: ['Contrações regulares', 'Perda do tampão mucoso'],
        motherChanges: 'Você está pronta para conhecer seu bebê!',
      ),
    ];
  }
}