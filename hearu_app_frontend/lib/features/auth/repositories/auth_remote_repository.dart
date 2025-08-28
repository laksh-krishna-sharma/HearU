import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthRemoteRepository {
  Future<void> signup({
    required String name,
    required String email,
    required String password,
    required String username,
    required int age,
    required String gender,
  }) async {
    final response = await http.post(
      Uri.parse(
        'http://0.0.0.0:8000/api/register',
      ),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(<String, dynamic>{
        'name': name,
        'email': email,
        'password': password,
        'username': username,
        'age': age,
        'gender': gender,
      }),
    );
    print(response.body);
    print(response.statusCode);
  }
}