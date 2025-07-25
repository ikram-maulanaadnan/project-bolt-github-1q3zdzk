import React, { useState } from 'react';
import { 
    TrendingUp, MessageCircle, Star, CheckCircle, BarChart3, Zap, Target, Award, Shield, Users, Clock, Activity, ChevronDown 
} from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { Package, Feature, Testimonial, FAQ } from '../types';
import { DiscordIdModal } from './DiscordIdModal';

const iconMap: { [key: string]: React.ReactNode } = {
    TrendingUp: <TrendingUp className="w-8 h-8 text-neon-cyan" />,
    Target: <Target className="w-8 h-8 text-neon-cyan" />,
    Shield: <Shield className="w-8 h-8 text-neon-cyan" />,
    BarChart3: <BarChart3 className="w-8 h-8 text-neon-cyan" />,
    Zap: <Zap className="w-8 h-8 text-neon-cyan" />,
    Award: <Award className="w-8 h-8 text-neon-cyan" />,
    Users: <Users className="w-8 h-8 text-neon-cyan" />,
    Clock: <Clock className="w-8 h-8 text-neon-cyan" />,
    Activity: <Activity className="w-8 h-8 text-neon-cyan" />,
};

const LandingPage: React.FC = () => {
  const { heroContent, features, packages, testimonials, faqs, isLoading, error } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const handlePurchaseClick = (pkg: Package) => {
    if (!pkg.payment_link) {
      return;
    }
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading Content...</p>
            </div>
        </div>
    );
  }
  
  if (error || !heroContent) {
    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center text-red-400 px-4">
            <div className="text-center bg-card-dark p-8 rounded-lg border border-red-500/50">
                <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h2>
                <p className="text-red-400">{error || "Failed to load content. Please check the backend connection and try again."}</p>
            </div>
        </div>
    );
  }

  const whatsappLink = `https://wa.me/${heroContent.whatsappNumber}?text=Hello, I'm interested`;

  return (
    <div className="min-h-screen bg-background-dark font-sans text-gray-300 overflow-x-hidden">
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-dark z-0"></div>
            <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="text-lg font-bold text-neon-cyan uppercase tracking-widest mb-4">{heroContent.subtitle}</h2>
                <h1 className="text-4xl sm:text-7xl font-black text-white mb-6 leading-tight">{heroContent.title}</h1>
                <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">{heroContent.description}</p>
                <a href="#packages" className="inline-block bg-neon-cyan text-black px-8 py-4 rounded-lg font-bold text-lg transition-transform transform hover:scale-105 shadow-neon-cyan">
                    Get Started Now
                </a>
            </div>
        </section>

        {/* Features Section */}
        {features && features.length > 0 && (
            <section id="features" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-bold text-white">Why Choose Us?</h2>
                        <p className="text-xl text-gray-400 mt-4">Unlock your trading potential with our powerful features.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div key={feature.id} className="bg-card-dark p-8 rounded-2xl border border-border-dark transition-all duration-300 hover:border-neon-cyan hover:-translate-y-2">
                                <div className="mb-4">{iconMap[feature.icon] || <Star className="w-8 h-8 text-neon-cyan" />}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )}

        {/* === NEWLY ADDED SECTION (IN ENGLISH) === */}
        <section id="detailed-features" className="py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="relative">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-4 top-2 h-full border-l-2 border-green-500 border-dashed"></div>

                    {/* Feature #02 */}
                    <div className="mb-24 relative">
                        <div className="flex items-center mb-8">
                            <div className="z-10 bg-green-500 text-black w-10 h-10 rounded-full flex items-center justify-center font-bold">#02</div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="md:pl-12">
                                <h3 className="text-3xl font-bold text-white mb-4">Personal Investment Portfolio Strategy</h3>
                                <ul className="space-y-3 text-gray-300">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span>Get investment allocation examples based on risk profiles</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span>Long-term investment templates inspired by billionaires</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span>Perfect for beginners looking to upgrade their portfolio</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <img src="https://placehold.co/600x400/161B22/E0E0E0?text=Allocation+Example" alt="Portfolio Strategy" className="rounded-2xl shadow-lg border border-border-dark" />
                            </div>
                        </div>
                    </div>

                    {/* Feature #03 */}
                    <div className="relative">
                        <div className="flex items-center mb-8">
                            <div className="z-10 bg-green-500 text-black w-10 h-10 rounded-full flex items-center justify-center font-bold">#03</div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="md:order-2 md:pl-12">
                                <h3 className="text-3xl font-bold text-white mb-4">Real-time Market Updates & Exclusive Research</h3>
                                <ul className="space-y-3 text-gray-300">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span>Direct insights from industry practitioners</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span>Monthly updates on stock markets, macroeconomics, and new opportunities.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span>Not just theory, you'll navigate the market with us.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="md:order-1">
                                <img src="https://placehold.co/600x400/161B22/E0E0E0?text=Market+Research" alt="Market Update" className="rounded-2xl shadow-lg border border-border-dark" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/* === END OF NEW SECTION === */}

        {/* Packages Section */}
        {packages && packages.length > 0 && (
            <section id="packages" className="py-20 px-4 bg-black bg-opacity-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-bold text-white">Choose Your Plan</h2>
                        <p className="text-xl text-gray-400 mt-4">Select the package that best suits your needs.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map((pkg) => (
                            <div key={pkg.id} className={`relative flex flex-col bg-card-dark rounded-2xl p-8 border ${pkg.popular ? 'border-neon-pink shadow-neon-pink' : 'border-border-dark'}`}>
                                {pkg.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-neon-pink text-black px-4 py-2 rounded-full text-sm font-bold">MOST POPULAR</div>}
                                <div className="flex-grow">
                                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                                    <div className="text-4xl font-black text-neon-cyan mb-2">${pkg.price}</div>
                                    <p className="text-gray-400 h-12">{pkg.description}</p>
                                    <ul className="space-y-4 my-8">
                                        {Array.isArray(pkg.features) && pkg.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-neon-cyan" /> 
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button onClick={() => handlePurchaseClick(pkg)} className={`w-full text-center py-3 px-6 rounded-lg font-bold mt-auto transition-transform transform hover:scale-105 ${pkg.payment_link ? (pkg.popular ? 'bg-neon-pink text-black shadow-neon-pink' : 'bg-neon-cyan text-black shadow-neon-cyan') : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`} disabled={!pkg.payment_link}>
                                    {pkg.payment_link ? 'Get This Package' : 'Coming Soon'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )}

        {/* Testimonials Section */}
        {testimonials && testimonials.length > 0 && (
            <section id="testimonials" className="py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-bold text-white">What Our Members Say</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {testimonials.map((testimonial) => (
                            <blockquote key={testimonial.id} className="bg-card-dark p-8 rounded-2xl border border-border-dark">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" />
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                                <footer className="text-right">
                                    <div className="font-bold text-white">{testimonial.name}</div>
                                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                                </footer>
                            </blockquote>
                        ))}
                    </div>
                </div>
            </section>
        )}

        {/* FAQ Section */}
        {faqs && faqs.length > 0 && (
            <section id="faq" className="py-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-bold text-white">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <details key={faq.id} className="bg-card-dark rounded-lg border border-border-dark group">
                                <summary className="flex items-center justify-between p-6 cursor-pointer">
                                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                                    <ChevronDown className="w-5 h-5 text-gray-400 transition-transform transform group-open:rotate-180" />
                                </summary>
                                <div className="px-6 pb-6 text-gray-400">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card-dark border-t border-border-dark py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Trading Crypto Academy. All Rights Reserved.</p>
            <div className="flex justify-center gap-4 mt-4">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">Contact Us</a>
            </div>
        </div>
      </footer>

      {isModalOpen && selectedPackage && (
        <DiscordIdModal pkg={selectedPackage} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default LandingPage;
