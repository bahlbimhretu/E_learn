import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  BarChart3,
  MessageSquare,
  Calendar,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">

      {/* ================= NAVBAR ================= */}
      <header className="fixed w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-blue-900">
              Tsinseta Mariam Senior Secondary School
            </h1>
          </div>

          <nav className="hidden md:flex gap-8 font-medium">
            <a href="#about" className="hover:text-blue-800">About</a>
            <a href="#features" className="hover:text-blue-800">LMS</a>
            <a href="#announcements" className="hover:text-blue-800">Announcements</a>
            <a href="#contact" className="hover:text-blue-800">Contact</a>
          </nav>

          <Link
            to="/login"
            className="bg-blue-900 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-800 transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 text-white pt-20">
        <div className="max-w-4xl text-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-6 leading-tight"
          >
            Excellence in Education <br /> Innovation in Learning
          </motion.h2>

          <p className="text-lg mb-8">
            A Premium Blended Learning Platform for Grades 9–12.
            Empowering Students, Teachers, and Parents Through Digital Excellence.
          </p>

          <Link
            to="/login"
            className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-2xl font-semibold shadow-lg hover:bg-yellow-400 transition"
          >
            Access LMS
          </Link>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-blue-900 mb-6">
            About Our School
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            Tsinseta Mariam Senior Secondary School is a private institution 
            dedicated to academic excellence, character development, and 
            digital innovation. Our Learning Management System integrates 
            modern technology with high-quality instruction to prepare 
            students for university and national success.
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-blue-900 mb-14">
            Our Digital Learning Features
          </h3>

          <div className="grid md:grid-cols-3 gap-10">

            <FeatureCard
              icon={<BookOpen size={40} />}
              title="Online Courses"
              desc="Access structured lessons, resources, and digital content anytime."
            />

            <FeatureCard
              icon={<GraduationCap size={40} />}
              title="Assignments & Exams"
              desc="Submit assignments and take quizzes with real-time evaluation."
            />

            <FeatureCard
              icon={<BarChart3 size={40} />}
              title="Performance Tracking"
              desc="Monitor grades and academic progress throughout the year."
            />

            <FeatureCard
              icon={<MessageSquare size={40} />}
              title="Parent Messaging"
              desc="Strong communication between teachers and parents."
            />

            <FeatureCard
              icon={<Calendar size={40} />}
              title="Academic Calendar"
              desc="Stay informed with schedules, exams, and school events."
            />

            <FeatureCard
              icon={<Users size={40} />}
              title="Role-Based Access"
              desc="One login system for Students, Teachers, Parents, and Admin."
            />

          </div>
        </div>
      </section>

      {/* ================= ANNOUNCEMENTS ================= */}
      <section id="announcements" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-blue-900 mb-10">
            Latest Announcements
          </h3>

          <div className="space-y-6 text-left">

            <Announcement 
              title="Mid-Term Examination Schedule Released"
              date="March 2026"
            />

            <Announcement 
              title="Parent-Teacher Meeting – Grade 12"
              date="April 2026"
            />

            <Announcement 
              title="National Exam Preparation Program"
              date="Ongoing"
            />

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-blue-900 text-white text-center">
        <h3 className="text-3xl font-bold mb-6">
          Join Our Digital Learning Community
        </h3>
        <p className="mb-8">
          Secure. Professional. Innovative.
        </p>

        <Link
          to="/login"
          className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-2xl font-semibold shadow-lg hover:bg-yellow-400 transition"
        >
          Login to LMS
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h4 className="text-xl font-semibold mb-4">
            Tsinseta Mariam Senior Secondary School
          </h4>

          <p>Adigrat, Ethiopia</p>
          <p>Email: info@tsinsetamariam.edu.et</p>
          <p>Phone: +251 9XX XXX XXX</p>

          <div className="mt-6 text-sm text-gray-500">
            © 2026 Tsinseta Mariam Senior Secondary School. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}


/* ================= COMPONENTS ================= */

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">
      <div className="text-blue-900 mb-4 flex justify-center">
        {icon}
      </div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function Announcement({ title, date }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h5 className="font-semibold text-lg">{title}</h5>
      <p className="text-gray-500 text-sm mt-1">{date}</p>
    </div>
  );
}