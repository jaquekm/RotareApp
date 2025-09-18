import 'package:flutter/material.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Rotare - Login')),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Login (stub)'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pushNamed('/my-trip'),
              child: const Text('Entrar como Passageiro'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pushNamed('/admin'),
              child: const Text('Entrar como Empresa (demo)'),
            ),
          ],
        ),
      ),
    );
  }
}
