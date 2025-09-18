import 'package:flutter/material.dart';

class MyTripPage extends StatelessWidget {
  const MyTripPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Minha Viagem')),
      body: const Center(
        child: Text('Mapa e ETA aparecerão aqui (stub).'),
      ),
    );
  }
}
