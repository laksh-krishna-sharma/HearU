import 'package:flutter/material.dart';
import '../repositories/auth_remote_repository.dart';

import 'login_screen.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  _SignupScreenState createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _genderController = TextEditingController();
  final TextEditingController _ageController = TextEditingController();

  final AuthRemoteRepository _authRepo = AuthRemoteRepository();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _usernameController.dispose();
    _genderController.dispose();
    _ageController.dispose();
    super.dispose();
  }

  Future<void> _showGenderPicker() async {
    final String? gender = await showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        return SimpleDialog(
          title: const Text('Select Gender'),
          children: <String>['Male', 'Female', 'Others']
              .map(
                (String option) => SimpleDialogOption(
                  onPressed: () {
                    Navigator.pop(context, option);
                  },
                  child: Text(option),
                ),
              )
              .toList(),
        );
      },
    );
    if (gender != null) {
      _genderController.text = gender;
    }
  }

  Future<void> _showAgePicker() async {
    final int? age = await showDialog<int>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Select Age (13+)'),
          content: SizedBox(
            height: MediaQuery.of(context).size.height * 0.3,
            width: double.maxFinite,
            child: ListView.builder(
              itemCount: 100, // Provides a range of ages to select from
              itemBuilder: (context, index) {
                final int currentAge = 13 + index;
                return ListTile(
                  title: Text(currentAge.toString()),
                  onTap: () {
                    Navigator.pop(context, currentAge);
                  },
                );
              },
            ),
          ),
        );
      },
    );
    if (age != null) {
      _ageController.text = age.toString();
    }
  }

  void _registerUser() async {
    final String name = _nameController.text;
    final String email = _emailController.text;
    final String password = _passwordController.text;
    final String username = _usernameController.text;
    final String gender = _genderController.text;
    final int age = int.tryParse(_ageController.text) ?? 0;

    try {
      await _authRepo.signup(
        name: name,
        email: email,
        password: password,
        username: username,
        age: age,
        gender: gender,
      );
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Registration Successful!')),
      );
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Registration Failed: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          height: screenHeight,
          width: screenWidth,
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: AssetImage('assets/images/background.png'),
              fit: BoxFit.cover,
              colorFilter: ColorFilter.mode(
                Colors.white70,
                BlendMode.softLight,
              ),
            ),
          ),
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: screenWidth * 0.06),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(height: screenHeight * 0.02),
                const Text(
                  'Hi !\nWelcome',
                  style: TextStyle(
                    fontSize: 48,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF33334F),
                    height: 1.2,
                  ),
                ),
                SizedBox(height: screenHeight * 0.01),
                const Text(
                  "Let's create an account",
                  style: TextStyle(
                    fontSize: 18,
                    color: Color(0xFF33334F),
                  ),
                ),
                SizedBox(height: screenHeight * 0.05),
                // Name field
                TextField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    labelText: 'Name',
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                  ),
                ),
                SizedBox(height: screenHeight * 0.03),
                // Email field
                TextField(
                  controller: _emailController,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                  ),
                ),
                SizedBox(height: screenHeight * 0.03),
                // Password field
                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                  ),
                ),
                SizedBox(height: screenHeight * 0.03),
                // Username field
                TextField(
                  controller: _usernameController,
                  decoration: const InputDecoration(
                    labelText: 'Username',
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                  ),
                ),
                SizedBox(height: screenHeight * 0.03),
                // Gender field
                TextField(
                  controller: _genderController,
                  readOnly: true,
                  onTap: _showGenderPicker,
                  decoration: const InputDecoration(
                    labelText: 'Gender',
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    suffixIcon:
                        Icon(Icons.arrow_drop_down, color: Color(0xFF33334F)),
                  ),
                ),
                SizedBox(height: screenHeight * 0.03),
                // Age field
                TextField(
                  controller: _ageController,
                  readOnly: true,
                  onTap: _showAgePicker,
                  decoration: const InputDecoration(
                    labelText: 'Age',
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    suffixIcon:
                        Icon(Icons.arrow_drop_down, color: Color(0xFF33334F)),
                  ),
                ),
                const Spacer(),
                // Sign Up button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _registerUser,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF33334F),
                      padding:
                          EdgeInsets.symmetric(vertical: screenHeight * 0.02),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Sign Up',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                SizedBox(height: screenHeight * 0.06),
                // "Have an account? Log In" text
                Align(
                  alignment: Alignment.center,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Have an account? ',
                        style: TextStyle(color: Color(0xFF33334F)),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const LoginScreen()),
                          );
                        },
                        child: const Text(
                          'Log In',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF33334F),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: screenHeight * 0.05),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
