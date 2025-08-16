import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-ocean-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Mission */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold mb-4">
              <span className="text-white">Hear</span>
              <span className="text-ocean-primary">U</span>
            </div>
            <p className="text-blue-100 leading-relaxed max-w-md">
              Supporting youth mental wellness with compassionate care, 
              professional guidance, and a community that understands.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-blue-100">
              <li>
                <a href="#" className="hover:text-white transition-all duration-300">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-all duration-300">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-all duration-300">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-all duration-300">
                  Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-blue-100">
              <li>
                <a href="#" className="hover:text-white transition-all duration-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-all duration-300">
                  Crisis Hotline
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-all duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-all duration-300">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="bg-ocean-accent bg-opacity-20 rounded-lg p-4 mb-8">
          <p className="text-center text-white font-medium">
            <span className="font-bold">Crisis Support:</span> If you're in immediate danger, 
            please call 988 (Suicide & Crisis Lifeline) or text "HELLO" to 741741
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-400 border-opacity-30 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-100 text-sm">
              © 2024 HearU. All rights reserved. Made with care for mental wellness.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-blue-100 hover:text-white transition-all duration-300">
                About
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-all duration-300">
                Contact
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-all duration-300">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;