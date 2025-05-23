import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MessageCircleMore,
  Users,
  Home,
  BedDouble,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';
import Logo from '../components/Logo';
import HeroImage from '../assets/hero.jpg';
import AssistantBot from '../components/AssistantBot';

const categories = [
  { name: 'Roommates', description: 'Match with UofT students looking for roommates', icon: Users },
  { name: 'Sublets', description: 'Browse temporary summer or semester sublets', icon: BedDouble },
  { name: 'Furniture Market', description: 'Buy and sell furniture with fellow students', icon: Home },
  { name: 'Long-Term Housing', description: 'Find permanent or year-long housing options', icon: BedDouble },
];

const useCases = [
  {
    title: 'Going on PEY or Exchange?',
    desc: 'List your space for the semester and make it work for you.',
    emoji: '🌍',
  },
  {
    title: 'Heading Home for the Summer?',
    desc: 'Sublet your room for a few months to a fellow student.',
    emoji: '✈️',
  },
  {
    title: 'Just Moved In?',
    desc: 'Browse gently-used desks, chairs, and kitchenware from students nearby.',
    emoji: '🪑',
  },
  {
    title: 'Graduated and Moving Home?',
    desc: 'List your long-term space or furniture for sale before heading out.',
    emoji: '🎓',
  },
];

const Button = ({ children, className = '', ...props }) => (
  <button
    className={`px-5 py-1.5 text-white rounded-md bg-uoft-blue hover:bg-blue-900 shadow-sm transition text-sm ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
  return (
    <div className="font-sans bg-[#f8f9fb] text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <header className="w-full sticky top-0 z-30 bg-gradient-to-tr from-[#e9f0fa] to-[#008AD8] dark:from-[#FFFFFF] dark:to-[#006199] shadow-sm backdrop-blur-sm flex items-center justify-between px-6 py-2 h-14">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <nav className="flex gap-6 text-sm font-medium text-gray-700 dark:text-gray-200 items-center">
          <Link to="/auth" className="hover:text-uoft-blue text-white dark:text-gray-300">Browse</Link>
          <a href="#how-it-works" className="hover:text-uoft-blue text-white dark:text-gray-300">How It Works</a>
          <a href="#about" className="hover:text-uoft-blue text-white dark:text-gray-300">About</a>
          <Link to="/auth">
            <button className="bg-blue-600 text-white dark:text-gray-300 text-sm px-4 py-2 rounded-md shadow hover:bg-blue-700 transition">
              Sign In
            </button>
          </Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-2 px-3 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="categories"
        className="relative min-h-[90vh] flex flex-col justify-center items-center text-center text-white bg-cover bg-center px-4"
        style={{
          backgroundImage: `url(${HeroImage})`
        }}
              >
        <div className="absolute inset-0 bg-black/30" />
        <motion.div
          className="relative z-10 max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Welcome to UofT Housing
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            A trusted platform to sublet, rent, and furnish your next home — made exclusively for UofT students.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map(({ name, description, icon: Icon }) => (
              <motion.div
                key={name}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to="/auth"
                  className="block bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-sm text-gray-800 dark:text-gray-100 shadow hover:shadow-xl transition flex flex-col items-center text-center"
                >
                  <Icon className="mb-3 text-uoft-blue dark:text-blue-300" size={28} />
                  <h3 className="font-semibold text-uoft-blue dark:text-blue-300 text-base">{name}</h3>
                  <p className="text-xs mt-1 text-gray-700 dark:text-white">{description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative bg-[#fffde7] dark:bg-[#B58B00] py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Explore Real-World Scenarios</h2>
          <div className="space-y-16">
            {[
              {
                emoji: '🌍',
                title: 'Going on PEY or Exchange?',
                desc: 'List your space for the semester and make it work for you.',
              },
              {
                emoji: '✈️',
                title: 'Heading Home for the Summer?',
                desc: 'Sublet your room for a few months to a fellow student.',
              },
              {
                emoji: '🪑',
                title: 'Just Moved In?',
                desc: 'Browse gently-used desks, chairs, and kitchenware from students nearby.',
              },
              {
                emoji: '🎓',
                title: 'Graduated and Moving Home?',
                desc: 'List your long-term space or furniture for sale before heading out.',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                className={`flex flex-col md:flex-row ${
                  idx % 2 === 1 ? 'md:flex-row-reverse' : ''
                } items-center gap-6`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Emoji */}
                <div className="text-5xl">{item.emoji}</div>

                {/* Text content */}
                <div className="max-w-md">
                  <h4 className="text-xl font-semibold text-uoft-blue dark:text-blue-300">{item.title}</h4>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="relative bg-purple-100 dark:bg-[#39254D] py-20 px-6 overflow-hidden">
  <div className="max-w-6xl mx-auto text-center">
  <div className="mb-10">
  <span className="inline-block text-xs tracking-wide text-blue-800 bg-blue-100 px-3 py-1 rounded-full font-semibold mb-2">
    🌟 Top Picks
  </span>
  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Listings</h2>
  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Student housing, roommates, and furniture</p>
  <div className="mt-4 inline-block bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200">
    🔐 <Link to="/auth" className="underline hover:text-yellow-900 font-medium">Sign in</Link> to unlock full access
  </div>
</div>


    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
      {[
        {
          title: 'Bright 1BR near St. George',
          type: 'Sublet',
          description: 'Furnished sublet available for summer. Includes utilities and Wi-Fi.',
          price: '$950/month',
          image: 'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        },
        {
          title: 'Shared Room in Annex',
          type: 'Roommates',
          description: 'Looking for a female roommate. Shared kitchen and bathroom.',
          price: '$675/month',
          image: 'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        },
        {
          title: 'Desk & Chair Set',
          type: 'Furniture Market',
          description: 'Minimalist wooden desk and ergonomic chair. Pick-up only.',
          price: '$80',
          image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        },
        {
          title: 'Full Apartment near Bloor',
          type: 'Long-Term Housing',
          description: '2-bedroom apartment steps from Bloor. Bright, modern, and close to transit.',
          price: '$1450/month',
          image: 'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        }       
      ].map((listing, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          viewport={{ once: true }}
          className="relative group rounded-2xl overflow-hidden shadow-md border border-gray-200 backdrop-blur-md bg-white dark:bg-gray-700"
        >
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-48 object-cover blur-md scale-105 group-hover:blur-sm transition duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Link
              to="/auth"
              className="bg-white/90 text-gray-800 px-4 py-2 text-sm font-semibold rounded-md shadow hover:bg-white transition"
            >
              🔒 Sign in to View
            </Link>
          </div>
          <div className="p-4 text-left">
            <span className="text-xs text-blue-700 font-bold">{listing.type}</span>
            <h4 className="mt-1 text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{listing.title}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{listing.description}</p>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-300 mt-2">{listing.price}</p>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="mt-10">
      <Link
        to="/auth"
        className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-full font-semibold shadow-md transition"
      >
        View All Listings →
      </Link>
    </div>
  </div>
</section>

      {/* How It Works - Timeline with Icons */}
      <section id="how-it-works" className="relative bg-[#ecfdf5] dark:bg-[#1d2b29] py-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="relative border-l-4 border-uoft-blue pl-10 space-y-10">
            {[ 
              { title: 'Sign Up', desc: 'Join using your @mail.utoronto.ca email for student verification.', icon: ClipboardList },
              { title: 'List or Explore', desc: 'Post your housing or furniture, or browse existing listings.', icon: Home },
              { title: 'Chat Securely', desc: 'Connect safely via integrated messaging with UofT peers.', icon: MessageCircleMore },
              { title: 'Finalize Deals', desc: 'Arrange meetups, close transactions, and move in confidently.', icon: ShieldCheck },
            ].map(({ title, desc, icon: Icon }, idx) => (
              <motion.div
                key={title}
                className="relative flex gap-4 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-uoft-blue text-white rounded-full p-2 mt-1">
                  <Icon className="text-white dark:text-blue-300" size={20} />
                </div>
                <div>
                <h4 className="text-lg font-semibold text-uoft-blue dark:text-blue-300">{title}</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#eef2f7] dark:bg-[#39254D] py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block mb-4 px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
              Made by Students for Students
            </div>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white leading-snug">
              UofT Housing is your trusted student platform
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-md leading-relaxed">
              From sublets and roommates to gently used furniture, we’re helping UofT students connect with their community for short-term and long-term housing needs. Only accessible via @mail.utoronto.ca.
            </p>
            <div className="mt-6">
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Info Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition p-5">
              <div className="flex items-center gap-3 mb-2">
                <Home size={20} className="text-uoft-blue dark:text-blue-300" />
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">100% UofT-Verified</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Only students with a @mail.utoronto.ca email can access the platform, ensuring safety and trust.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition p-5">
              <div className="flex items-center gap-3 mb-2">
                <BedDouble size={20} className="text-uoft-blue dark:text-blue-300" />
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">Student-Centric Listings</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Every listing is tailored for the UofT experience: 4-month sublets, roommates, and more.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl dark:bg-gray-800 shadow hover:shadow-md transition p-5 sm:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircleMore size={20} className="text-uoft-blue dark:text-blue-300" />
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">Built with Purpose</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We’re UofT students who know the struggle. This platform solves real housing issues with real student insight.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#008AD8] dark:bg-[#003959] text-white py-14 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {/* Logo + About */}
          <div>
            <Logo />
            <p className="mt-4 text-sm text-white dark:text-gray-300 max-w-sm leading-relaxed">
              UofT Housing is your verified platform to sublet, find roommates, and furnish your space — all within the trusted UofT student community.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white dark:text-gray-300">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#categories" className="hover:text-blue-700 text-white dark:text-gray-300 transition">Browse Listings</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-700 text-white dark:text-gray-300 transition">How It Works</a></li>
              <li><a href="#about" className="hover:text-blue-700 text-white dark:text-gray-300 transition">About</a></li>
              <li><Link to="/auth" className="hover:text-blue-700 text-white dark:text-gray-300 transition">Sign In</Link></li>
            </ul>
          </div>

          <div className="mt-4 text-xs text-white dark:text-gray-300">
              © 2025 UofT Housing. Built with purpose by students.
          </div>
        </div>
      </footer>
      <AssistantBot />
    </div>
  );
}
