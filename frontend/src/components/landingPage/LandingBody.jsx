import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const LandingBody = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="relative min-h-screen font-sans">
      {/* Background Grid with Parallax Effect */}
      <div 
        className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#190482_1px,transparent_1px),linear-gradient(to_bottom,#190482_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-20"
        style={{
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#190482] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-white">CollabBoard</h1>
          <nav className="flex items-center space-x-6">
            <a href="#features" className="text-[#C2D9FF] hover:text-[#8E8FFA] transition">Features</a>
            <a href="#about" className="text-[#C2D9FF] hover:text-[#8E8FFA] transition">About</a>
            <button
              onClick={() => loginWithRedirect()}
              className="bg-[#7752FE] text-white px-4 py-2 rounded-md font-medium hover:bg-[#8E8FFA] transition"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#190482] mb-6 animate-fade-in">
          Collaborate Seamlessly with CollabBoard
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Empower your team with real-time whiteboard tools for brainstorming and project planning.
        </p>
        <button
          onClick={() => loginWithRedirect()}
          className="bg-[#7752FE] text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-[#8E8FFA] transition"
        >
          Start Collaborating
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white to-[#C2D9FF]/10">
        <h3 className="text-3xl font-bold text-[#190482] text-center mb-12">Why CollabBoard?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-t-2 border-[#7752FE]">
            <h4 className="text-xl font-semibold text-[#190482] mb-2">Real-Time Sync</h4>
            <p className="text-gray-600">Collaborate instantly with your team, with updates in real-time.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-t-2 border-[#8E8FFA]">
            <h4 className="text-xl font-semibold text-[#190482] mb-2">Powerful Tools</h4>
            <p className="text-gray-600">Draw, annotate, and create with intuitive, professional-grade tools.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-t-2 border-[#C2D9FF]">
            <h4 className="text-xl font-semibold text-[#190482] mb-2">Secure Access</h4>
            <p className="text-gray-600">Access your boards securely from any device, anywhere.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#C2D9FF]/5">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h3 className="text-3xl font-bold text-[#190482] mb-4">About CollabBoard</h3>
            <p className="text-gray-600 mb-4">
              CollabBoard is designed for teams to collaborate effortlessly, from brainstorming to execution.
            </p>
            <p className="text-gray-600">
              Trusted by professionals worldwide, CollabBoard drives productivity and creativity.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-[#8E8FFA] h-64 rounded-lg flex items-center justify-center transition">
              <span className="text-white font-semibold">Whiteboard Preview</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-3xl font-bold text-[#190482] mb-6">Ready to Elevate Your Teamwork?</h3>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Sign up today and experience seamless collaboration with CollabBoard.
        </p>
        <button
          onClick={() => loginWithRedirect()}
          className="bg-[#7752FE] text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-[#8E8FFA] transition"
        >
          Join Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#190482] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">CollabBoard</h4>
              <p className="text-[#C2D9FF]">Streamlined tools for professional collaboration.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-[#C2D9FF] hover:text-[#8E8FFA] transition">Features</a></li>
                <li><a href="#about" className="text-[#C2D9FF] hover:text-[#8E8FFA] transition">About</a></li>
                <li><a href="#" className="text-[#C2D9FF] hover:text-[#8E8FFA] transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-[#C2D9FF]">Email: support@collabboard.com</p>
              <p className="text-[#C2D9FF]">Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-8 text-center text-[#C2D9FF]">
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