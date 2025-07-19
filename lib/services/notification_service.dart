import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:timezone/timezone.dart' as tz;

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notificationsPlugin =
      FlutterLocalNotificationsPlugin();

  Future<void> initialize() async {
    // Configurações para Android
    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    // Configurações para iOS
    const DarwinInitializationSettings iosSettings =
        DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings settings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _notificationsPlugin.initialize(
      settings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );

    await _requestPermissions();
  }

  Future<void> _requestPermissions() async {
    // Solicitar permissões
    await Permission.notification.request();
  }

  void _onNotificationTapped(NotificationResponse notificationResponse) {
    // Tratar quando o usuário toca na notificação
    print('Notificação tocada: ${notificationResponse.payload}');
  }

  /// Mostra uma notificação imediata
  Future<void> showNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
  }) async {
    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
      'maternidade_general',
      'Notificações Gerais',
      channelDescription: 'Notificações gerais do app de maternidade',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails();

    const NotificationDetails details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notificationsPlugin.show(
      id,
      title,
      body,
      details,
      payload: payload,
    );
  }

  /// Agenda uma notificação para uma data específica
  Future<void> scheduleNotification({
    required int id,
    required String title,
    required String body,
    required DateTime scheduledDate,
    String? payload,
  }) async {
    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
      'maternidade_scheduled',
      'Notificações Agendadas',
      channelDescription: 'Notificações agendadas do app de maternidade',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails();

    const NotificationDetails details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notificationsPlugin.zonedSchedule(
      id,
      title,
      body,
      tz.TZDateTime.from(scheduledDate, tz.local),
      details,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
      payload: payload,
    );
  }

  /// Agenda notificações semanais sobre a gravidez
  Future<void> scheduleWeeklyPregnancyNotifications(DateTime dueDate) async {
    // Calcular quantas semanas faltam
    final now = DateTime.now();
    final weeksLeft = dueDate.difference(now).inDays ~/ 7;

    for (int i = 1; i <= weeksLeft && i <= 42; i++) {
      final notificationDate = now.add(Duration(days: i * 7));
      final currentWeek = 40 - weeksLeft + i;

      await scheduleNotification(
        id: 1000 + i,
        title: 'Nova Semana Gestacional! 🤱',
        body: 'Você está entrando na semana $currentWeek da sua gravidez!',
        scheduledDate: notificationDate,
        payload: 'week_$currentWeek',
      );
    }
  }

  /// Notificação diária motivacional
  Future<void> scheduleDailyMotivationalNotifications() async {
    final messages = [
      'Você está fazendo um trabalho incrível! 💪',
      'Seu corpo é incrível! 🌟',
      'Cada dia você está mais perto do seu bebê! 👶',
      'Você é mais forte do que imagina! 💕',
      'Lembre-se de cuidar de você hoje! 🌸',
      'Seu bebê já te ama muito! ❤️',
      'Você vai ser uma mãe maravilhosa! 🤗',
    ];

    for (int i = 0; i < 7; i++) {
      final notificationDate = DateTime.now().add(Duration(days: i + 1));
      final adjustedDate = DateTime(
        notificationDate.year,
        notificationDate.month,
        notificationDate.day,
        9, // 9h da manhã
      );

      await scheduleNotification(
        id: 2000 + i,
        title: 'Mensagem do Dia 🌅',
        body: messages[i % messages.length],
        scheduledDate: adjustedDate,
        payload: 'daily_motivation',
      );
    }
  }

  /// Lembrete para registrar sintomas no diário
  Future<void> scheduleDiaryReminders() async {
    for (int i = 1; i <= 7; i++) {
      final notificationDate = DateTime.now().add(Duration(days: i));
      final reminderTime = DateTime(
        notificationDate.year,
        notificationDate.month,
        notificationDate.day,
        20, // 8h da noite
      );

      await scheduleNotification(
        id: 3000 + i,
        title: 'Hora do Diário 📝',
        body: 'Como você se sentiu hoje? Registre no seu diário!',
        scheduledDate: reminderTime,
        payload: 'diary_reminder',
      );
    }
  }

  /// Lembrete personalizado (consultas, exames, etc.)
  Future<void> scheduleCustomReminder({
    required int id,
    required String title,
    required String description,
    required DateTime dateTime,
  }) async {
    await scheduleNotification(
      id: 4000 + id,
      title: title,
      body: description,
      scheduledDate: dateTime,
      payload: 'custom_reminder_$id',
    );
  }

  /// Cancelar uma notificação específica
  Future<void> cancelNotification(int id) async {
    await _notificationsPlugin.cancel(id);
  }

  /// Cancelar todas as notificações
  Future<void> cancelAllNotifications() async {
    await _notificationsPlugin.cancelAll();
  }

  /// Listar notificações pendentes
  Future<List<PendingNotificationRequest>> getPendingNotifications() async {
    return await _notificationsPlugin.pendingNotificationRequests();
  }

  /// Notificação para início de contração
  Future<void> showContractionStartNotification() async {
    await showNotification(
      id: 5001,
      title: 'Contração Registrada ⏱️',
      body: 'Contração iniciada. Toque para ver o cronômetro.',
      payload: 'contraction_active',
    );
  }

  /// Notificação quando contrações indicam ida ao hospital
  Future<void> showHospitalAlertNotification() async {
    await showNotification(
      id: 5002,
      title: '🚨 HORA DE IR PARA A MATERNIDADE!',
      body: 'Suas contrações estão regulares. É hora de ir para o hospital!',
      payload: 'hospital_alert',
    );
  }

  /// Notificação de preparação para o parto (semana 36+)
  Future<void> scheduleDeliveryPreparationNotifications(int currentWeek) async {
    if (currentWeek >= 36) {
      final tasks = [
        'Verifique a mala da maternidade',
        'Confirme o caminho para o hospital',
        'Tenha os documentos sempre à mão',
        'Mantenha o celular sempre carregado',
        'Avise familiares sobre sinais de trabalho de parto',
      ];

      for (int i = 0; i < tasks.length; i++) {
        final notificationDate = DateTime.now().add(Duration(days: i + 1));
        await scheduleNotification(
          id: 6000 + i,
          title: 'Preparação para o Parto 🏥',
          body: tasks[i],
          scheduledDate: notificationDate,
          payload: 'delivery_prep',
        );
      }
    }
  }
}