import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const LandingBody = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="relative min-h-screen font-sans">
      {/* Background Grid with Parallax Effect */}
      <div
        className="absolute inset-0 -z-10 h-full w-full bg-[#FAFAFA] bg-[linear-gradient(to_right,#2D3748_1px,transparent_1px),linear-gradient(to_bottom,#2D3748_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-20"
        style={{
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#14B8A6] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-white">CollabBoard</h1>
          <nav className="flex items-center space-x-6">
            <a href="#features" className="text-white hover:text-[#FBBF24] transition">Features</a>
            <a href="#about" className="text-white hover:text-[#FBBF24] transition">About</a>
            <button
              onClick={() => loginWithRedirect()}
              className="bg-[#14B8A6] text-white px-4 py-2 rounded-md font-medium hover:bg-[#FBBF24] transition border border-white"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#2D3748] mb-6 animate-fade-in">
          Collaborate Seamlessly with CollabBoard
        </h2>
        <p className="text-lg text-[#2D3748] mb-8 max-w-2xl mx-auto">
          Empower your team with real-time whiteboard tools for brainstorming and project planning.
        </p>
        <button
          onClick={() => loginWithRedirect()}
          className="bg-[#14B8A6] text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-[#FBBF24] transition"
        >
          Start Collaborating
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        <h3 className="text-3xl font-bold text-[#2D3748] text-center mb-12">Why CollabBoard?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#FAFAFA] p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-t-2 border-[#7C3AED]">
            <h4 className="text-xl font-semibold text-[#2D3748] mb-2">Real-Time Sync</h4>
            <p className="text-[#2D3748]">Collaborate instantly with your team, with updates in real-time.</p>
          </div>
          <div className="bg-[#FAFAFA] p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-t-2 border-[#7C3AED]">
            <h4 className="text-xl font-semibold text-[#2D3748] mb-2">Powerful Tools</h4>
            <p className="text-[#2D3748]">Draw, annotate, and create with intuitive, professional-grade tools.</p>
          </div>
          <div className="bg-[#FAFAFA] p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-t-2 border-[#7C3AED]">
            <h4 className="text-xl font-semibold text-[#2D3748] mb-2">Secure Access</h4>
            <p className="text-[#2D3748]">Access your boards securely from any device, anywhere.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#7C3AED]/5 rounded-2xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h3 className="text-3xl font-bold text-[#2D3748] mb-4">About CollabBoard</h3>
            <p className="text-[#2D3748] mb-4">
              CollabBoard is designed for teams to collaborate effortlessly, from brainstorming to execution.
            </p>
            <p className="text-[#2D3748]">
              Trusted by professionals worldwide, CollabBoard drives productivity and creativity.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white h-64 w-fit rounded-lg shadow-md flex items-center justify-center border border-[#7C3AED] overflow-hidden">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                <rect x="0" y="0" width="400" height="200" fill="#FAFAFA" />
                <path d="M50,150 Q100,50 150,150" stroke="#14B8A6" strokeWidth="4" fill="none" />
                <circle cx="200" cy="100" r="30" fill="#FBBF24" />
                <rect x="250" y="80" width="100" height="40" fill="#7C3AED" />
                <text x="80" y="180" fill="#2D3748" fontSize="14" fontWeight="bold">Your Ideas Here!</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-3xl font-bold text-[#2D3748] mb-6">Ready to Elevate Your Teamwork?</h3>
        <p className="text-lg text-[#2D3748] mb-8 max-w-2xl mx-auto">
          Sign up today and experience seamless collaboration with CollabBoard.
        </p>
        <button
          onClick={() => loginWithRedirect()}
          className="bg-[#14B8A6] text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-[#FBBF24] transition"
        >
          Join Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#14B8A6] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">CollabBoard</h4>
              <p className="text-white">Streamlined tools for professional collaboration.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-white hover:text-[#FBBF24] transition">Features</a></li>
                <li><a href="#about" className="text-white hover:text-[#FBBF24] transition">About</a></li>
                <li><a href="#" className="text-white hover:text-[#FBBF24] transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-white">Email: support@collabboard.com</p>
              <p className="text-white">Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-8 text-center text-white">
            &copy; 2025 CollabBoard. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Tailwind Animation Keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default LandingBody;