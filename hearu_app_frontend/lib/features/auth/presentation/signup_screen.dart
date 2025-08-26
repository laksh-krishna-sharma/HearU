import 'package:flutter/material.dart';

import 'login_screen.dart'; // Import the LoginScreen widget for navigation

class SignupScreen extends StatelessWidget {
  const SignupScreen({super.key});

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
                SizedBox(height: screenHeight * 0.1),
                // "HEARU" logo/text
                const Align(
                  alignment: Alignment.topLeft,
                  child: Text(
                    'HEARU',
                    style: TextStyle(
                      fontFamily: 'Alegreya Sans SC',
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF33334F),
                    ),
                  ),
                ),
                SizedBox(height: screenHeight * 0.05),
                // "Hi! Welcome" text
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
                // Email/Phone Number field
                TextField(
                  decoration: InputDecoration(
                    labelText: 'Email or Phone Number',
                    labelStyle: const TextStyle(color: Colors.grey),
                    enabledBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    focusedBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                  ),
                ),
                SizedBox(height: screenHeight * 0.03),
                // Full Name field
                TextField(
                  decoration: InputDecoration(
                    labelText: 'Full Name',
                    labelStyle: const TextStyle(color: Colors.grey),
                    enabledBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    focusedBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                  ),
                ),
                SizedBox(height: screenHeight * 0.03),
                // Password field
                TextField(
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    labelStyle: const TextStyle(color: Colors.grey),
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.remove_red_eye, color: Colors.grey),
                      onPressed: () {
                        // Toggle password visibility
                      },
                    ),
                    enabledBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    focusedBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                    helperText: 'Must contain a number and at least 6 characters',
                    helperStyle: const TextStyle(color: Colors.grey),
                  ),
                ),
                SizedBox(height: screenHeight * 0.03),
                // Confirm Password field
                TextField(
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Confirm Password',
                    labelStyle: const TextStyle(color: Colors.grey),
                    enabledBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    focusedBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF33334F)),
                    ),
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                  ),
                ),
                SizedBox(height: screenHeight * 0.06),
                // Sign Up button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF33334F),
                      padding: EdgeInsets.symmetric(vertical: screenHeight * 0.02),
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
                            MaterialPageRoute(builder: (context) => const LoginScreen()),
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
              ],
            ),
          ),
        ),
      ),
    );
  }
}