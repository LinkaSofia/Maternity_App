import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'controllers/user_controller.dart';
import 'controllers/contraction_controller.dart';
import 'services/notification_service.dart';
import 'screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Inicializar serviços
  await NotificationService().initialize();
  
  runApp(const MaternidadeApp());
}

class MaternidadeApp extends StatelessWidget {
  const MaternidadeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserController()),
        ChangeNotifierProvider(create: (_) => ContractionController()),
      ],
      child: MaterialApp(
        title: 'Maternidade',
        debugShowCheckedModeBanner: false,
        theme: _buildTheme(),
        home: const SplashScreen(),
      ),
    );
  }

  ThemeData _buildTheme() {
    const primaryColor = Color(0xFFE8B4CB); // Rosa bebê
    const secondaryColor = Color(0xFFDDA0DD); // Lilás
    const backgroundColor = Color(0xFFFFF8F8); // Branco rosado
    const surfaceColor = Color(0xFFFFFFFF); // Branco
    const onPrimaryColor = Color(0xFF5D2E45); // Marrom rosado
    
    return ThemeData(
      useMaterial3: true,
      primarySwatch: Colors.pink,
      
      // Esquema de cores personalizado
      colorScheme: const ColorScheme.light(
        primary: primaryColor,
        secondary: secondaryColor,
        surface: surfaceColor,
        background: backgroundColor,
        onPrimary: onPrimaryColor,
        onSecondary: onPrimaryColor,
        onSurface: Color(0xFF2D2D2D),
        onBackground: Color(0xFF2D2D2D),
      ),

      // Fonte Lexend conforme solicitado
      textTheme: GoogleFonts.lexendTextTheme().copyWith(
        displayLarge: GoogleFonts.lexend(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: onPrimaryColor,
        ),
        displayMedium: GoogleFonts.lexend(
          fontSize: 28,
          fontWeight: FontWeight.w600,
          color: onPrimaryColor,
        ),
        headlineLarge: GoogleFonts.lexend(
          fontSize: 24,
          fontWeight: FontWeight.w600,
          color: onPrimaryColor,
        ),
        headlineMedium: GoogleFonts.lexend(
          fontSize: 20,
          fontWeight: FontWeight.w500,
          color: onPrimaryColor,
        ),
        titleLarge: GoogleFonts.lexend(
          fontSize: 18,
          fontWeight: FontWeight.w500,
          color: onPrimaryColor,
        ),
        titleMedium: GoogleFonts.lexend(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: onPrimaryColor,
        ),
        bodyLarge: GoogleFonts.lexend(
          fontSize: 16,
          fontWeight: FontWeight.normal,
          color: const Color(0xFF2D2D2D),
        ),
        bodyMedium: GoogleFonts.lexend(
          fontSize: 14,
          fontWeight: FontWeight.normal,
          color: const Color(0xFF2D2D2D),
        ),
        bodySmall: GoogleFonts.lexend(
          fontSize: 12,
          fontWeight: FontWeight.normal,
          color: const Color(0xFF666666),
        ),
      ),

      // AppBar personalizada
      appBarTheme: AppBarTheme(
        backgroundColor: primaryColor,
        foregroundColor: onPrimaryColor,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.lexend(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: onPrimaryColor,
        ),
      ),

      // Botões personalizados
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: onPrimaryColor,
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.lexend(
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),

      // Cards personalizados
      cardTheme: CardTheme(
        elevation: 4,
        shadowColor: primaryColor.withOpacity(0.2),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        color: surfaceColor,
      ),

      // Input decoration
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceColor,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: primaryColor.withOpacity(0.5)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: primaryColor.withOpacity(0.5)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primaryColor, width: 2),
        ),
        labelStyle: GoogleFonts.lexend(
          color: onPrimaryColor.withOpacity(0.7),
          fontSize: 14,
        ),
        hintStyle: GoogleFonts.lexend(
          color: onPrimaryColor.withOpacity(0.5),
          fontSize: 14,
        ),
      ),

      // Bottom navigation
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: surfaceColor,
        selectedItemColor: primaryColor,
        unselectedItemColor: onPrimaryColor.withOpacity(0.5),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        selectedLabelStyle: GoogleFonts.lexend(
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
        unselectedLabelStyle: GoogleFonts.lexend(
          fontSize: 12,
          fontWeight: FontWeight.normal,
        ),
      ),

      // Floating Action Button
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: secondaryColor,
        foregroundColor: onPrimaryColor,
        elevation: 6,
      ),

      // Chips
      chipTheme: ChipThemeData(
        backgroundColor: primaryColor.withOpacity(0.1),
        selectedColor: primaryColor,
        labelStyle: GoogleFonts.lexend(
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),

      // Switch e outros componentes
      switchTheme: SwitchThemeData(
        thumbColor: MaterialStateProperty.resolveWith((states) {
          if (states.contains(MaterialState.selected)) {
            return primaryColor;
          }
          return Colors.grey;
        }),
        trackColor: MaterialStateProperty.resolveWith((states) {
          if (states.contains(MaterialState.selected)) {
            return primaryColor.withOpacity(0.5);
          }
          return Colors.grey.withOpacity(0.3);
        }),
      ),

      // Progress indicators
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: primaryColor,
        linearTrackColor: backgroundColor,
      ),

      // Divider
      dividerTheme: DividerThemeData(
        color: primaryColor.withOpacity(0.2),
        thickness: 1,
      ),
    );
  }
}