
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon, CubeTransparentIcon, LockClosedIcon, ChartBarIcon,
  UserGroupIcon, AcademicCapIcon, CheckCircleIcon, ArrowRightIcon
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    { icon: <ShieldCheckIcon className="w-12 h-12" />, title: 'Blockchain Security', description: 'Immutable record keeping ensures your academic work is permanently secured and tamper-proof.' },
    { icon: <CubeTransparentIcon className="w-12 h-12" />, title: 'Decentralized Verification', description: 'Cross-institutional plagiarism detection without relying on centralized databases.' },
    { icon: <LockClosedIcon className="w-12 h-12" />, title: 'Data Privacy', description: 'Only cryptographic hashes are stored on-chain, protecting your intellectual property.' },
    { icon: <ChartBarIcon className="w-12 h-12" />, title: 'Advanced Analytics', description: 'AI-powered NLP techniques detect paraphrasing and semantic similarities.' },
    { icon: <UserGroupIcon className="w-12 h-12" />, title: 'Multi-University Network', description: 'Connect with multiple institutions for comprehensive plagiarism detection.' },
    { icon: <AcademicCapIcon className="w-12 h-12" />, title: 'Academic Integrity', description: 'Promote originality and maintain high standards across Nigerian universities.' }
  ];

  const stats = [
    { label: 'Documents Verified', value: '10,000+' },
    { label: 'Universities', value: '25+' }
  ];

  const howItWorks = [
    { step: '01', title: 'Upload Document', description: 'Submit your academic work through our secure platform in PDF or DOCX format.' },
    { step: '02', title: 'Hash Generation', description: 'Document is converted into unique cryptographic hashes using SHA-256 algorithm.' },
    { step: '03', title: 'Blockchain Storage', description: 'Merkle root is stored on the blockchain, creating an immutable record.' },
    { step: '04', title: 'Similarity Analysis', description: 'System compares your work against all existing submissions for plagiarism detection.' },
    { step: '05', title: 'Get Report', description: 'Receive detailed originality report with similarity index and confidence score.' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PlagiarismGuard</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition">How It Works</a>
              <a href="#about" className="text-gray-600 hover:text-primary-600 transition">About</a>
              <Link to="/login" className="text-gray-600 hover:text-primary-600 transition">Login</Link>
              <Link to="/register" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">Get Started</Link>
            </div>
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />)}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">How It Works</a>
              <a href="#about" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">About</a>
              <Link to="/login" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Login</Link>
              <Link to="/register" className="block px-3 py-2 text-primary-600 font-medium hover:bg-gray-50 rounded-md">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Blockchain-Powered
                <span className="text-primary-600"> Plagiarism Detection</span>
                <br />for Nigerian Universities
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Ensure academic integrity with immutable blockchain technology. Detect plagiarism across institutions with unparalleled accuracy and transparency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/register')} className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition flex items-center justify-center group">
                  Get Started Free
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
                </button>
                <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-primary-600 px-8 py-4 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition">
                  Learn More
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-12">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 shadow-2xl">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center text-green-700">
                          <CheckCircleIcon className="h-6 w-6 mr-2" />
                          <span className="font-medium">Verified on Blockchain</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                  <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
                  <LockClosedIcon className="h-8 w-8 text-secondary-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose PlagiarismGuard?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Built specifically for Nigerian universities with cutting-edge blockchain technology</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-lg transition group">
                <div className="text-primary-600 mb-4 group-hover:scale-110 transition">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Five simple steps to ensure academic integrity</p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition">
                    <div className="bg-primary-600 text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">{item.step}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{item.title}</h3>
                    <p className="text-gray-600 text-sm text-center">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Protect Academic Integrity?</h2>
          <p className="text-xl mb-8 opacity-90">Join 25+ Nigerian universities already using PlagiarismGuard</p>
          <button onClick={() => navigate('/register')} className="bg-white text-primary-600 px-10 py-4 rounded-lg hover:bg-gray-100 transition text-lg font-semibold inline-flex items-center group">
            Start Your Free Trial
            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </section>

      <footer id="about" className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-primary-400" />
                <span className="ml-2 text-xl font-bold">PlagiarismGuard</span>
              </div>
              <p className="text-gray-400">Blockchain-powered plagiarism detection for Nigerian universities.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PlagiarismGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
