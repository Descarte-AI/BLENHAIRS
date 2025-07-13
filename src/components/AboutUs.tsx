import React from 'react';
import { Award, Heart, Users, Sparkles, CheckCircle, Star } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { number: '10,000+', label: 'Happy Customers', icon: Users },
    { number: '5 Years', label: 'Experience', icon: Award },
    { number: '100%', label: 'Human Hair', icon: CheckCircle },
    { number: '4.9/5', label: 'Customer Rating', icon: Star }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Quality First',
      description: 'We source only the finest 100% human hair to ensure natural look and feel'
    },
    {
      icon: Sparkles,
      title: 'Expert Craftsmanship',
      description: 'Each extension is carefully crafted by skilled artisans with years of experience'
    },
    {
      icon: Users,
      title: 'Customer Care',
      description: 'Your satisfaction is our priority with dedicated support and guidance'
    }
  ];

  return (
    <section id="about" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-cormorant text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Story of Beauty & Excellence
            </h2>
            <p className="font-lato text-lg text-gray-700 mb-6 leading-relaxed">
              Founded with a passion for helping women feel confident and beautiful, Blen Hairs 
              has become a trusted name in premium hair extensions. We believe every woman deserves to 
              feel amazing in her own skin.
            </p>
            <p className="font-lato text-gray-600 mb-8 leading-relaxed">
              Our journey began when our founder struggled to find high-quality, natural-looking extensions 
              that matched her unique style. Today, we serve thousands of customers worldwide with the same 
              commitment to quality and authenticity.
            </p>
            <button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg">
              Learn More About Us
            </button>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="/IMG-20250629-WA0189.jpg" 
                  alt="Beautiful hair transformation" 
                  className="w-full h-48 object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                />
                <img 
                  src="/IMG-20250629-WA0185.jpg" 
                  alt="Professional styling" 
                  className="w-full h-36 object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="/IMG-20250629-WA0193.jpg" 
                  alt="Quality hair extensions" 
                  className="w-full h-36 object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                />
                <img 
                  src="/IMG-20250629-WA0200.jpg" 
                  alt="Natural textures" 
                  className="w-full h-48 object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="font-cormorant text-2xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="font-lato text-gray-600 font-semibold text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="font-cormorant text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h3>
            <p className="font-lato text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence goes beyond just selling hair extensions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <value.icon size={28} className="text-white" />
                </div>
                <h4 className="font-cormorant text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h4>
                <p className="font-lato text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    
  );
};

export default AboutUs;