import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import {
  GraduationCap,
  BookOpen,
  BarChart3,
  Bell,
  X,
  Clock,
  UserCircle,
  MessageSquare,
  Calendar,
  Users
} from "lucide-react";

// Helper: Format Date consistently
const formatAppDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function HomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); // Modal state

  // Fetch Public Announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get("/announcements/public");
        setAnnouncements(response.data.slice(0, 5));
      } catch (error) {
        console.error("Error loading announcements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="bg-white text-gray-800 antialiased">
      {/* ================= NAVBAR ================= */}
      <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-blue-900" size={28} />
            <h1 className="text-xl font-extrabold text-blue-950 tracking-tight">
              Tsinseta Mariam
            </h1>
          </div>
          <nav className="hidden md:flex gap-8 font-medium text-gray-700">
            <NavLink href="#about">About</NavLink>
            <NavLink href="#features">LMS</NavLink>
            <NavLink href="#announcements">Announcements</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </nav>
          <Link to="/login" className="bg-blue-900 text-white px-6 py-2.5 rounded-xl font-semibold shadow hover:bg-blue-800 transition duration-200 text-sm">
            Login
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white pt-24 pb-16">
        <div className="max-w-4xl text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-white/10 text-yellow-300 px-4 py-1 rounded-full text-sm font-medium mb-4 border border-white/10">
              Grades 9 – 12
            </span>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tighter">
              Excellence in Education <br /> Innovation in Learning
            </h2>
            <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
              Tsinseta Mariam's premium blended learning platform empowering the next generation through digital excellence.
            </p>
            <Link to="/login" className="bg-yellow-500 text-blue-950 px-10 py-4 rounded-2xl font-bold hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-500/20 text-lg">
              Access LMS
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES (UPDATED) ================= */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-4xl font-extrabold text-blue-950 tracking-tight mb-4">Our Digital Learning Features</h3>
            <p className="text-gray-600">Our unified platform simplifies management and enhances learning for everyone.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BookOpen size={28} />} 
              title="Online Courses" 
              desc="Access structured lessons, resources, and digital content anytime." 
            />
            <FeatureCard 
              icon={<GraduationCap size={28} />} 
              title="Assignments & Exams" 
              desc="Submit assignments and take quizzes with real-time evaluation." 
            />
            <FeatureCard 
              icon={<BarChart3 size={28} />} 
              title="Performance Tracking" 
              desc="Monitor grades and academic progress throughout the year." 
            />
            <FeatureCard 
              icon={<MessageSquare size={28} />} 
              title="Parent Messaging" 
              desc="Strong communication between teachers and parents." 
            />
            <FeatureCard 
              icon={<Calendar size={28} />} 
              title="Academic Calendar" 
              desc="Stay informed with schedules, exams, and school events." 
            />
            <FeatureCard 
              icon={<Users size={28} />} 
              title="Role-Based Access" 
              desc="One login system for Students, Teachers, Parents, and Admin." 
            />
          </div>
        </div>
      </section>

      {/* ================= DYNAMIC ANNOUNCEMENTS ================= */}
      <section id="announcements" className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12 gap-4 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Bell className="text-blue-900" size={24}/>
              </div>
              <h3 className="text-4xl font-extrabold text-blue-950 tracking-tight">Latest Announcements</h3>
            </div>
            <span className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              {announcements.length} Recent Updates
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-16 text-gray-500 flex flex-col items-center gap-3 bg-white rounded-2xl shadow-sm border">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                Updating feed...
              </div>
            ) : announcements.length > 0 ? (
              announcements.map((item, index) => (
                <AnnouncementListItem 
                  key={item._id} 
                  item={item}
                  index={index}
                  onClick={() => setSelectedAnnouncement(item)} 
                />
              ))
            ) : (
              <div className="bg-white p-16 rounded-2xl shadow-sm text-center text-gray-500 border border-gray-100">
                <Bell size={40} className="mx-auto text-gray-300 mb-4"/>
                No public announcements at this time.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="contact" className="bg-[#050b1a] text-gray-400 pt-20 pb-10 border-t border-white/5">
        <div className="max-w-8xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="text-blue-500" size={32} />
                <span className="text-2xl font-bold text-white tracking-tight">Tsinseta Mariam</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                A leading senior secondary institution in Adigrat, dedicated to fostering innovation, 
                academic excellence, and digital literacy in the next generation of leaders.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                  <span className="text-xs font-bold uppercase">Fb</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all cursor-pointer">
                  <span className="text-xs font-bold uppercase">Tw</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all cursor-pointer">
                  <span className="text-xs font-bold uppercase">Yt</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-xs">Resources</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#about" className="hover:text-blue-400 transition-colors">About Our School</a></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors">LMS Dashboard</a></li>
                <li><a href="#announcements" className="hover:text-blue-400 transition-colors">Latest News</a></li>
                <li><Link to="/login" className="hover:text-blue-400 transition-colors">Student Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-xs">Contact Us</h4>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <div className="text-blue-500 mt-1 shrink-0">📍</div>
                  <p>Adigrat, Tigray, Ethiopia<br/><span className="text-xs opacity-60">Location</span></p>
                </div>
                <div className="flex gap-3">
                  <div className="text-blue-500 mt-1 shrink-0">✉️</div>
                  <p>info@xxxxxxx.edu.et</p>
                </div>
                <div className="flex gap-3">
                  <div className="text-blue-500 mt-1 shrink-0">📞</div>
                  <p>+251 9XX XXX XXX</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs opacity-50">
              © {new Date().getFullYear()} Tsinseta Mariam Senior Secondary School.
            </p>
            <div className="flex gap-6 text-xs opacity-50 italic">
              <span>Empowering Minds, Shaping Futures</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= ANNOUNCEMENT DETAIL MODAL ================= */}
      <AnnouncementModal 
        announcement={selectedAnnouncement} 
        onClose={() => setSelectedAnnouncement(null)} 
      />
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function NavLink({ href, children }) {
  return (
    <a href={href} className="hover:text-blue-800 transition duration-150 relative group py-1">
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-700 transition-all group-hover:w-full"></span>
    </a>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="text-blue-900 bg-blue-50 w-16 h-16 rounded-2xl mb-6 flex items-center justify-center border border-blue-100 group-hover:bg-blue-900 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h4 className="text-2xl font-bold text-blue-950 mb-3 tracking-tight">{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function AnnouncementListItem({ item, index, onClick }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer flex gap-5 items-center group"
    >
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1.5">
          <h5 className="font-semibold text-lg text-gray-900 group-hover:text-blue-900 transition-colors">
            {item.title}
          </h5>
          <div className="flex items-center gap-2 text-gray-400 text-xs font-medium shrink-0 ml-4 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
             <Clock size={13}/>
             {formatAppDate(item.publishedAt || item.createdAt)}
          </div>
        </div>
        <p className="text-gray-500 text-sm line-clamp-1 opacity-80">
          {item.contentHtml ? item.contentHtml.replace(/<[^>]*>?/gm, '') : ""}
        </p>
      </div>
      <div className="text-blue-300 group-hover:text-blue-700 group-hover:translate-x-1 transition-all">
        →
      </div>
    </motion.div>
  );
}

function AnnouncementModal({ announcement, onClose }) {
  return (
    <AnimatePresence>
      {announcement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100"
          >
            <div className="p-6 md:p-8 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 tracking-tight mb-2">
                  {announcement.title}
                </h2>
                <div className="flex items-center gap-5 text-sm text-gray-500">
                   <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border">
                     <Clock size={14}/>
                     {formatAppDate(announcement.publishedAt || announcement.createdAt)}
                   </div>
                   {announcement.createdBy && (
                     <div className="flex items-center gap-1.5">
                       <UserCircle size={16} className="text-blue-300"/>
                       <span>By: <span className="font-medium text-gray-700">{announcement.createdBy.name}</span></span>
                     </div>
                   )}
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              <div 
                className="prose prose-blue max-w-none prose-sm md:prose-base text-gray-700 leading-relaxed
                           prose-headings:text-blue-950 prose-headings:font-bold 
                           prose-p:mb-4 prose-li:my-1 prose-a:text-blue-700 prose-a:font-medium hover:prose-a:text-blue-800"
                dangerouslySetInnerHTML={{ __html: announcement.contentHtml }} 
              />
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button 
                    onClick={onClose}
                    className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-300 transition text-sm"
                >
                    Close
                </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}