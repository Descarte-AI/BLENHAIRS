import React from 'react';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Shield, 
  Truck 
} from 'lucide-react';

const Footer = () => {
  const supportLinks = [
    { label: 'Size Guide', href: '#' },
    { label: 'Installation Guide', href: '#' },
    { label: 'Care Instructions', href: '#' },
    { label: 'Returns & Exchanges', href: '#' },
    { label: 'Shipping Info', href: '#' },
    { label: 'Contact Us', href: '#' }
  ];

  const trustBadges = [
    { icon: Award, title: '100%', subtitle: 'Human Hair' },
    { icon: Shield, title: '30 Day', subtitle: 'Money Back' },
    { icon: Truck, title: 'Free', subtitle: 'Worldwide Shipping' },
    { icon: Shield, title: 'SSL', subtitle: 'Secure Checkout' }
  ];

  const socialLinks = [
    { icon: Instagram, color: 'hover:text-pink-500' },
    { icon: Facebook, color: 'hover:text-blue-500' },
    { icon: Youtube, color: 'hover:text-red-500' }
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Blen Hairs
            </h3>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              Premium afro kinky bulk hair extensions for natural styling and protective hairstyles.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href="#" 
                  className={`text-gray-300 ${social.color} transition-colors p-3 bg-white/10 rounded-lg hover:bg-white/20`}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-6 text-xl">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors text-lg hover:pl-2 duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/collection/afro-kinky-bulk" className="text-gray-300 hover:text-white transition-colors text-lg hover:pl-2 duration-300">
                  Afro Kinky Bulk Collection
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg hover:pl-2 duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg hover:pl-2 duration-300">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold text-white mb-6 text-xl">Support</h4>
            <ul className="space-y-4">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors text-lg hover:pl-2 duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-white mb-6 text-xl">Contact</h4>
            <div className="space-y-6 text-gray-300">
              <div className="flex items-center space-x-4">
                <Phone size={20} className="text-white" />
                <span className="text-lg">1-800-BLEN-HAIR</span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail size={20} className="text-white" />
                <span className="text-lg">hello@blenhairs.com</span>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin size={20} className="mt-1 text-white" />
                <span className="text-lg">
                  123 Beauty Boulevard<br />
                  Los Angeles, CA 90210<br />
                  United States
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-700 mt-16 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full md:w-auto">
              {trustBadges.map((badge, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <badge.icon size={28} className="text-white" />
                  </div>
                  <div className="font-bold text-white text-lg">
                    {badge.title}
                  </div>
                  <div className="text-sm text-gray-400">
                    {badge.subtitle}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-lg text-gray-400">
              © {new Date().getFullYear()} Blen Hairs. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;