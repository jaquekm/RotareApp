import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/auth_store.dart';
import 'pages/login_page.dart';
import 'pages/my_trip_page.dart';
import 'pages/admin_dashboard_page.dart';
import 'routes/app_router.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthStore()),
      ],
      child: const RotareApp(),
    ),
  );
}

class RotareApp extends StatelessWidget {
  const RotareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Rotare',
      theme: ThemeData(primarySwatch: Colors.blue),
      initialRoute: '/',
      routes: {
        '/': (context) => const LoginPage(),
        '/my_trip': (context) => const MyTripPage(),
        '/admin': (context) => const AdminDashboardPage(),
      },
      onGenerateRoute: AppRouter.generateRoute,
    );
  }
}
