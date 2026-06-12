'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Heart, 
  Volume2, 
  VolumeX, 
  Music, 
  Copy, 
  Check, 
  Send, 
  Users, 
  Sparkles, 
  Gift,
  BookOpen,
  Info
} from 'lucide-react';

interface Wish {
  id: string;
  nama: string;
  status: 'hadir' | 'absen' | 'ragu';
  ucapan: string;
  waktu: string;
}

export default function WeddingInvitation() {
  // Navigation / Cover control
  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clipboard States for Gift Section
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Clipboard copies
  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(identifier);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  // RSVP Form States
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState<'hadir' | 'absen' | 'ragu'>('hadir');
  const [formWish, setFormWish] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guest Wishes list with standard initial entries
  const [wishes, setWishes] = useState<Wish[]>([
    {
      id: '1',
      nama: 'Budi Santoso & Keluarga',
      status: 'hadir',
      ucapan: 'Selamat menempuh hidup baru untuk Fhariz & Aisyah! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Dilancarkan semua persiapan hingga hari H. Amin.',
      waktu: '12 Juni 2026 - 08:30 WIB'
    },
    {
      id: '2',
      nama: 'Rina Herawati',
      status: 'hadir',
      ucapan: 'Selamat ya Aisyah dan Fhariz! Sangat terharu akhirnya kalian melangkah ke jenjang pernikahan. Insya Allah aku sekeluarga hadir ke Ciamis untuk merayakan kebahagiaan kalian!',
      waktu: '11 Juni 2026 - 19:45 WIB'
    },
    {
      id: '3',
      nama: 'Hendra Wijaya (Teman Kantor Fhariz)',
      status: 'ragu',
      ucapan: 'Selamat bro Fhariz! Semoga lancar akad dan resepsinya. Doa terbaik untuk rumah tangga barunya kelak. Semoga selalu diberkahi kebahagiaan berlimpah.',
      waktu: '11 Juni 2026 - 14:12 WIB'
    },
    {
      id: '4',
      nama: 'Siti Aminah',
      status: 'absen',
      ucapan: 'Barakallahu lakuma wa baraka \'alaikuma wa jama\'a bainakuma fii khair. Selamat Aisyah sayang, maaf sekali belum bisa hadir langsung karena dinas di luar pulau. Salam hangat dan doa terbaik dari jauh untuk kedua mempelai.',
      waktu: '10 Juni 2026 - 11:20 WIB'
    }
  ]);

  // Read guest query param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const to = searchParams.get('to');
      if (to) {
        setTimeout(() => {
          setGuestName(to);
        }, 0);
      }
      
      // Load saved wishes if any
      const saved = localStorage.getItem('fhariz_aisyah_wishes');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTimeout(() => {
              setWishes(parsed);
            }, 0);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Save wishes to local storage
  const saveWishes = (newWishes: Wish[]) => {
    setWishes(newWishes);
    localStorage.setItem('fhariz_aisyah_wishes', JSON.stringify(newWishes));
  };

  // Submit RSVP wishlist
  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formWish.trim()) return;

    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = `${now.getDate()} ${getMonthName(now.getMonth())} ${now.getFullYear()} - ${padZero(now.getHours())}:${padZero(now.getMinutes())} WIB`;

    // eslint-disable-next-line react-hooks/purity
    const newId = Date.now().toString();

    const newWish: Wish = {
      id: newId,
      nama: formName.trim(),
      status: formStatus,
      ucapan: formWish.trim(),
      waktu: formattedDate
    };

    setTimeout(() => {
      const updatedWishes = [newWish, ...wishes];
      saveWishes(updatedWishes);
      setFormName('');
      setFormWish('');
      setIsSubmitting(false);
    }, 800);
  };

  // Date helper
  const getMonthName = (monthIdx: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return months[monthIdx];
  };

  const padZero = (num: number) => num.toString().padStart(2, '0');

  // Countdown clock states
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  // Countdown targeting Sabtu, 4 Juli 2026 09:00 WIB
  useEffect(() => {
    const targetDate = new Date('2026-07-04T09:00:00+07:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds, isOver: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Play audio upon opening invitation
  const handleOpenInvitation = () => {
    setIsOpened(true);
    // Initialize audio client side
    if (!audioRef.current) {
      const audio = new Audio('/api/music');
      audio.loop = true;
      audioRef.current = audio;
    }
    
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((e) => console.log('Audio autoplay prevented, user interaction required.', e));

    // Force elegant scroll to top of actual content
    setTimeout(() => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log(e));
    }
  };

  const totalHadir = wishes.filter(w => w.status === 'hadir').length;
  const totalAbsen = wishes.filter(w => w.status === 'absen').length;
  const totalRagu = wishes.filter(w => w.status === 'ragu').length;

  return (
    <div className="relative min-h-screen bg-[#FCF9F5] text-[#2D2D2D] overflow-x-hidden selection:bg-[#F7F3EE] selection:text-[#2D2D2D]" id="top">
      {/* SYSTEM BACKGROUND MUSIC LAYER */}
      {/* Played natively via audioRef client-side */}

      {/* BACKGROUND FLOATING SPARKS BEAUTIFICATION */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[10%] left-[5%] w-3 h-3 bg-gold-300 rounded-full blur-[1px] animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[25%] right-[10%] w-4 h-4 bg-gold-200 rounded-full blur-[2px] animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-[50%] left-[8%] w-5 h-5 bg-gold-100 rounded-full blur-[3px] animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[75%] right-[15%] w-3 h-3 bg-gold-300 rounded-full blur-[1px] animate-float" style={{ animationDelay: '4.5s' }}></div>
        <div className="absolute top-[90%] left-[20%] w-4 h-4 bg-gold-200 rounded-full blur-[2px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* FLOATING MUSIC COMPONENT */}
      {isOpened && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMusic}
          id="music-toggle-btn"
          className="fixed bottom-6 right-6 z-50 p-4 bg-stone-900/90 text-gold-100 hover:text-white rounded-full shadow-xl flex items-center justify-center transition-all border border-gold-300/30 group backdrop-blur-md"
          title={isPlaying ? "Matikan Musik" : "Putar Musik"}
        >
          {isPlaying ? (
            <div className="relative">
              <Volume2 size={22} className="text-gold-200 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
              </span>
            </div>
          ) : (
            <VolumeX size={22} className="text-stone-400" />
          )}
        </motion.button>
      )}

      {/* FULL COVER SCREEN (SPLASH SCREEN-LIKE DOORWAY) */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="cover-screen"
            id="cover-screen"
            initial={{ opacity: 1 }}
            exit={{ y: '-100vh', opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className="fixed inset-0 z-50 w-full h-full flex flex-col justify-between bg-stone-950 text-stone-100 px-6 py-12 md:py-16 overflow-hidden"
          >
            {/* Elegant Background Image with Fade */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 pointer-events-none transition-transform duration-[12s]"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200')` }}
            />
            {/* Soft Radial Gold Overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-stone-950/90 pointer-events-none" />

            {/* Header Content */}
            <div className="relative z-10 text-center max-w-lg mx-auto" id="cover-header">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex items-center justify-center gap-2 mb-3"
              >
                <div className="h-[1px] w-8 bg-gold-400/50" />
                <span className="text-xs uppercase tracking-[0.25em] text-gold-300 font-medium">Walimatul Ursy</span>
                <div className="h-[1px] w-8 bg-gold-400/50" />
              </motion.div>
              <motion.h4 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="text-xs tracking-[0.15em] text-stone-300 uppercase italic font-sans"
              >
                Pernikahan Mulia & Suci Dari
              </motion.h4>
            </div>

            {/* Couple names big display */}
            <div className="relative z-10 text-center max-w-2xl mx-auto my-auto py-12" id="cover-couple">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.6 }}
                className="font-script text-7xl md:text-8xl text-gold-200 tracking-wide mb-4 select-none drop-shadow-md"
              >
                Fhariz & Aisyah
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.8 }}
                className="h-[1px] w-36 bg-gradient-to-r from-transparent via-gold-300 to-transparent mx-auto my-6"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 1.2, delay: 1 }}
                className="text-sm md:text-base text-stone-300 font-sans tracking-wide font-light max-w-sm mx-auto"
              >
                Sabtu, 4 Juli 2026
              </motion.p>
            </div>

            {/* Footer with guest parameter and Buka Undangan Action */}
            <div className="relative z-10 text-center max-w-lg mx-auto" id="cover-footer">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="bg-stone-900/70 backdrop-blur-md p-6 border border-[#C5A059]/40 shadow-xl max-w-sm mx-auto mb-8 rounded-none"
              >
                <p className="text-xs text-stone-400 tracking-[0.2em] uppercase mb-2 font-mono">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
                <h3 className="text-base md:text-lg font-serif font-medium text-[#FCF9F5] tracking-wide">
                  {guestName}
                </h3>
                <p className="text-[10px] text-stone-500 italic mt-2 font-sans">*Mohon maaf bila ada kesalahan penulisan nama/gelar</p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
                onClick={handleOpenInvitation}
                id="btn-buka-undangan"
                className="relative inline-flex items-center justify-center px-8 py-3.5 bg-[#C5A059] text-stone-950 font-semibold rounded-none text-xs tracking-[0.25em] uppercase hover:bg-[#FCF9F5] hover:text-stone-950 hover:border-[#C5A059] border border-[#C5A059] transition-all duration-300 group font-sans cursor-pointer overflow-hidden shadow-lg"
              >
                <Music size={14} className="mr-2 animate-pulse text-stone-950" />
                Buka Undangan
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WEBAPP CORE LAYOUT */}
      <main className="relative z-10 w-full" id="main-content">
        
        {/* BANNER / INTRO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 text-center border-b border-[#C5A059]/20 bg-[#FCF9F5] overflow-hidden">
          {/* Ambient organic patterns on margins */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#F7F3EE] to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FCF9F5] to-transparent pointer-events-none" />

          {/* Symmetrical Elegant Floral Corners */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8 w-24 h-24 md:w-36 md:h-36 opacity-25 border-t-2 border-l-2 border-[#C5A059] pointer-events-none" />
          <div className="absolute top-4 right-4 md:top-8 md:right-8 w-24 h-24 md:w-36 md:h-36 opacity-25 border-t-2 border-r-2 border-[#C5A059] pointer-events-none" />
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-24 h-24 md:w-36 md:h-36 opacity-25 border-b-2 border-l-2 border-[#C5A059] pointer-events-none" />
          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-24 h-24 md:w-36 md:h-36 opacity-25 border-b-2 border-r-2 border-[#C5A059] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-8 relative z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-[#C5A059] flex justify-center mb-2"
            >
              <Heart size={36} className="fill-[#C5A059]/10 stroke-[1.2]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <h2 className="text-[11px] md:text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold font-sans">Maha Suci Allah SWT</h2>
              <div className="font-script text-5xl md:text-7xl text-[#C5A059] select-none">Walimatul Ursy</div>
            </motion.div>

            {/* Quran / Wedding Quote */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto bg-[#F7F3EE] p-8 border border-[#C5A059]/30 shadow-md space-y-4 rounded-none"
              id="quran-quote-card"
            >
              <p className="text-[#2D2D2D] text-sm md:text-base leading-relaxed font-serif italic text-justify md:text-center">
                &quot;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.&quot;
              </p>
              <div className="h-[1px] w-20 bg-[#C5A059]/40 mx-auto" />
              <p className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest font-sans">— QS. Ar-rum: 21</p>
            </motion.div>

            {/* Scrolling Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 3, repeat: Infinity, duration: 2, repeatType: 'reverse' }}
              className="flex flex-col items-center justify-center pt-8 text-[11px] uppercase tracking-[0.2em] text-stone-500"
            >
              <span>Gulir ke bawah</span>
              <span className="block w-2.5 h-2.5 border-r border-b border-[#C5A059] rotate-45 mt-2 animate-bounce" />
            </motion.div>
          </div>
        </section>

        {/* BRIDE & GROOM PROFILE SECTION */}
        <section className="relative py-24 px-6 md:px-12 max-w-6xl mx-auto space-y-20 border-b border-[#C5A059]/10 overflow-hidden" id="couple-profiles-section">
          <div className="text-center space-y-3">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.8 }}
              className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block font-mono"
            >
              Mempelai Yang Berbahagia
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-serif text-[#2D2D2D] font-medium italic"
            >
              Kedua Mempelai
            </motion.h2>
            <div className="h-[1px] w-12 bg-[#C5A059] mx-auto mt-2" />
            <p className="text-[#2D2D2D]/80 text-xs md:text-sm font-sans max-w-md mx-auto leading-relaxed pt-2">
              Dengan memohon rahmat dan rida Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i dalam rangkaian acara pernikahan kami:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-x-12 lg:gap-x-24 relative" id="profiles-grid">
            {/* Center Decorative Amperstand "&" for big screens */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none select-none">
              <span className="font-script text-9xl text-[#C5A059]/10 font-semibold transform translate-y-3">&</span>
            </div>

            {/* Groom card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-100px' }}
              className="flex flex-col items-center text-center space-y-6 md:pr-6"
              id="groom-card"
            >
              {/* Couple visual frame */}
              <div className="relative group">
                <div className="absolute inset-0 bg-[#C5A059] rounded-full blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center bg-[#F7F3EE]">
                  <span className="font-serif text-5xl md:text-6xl text-[#C5A059] font-medium font-serif select-none">F</span>
                </div>
                <div className="absolute bottom-1 right-1 bg-[#C5A059] rounded-full p-2.5 text-stone-950 border-2 border-white shadow-sm">
                  <Heart size={16} className="fill-stone-950" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl md:text-3xl text-[#2D2D2D] font-semibold tracking-wide">Fhariz</h3>
              </div>

              <p className="text-[#2D2D2D]/80 text-sm max-w-xs font-serif leading-relaxed italic md:h-12 flex items-center justify-center">
                &quot;Melangkah dengan niat mulia, berkomitmen menjaga amanah sepanjang usia.&quot;
              </p>

              <div className="h-[1px] w-28 bg-[#C5A059]/20" />

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-widest block font-mono">Putra Dari</span>
                <p className="text-[#2D2D2D] text-sm font-semibold font-sans">Bapak Sarip Rodini</p>
                <p className="text-stone-500 text-xs font-medium font-sans">dan Ibu Suyatni</p>
                <p className="text-[#C5A059] text-[10px] uppercase tracking-wide pt-1 font-mono">Padaherang</p>
              </div>
            </motion.div>

            {/* Split Amperstand in Mobile mode */}
            <div className="flex md:hidden items-center justify-center text-center my-2">
              <span className="font-script text-5xl text-[#C5A059]">&</span>
            </div>

            {/* Bride card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-100px' }}
              className="flex flex-col items-center text-center space-y-6 md:pl-6"
              id="bride-card"
            >
              {/* Couple visual frame */}
              <div className="relative group">
                <div className="absolute inset-0 bg-[#C5A059] rounded-full blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center bg-[#F7F3EE]">
                  <span className="font-serif text-5xl md:text-6xl text-[#C5A059] font-medium font-serif select-none">A</span>
                </div>
                <div className="absolute bottom-1 right-1 bg-[#C5A059] rounded-full p-2.5 text-stone-950 border-2 border-white shadow-sm">
                  <Heart size={16} className="fill-stone-950" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl md:text-3xl text-[#2D2D2D] font-semibold tracking-wide">Aisyah</h3>
              </div>

              <p className="text-[#2D2D2D]/80 text-sm max-w-xs font-serif leading-relaxed italic md:h-12 flex items-center justify-center">
                &quot;Atas rida-Mu ya Allah, aku bertaut bersamanya merajut rida dunia akhirat.&quot;
              </p>

              <div className="h-[1px] w-28 bg-[#C5A059]/20" />

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-widest block font-mono">Putri Dari</span>
                <p className="text-[#2D2D2D] text-sm font-semibold font-sans">Bapak Aan Ambari</p>
                <p className="text-stone-500 text-xs font-medium font-sans">dan Ibu Imas Masitoh</p>
                <p className="text-[#C5A059] text-[10px] uppercase tracking-wide pt-1 font-mono">Banjarsari</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* COUNTDOWN TIME SHOWCASE */}
        <section className="relative py-20 px-6 bg-[#2D2D2D] text-white overflow-hidden" id="countdown-timer-section">
          {/* Accent decoration background */}
          <div className="absolute inset-0 bg-neutral-950/20 opacity-30 select-none pointer-events-none bg-grid-gold" />
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-neutral-950/40 to-transparent pointer-events-none opacity-40" />

          <div className="max-w-4xl mx-auto space-y-10 relative z-10 text-center">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold font-mono">Menghitung Hari Bahagia</span>
              <h2 className="text-2xl md:text-3xl font-serif text-[#FCF9F5] font-medium italic">Hitung Mundur Acara</h2>
              <p className="text-stone-300 text-xs font-sans max-w-md mx-auto select-none">Insya Allah pertalian suci diresmikan dalam hitungan waktu berikut:</p>
            </div>

            {/* Timers Container Grid */}
            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto" id="countdown-grid">
              {/* Days box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-md rounded-none p-3 md:p-6 border border-[#C5A059]/30 flex flex-col justify-center items-center shadow-md relative"
              >
                <span className="text-2xl md:text-5xl font-serif text-[#C5A059] font-semibold tracking-tight">{timeLeft.days}</span>
                <span className="text-[10px] md:text-xs uppercase text-stone-300 tracking-[0.1em] mt-2 font-mono">Hari</span>
              </motion.div>

              {/* Hours box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-md rounded-none p-3 md:p-6 border border-[#C5A059]/30 flex flex-col justify-center items-center shadow-md relative"
              >
                <span className="text-2xl md:text-5xl font-serif text-[#C5A059] font-semibold tracking-tight">{timeLeft.hours}</span>
                <span className="text-[10px] md:text-xs uppercase text-stone-300 tracking-[0.1em] mt-2 font-mono">Jam</span>
              </motion.div>

              {/* Minutes box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-md rounded-none p-3 md:p-6 border border-[#C5A059]/30 flex flex-col justify-center items-center shadow-md relative"
              >
                <span className="text-2xl md:text-5xl font-serif text-[#C5A059] font-semibold tracking-tight">{timeLeft.minutes}</span>
                <span className="text-[10px] md:text-xs uppercase text-stone-300 tracking-[0.1em] mt-2 font-mono">Menit</span>
              </motion.div>

              {/* Seconds box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-md rounded-none p-3 md:p-6 border border-[#C5A059]/30 flex flex-col justify-center items-center shadow-md relative"
              >
                <span className="text-2xl md:text-5xl font-serif text-[#C5A059] font-semibold tracking-tight animate-[pulse_1s_infinite]">{timeLeft.seconds}</span>
                <span className="text-[10px] md:text-xs uppercase text-stone-300 tracking-[0.1em] mt-2 font-mono">Detik</span>
              </motion.div>
            </div>

            {/* Action button: add to Google Calendar */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-2"
            >
              <a 
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Fhariz+%26+Aisyah&dates=20260704T020000Z/20260704T100000Z&details=Undangan+Pernikahan+Digital+Fhariz+%26+Aisyah.+Akad%3A+09%3A00+WIB%2C+Resepsi%3A+12%3A00+WIB.&location=Cibadak%2C+Banjarsari%2C+Kabupaten+Ciamis%2C+Jawa+Barat"
                target="_blank" 
                rel="noreferrer"
                id="btn-save-date"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#C5A059] hover:bg-[#B38F48] text-stone-950 rounded-none font-semibold text-xs tracking-wider uppercase font-sans transition-all hover:scale-105 active:scale-95 shadow-lg border border-[#C5A059]/40 cursor-pointer"
              >
                <Calendar size={14} className="stroke-[2]" />
                Simpan Tanggal di Kalender
              </a>
            </motion.div>
          </div>
        </section>

        {/* AGENDA / TANGGAL & LOKASI DETAIL SECTION */}
        <section className="relative py-24 px-6 md:px-12 bg-[#F7F3EE] border-b border-[#C5A059]/10" id="events-section">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block font-mono">Agenda Khidmat & Syukuran</span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#2D2D2D] font-medium italic">Tanggal & Lokasi Acara</h2>
              <div className="h-[1px] w-12 bg-[#C5A059] mx-auto mt-2" />
              <p className="text-[#2D2D2D]/80 text-xs md:text-sm font-sans max-w-md mx-auto leading-relaxed pt-2">
                Seluruh rangkaian acara bertempat di Kabupaten Ciamis dengan jadwal sesi yang diatur sebagai berikut:
              </p>
            </div>

            {/* Events Cards Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12" id="events-grid">
              
              {/* Event 1: Akad Nikah */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="bg-[#FCF9F5] rounded-none p-8 border border-[#C5A059]/25 shadow-md relative hover:shadow-xl hover:border-[#C5A059]/60 transition-all duration-300 flex flex-col justify-between group h-full"
                id="event-akad-card"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-[#F7F3EE] text-[#C5A059] p-3.5 border border-[#C5A059]/25 group-hover:bg-[#C5A059]/10 transition-all rounded-none">
                      <Heart className="w-6 h-6 stroke-[1.2] text-[#C5A059] fill-[#C5A059]/10" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider bg-[#FCF9F5] border border-[#C5A059]/25 px-3 py-1 rounded-none font-mono">Sesi 1</span>
                  </div>

                  <h3 className="font-serif text-2xl text-[#2D2D2D] font-semibold mb-2">Akad Nikah</h3>
                  <p className="text-xs text-[#C5A059] font-bold uppercase tracking-widest font-mono border-b border-[#C5A059]/10 pb-4 mb-4">Sabtu, 4 Juli 2026</p>

                  <ul className="space-y-4 pt-2">
                    <li className="flex items-start text-[#2D2D2D] text-sm">
                      <Clock size={16} className="text-[#C5A059] mr-3 mt-0.5 shrink-0" />
                      <div>
                        <span className="block font-semibold text-[#2D2D2D]">Waktu Acara</span>
                        <p className="text-[#2D2D2D]/80 font-sans mt-0.5">09.00 WIB - Selesai</p>
                        <p className="text-[11px] text-stone-400 italic mt-0.5">*Khusus keluarga & kerabat dekat</p>
                      </div>
                    </li>
                    <li className="flex items-start text-[#2D2D2D] text-sm">
                      <MapPin size={16} className="text-[#C5A059] mr-3 mt-0.5 shrink-0" />
                      <div>
                        <span className="block font-semibold text-[#2D2D2D]">Lokasi</span>
                        <p className="text-[#2D2D2D]/80 font-sans mt-0.5">Kediaman Mempelai Wanita</p>
                        <p className="text-[#2D2D2D]/70 font-sans text-xs mt-0.5 leading-relaxed">Cibadak, Banjarsari, Kabupaten Ciamis, Jawa Barat</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <a 
                    href="https://maps.app.goo.gl/w23ENUathCCT5EQL8" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#2D2D2D] hover:bg-stone-800 text-[#FCF9F5] rounded-none font-semibold text-xs tracking-wider uppercase transition-all shadow-sm font-mono cursor-pointer"
                  >
                    <MapPin size={13} />
                    Petunjuk Lokasi
                  </a>
                </div>
              </motion.div>

              {/* Event 2: Resepsi */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="bg-[#FCF9F5] rounded-none p-8 border border-[#C5A059] shadow-lg relative flex flex-col justify-between group h-full transition-all duration-300 ring-4 ring-[#C5A059]/10"
                id="event-resepsi-card"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-[#C5A059] text-stone-950 p-3.5 border border-[#C5A059] group-hover:bg-[#B38F48] transition-all rounded-none">
                      <Users className="w-6 h-6 stroke-[1.2]" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-stone-950 tracking-wider bg-[#C5A059] border border-[#C5A059] px-3 py-1 rounded-none font-mono">Sesi 2</span>
                  </div>

                  <h3 className="font-serif text-2xl text-[#2D2D2D] font-semibold mb-2">Resepsi</h3>
                  <p className="text-xs text-[#C5A059] font-bold uppercase tracking-widest font-mono border-b border-[#C5A059]/20 pb-4 mb-4">Sabtu, 4 Juli 2026</p>

                  <ul className="space-y-4 pt-2">
                    <li className="flex items-start text-[#2D2D2D] text-sm">
                      <Clock size={16} className="text-[#C5A059] mr-3 mt-0.5 shrink-0" />
                      <div>
                        <span className="block font-semibold text-[#2D2D2D]">Waktu Acara</span>
                        <p className="text-[#2D2D2D]/80 font-sans mt-0.5">12.00 WIB - 17.00 WIB</p>
                        <p className="text-[11px] text-stone-400 italic mt-0.5">*Tamu undangan umum & semua relasi</p>
                      </div>
                    </li>
                    <li className="flex items-start text-[#2D2D2D] text-sm">
                      <MapPin size={16} className="text-[#C5A059] mr-3 mt-0.5 shrink-0" />
                      <div>
                        <span className="block font-semibold text-[#2D2D2D]">Lokasi</span>
                        <p className="text-[#2D2D2D]/80 font-sans mt-0.5">Kediaman Mempelai Wanita</p>
                        <p className="text-[#2D2D2D]/70 font-sans text-xs mt-0.5 leading-relaxed">Cibadak, Banjarsari, Kabupaten Ciamis, Jawa Barat</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <a 
                    href="https://maps.app.goo.gl/w23ENUathCCT5EQL8" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#C5A059] hover:bg-[#B38F48] text-stone-950 font-bold rounded-none text-xs tracking-wider uppercase transition-all shadow-md font-mono cursor-pointer"
                  >
                    <MapPin size={13} />
                    Petunjuk Lokasi
                  </a>
                </div>
              </motion.div>

              {/* Event 3: Syukuran Pernikahan */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="bg-[#FCF9F5] rounded-none p-8 border border-[#C5A059]/25 shadow-md relative hover:shadow-xl hover:border-[#C5A059]/60 transition-all duration-300 flex flex-col justify-between group h-full"
                id="event-syukuran-card"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-[#F7F3EE] text-[#C5A059] p-3.5 border border-[#C5A059]/25 group-hover:bg-[#C5A059]/10 transition-all rounded-none">
                      <Sparkles className="w-6 h-6 stroke-[1.2]" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider bg-[#FCF9F5] border border-[#C5A059]/25 px-3 py-1 rounded-none font-mono">Syukuran</span>
                  </div>

                  <h3 className="font-serif text-2xl text-[#2D2D2D] font-semibold mb-2">Acara Syukuran</h3>
                  <p className="text-xs text-[#C5A059] font-bold uppercase tracking-widest font-mono border-b border-[#C5A059]/10 pb-4 mb-4">Senin, 6 Juli 2026</p>

                  <ul className="space-y-4 pt-2">
                    <li className="flex items-start text-[#2D2D2D] text-sm">
                      <Clock size={16} className="text-[#C5A059] mr-3 mt-0.5 shrink-0" />
                      <div>
                        <span className="block font-semibold text-[#2D2D2D]">Waktu Acara</span>
                        <p className="text-[#2D2D2D]/80 font-sans mt-0.5">10.00 WIB - Selesai</p>
                        <p className="text-[11px] text-stone-400 italic mt-0.5">*Keluarga & Tetangga terdekat</p>
                      </div>
                    </li>
                    <li className="flex items-start text-[#2D2D2D] text-sm">
                      <MapPin size={16} className="text-[#C5A059] mr-3 mt-0.5 shrink-0" />
                      <div>
                        <span className="block font-semibold text-[#2D2D2D]">Lokasi</span>
                        <p className="text-[#2D2D2D]/80 font-sans mt-0.5">Kediaman Mempelai Pria (Padaherang)</p>
                        <p className="text-[#2D2D2D]/70 font-sans text-xs mt-0.5 leading-relaxed">Padaherang, Kabupaten Pangandaran, Jawa Barat</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <a 
                    href="https://maps.app.goo.gl/4TFNHo3E8B7TWH9L7" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#2D2D2D] hover:bg-stone-800 text-[#FCF9F5] rounded-none font-semibold text-xs tracking-wider uppercase transition-all shadow-sm font-mono cursor-pointer"
                  >
                    <MapPin size={13} />
                    Petunjuk Lokasi
                  </a>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* MAP EMBED BLOCK */}
        <section className="relative py-2 pb-24 px-6 md:px-12 max-w-5xl mx-auto overflow-hidden text-center" id="map-embed-section">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-[#FCF9F5] rounded-none p-4 md:p-6 border border-[#C5A059]/30 shadow-md aspect-[16/9] min-h-[300px] md:min-h-[450px] w-full"
            id="map-card"
          >
            {/* Elegant Map Preview Placeholders or actual maps */}
            <iframe 
              src="https://maps.google.com/maps?q=-7.4927222,108.6166667&z=16&output=embed" 
              className="w-full h-full rounded-2xl border-0"
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer"
              title="Google Map Kediaman Mempelai"
            ></iframe>
          </motion.div>
        </section>

        {/* BRIDAL GIFT / AMPLOP DIGITAL SECTION */}
        <section className="relative py-24 px-6 md:px-12 bg-stone-950 text-stone-100 border-t border-b border-[#C5A059]/20 overflow-hidden" id="gift-section">
          <div className="absolute inset-0 bg-radial-gradient from-stone-900/40 to-stone-950 pointer-events-none" />
          <div className="absolute inset-0 bg-grid-gold opacity-10" />

          <div className="max-w-4xl mx-auto relative z-10 space-y-12 text-center md:px-4">
            <div className="space-y-4">
              <div className="inline-flex bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] p-3 rounded-none animate-pulse">
                <Gift size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#FCF9F5] font-semibold tracking-wide italic">Amplop Digital</h2>
              <p className="text-stone-300 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
                Kemudahan bagi keluarga, sahabat, dan kerabat yang ingin mengirimkan doa restu, hadiah, atau kado kepada kami secara langsung. 
              </p>
            </div>

            {/* General address for physical gifts */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-stone-900/60 border border-[#C5A059]/20 rounded-none p-6 max-w-xl mx-auto text-left flex items-start gap-4"
              id="gift-address-card"
            >
              <div className="bg-[#C5A059]/15 p-2.5 rounded-none text-[#C5A059] shrink-0">
                <Info size={18} />
              </div>
              <div className="space-y-1.5 font-sans">
                <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider block">Kirim Kado / Parcel Fisik</span>
                <p className="text-slate-200 text-xs leading-relaxed font-sans font-medium">
                  Kediaman Bapak Aan Ambari (Mempelai Wanita)<br />
                  Kp. Cibadak RT 02 / RW 04, Desa Cibadak, Kec. Banjarsari, Kabupaten Ciamis, Jawa Barat 46383
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleCopy("Kp. Cibadak RT 02 / RW 04, Desa Cibadak, Kec. Banjarsari, Kabupaten Ciamis, Jawa Barat 46383", "alamat")}
                    id="btn-copy-alamat"
                    className="inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-xs font-semibold cursor-pointer select-none"
                  >
                    {copiedAccount === 'alamat' ? (
                      <>
                        <Check size={12} className="text-green-400" />
                        <span className="text-green-400 font-semibold text-[11px]">Alamat Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span className="text-[11px] uppercase tracking-wide">Salin Alamat</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* RSVP & GUESTBOOK (UCAPAN DOA RESTU) */}
        <section className="relative py-24 px-6 md:px-12 bg-[#FCF9F5] border-b border-[#C5A059]/10" id="guestbook-section">
          {/* Subtle line decorations */}
          <div className="absolute top-0 right-0 w-44 h-44 opacity-25 border-t border-r border-[#C5A059] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-44 h-44 opacity-25 border-b border-l border-[#C5A059] pointer-events-none" />

          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block font-mono">Kolom Doa & Kehadiran</span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#2D2D2D] font-medium italic">Doa Restu & RSVP</h2>
              <div className="h-[1px] w-12 bg-[#C5A059] mx-auto mt-2" />
              
              {/* Literally requested statement */}
              <p className="text-[#2D2D2D] text-xs md:text-sm max-w-2xl mx-auto leading-relaxed pt-3 font-medium bg-[#F7F3EE] p-4 border border-[#C5A059]/30 rounded-none italic font-serif">
                &quot;Merupakan suatu kehormatan bagi kami atas kehadiran Bapak/Ibu sekalian. Silakan berikan doa restu serta pesan Anda pada kolom yang telah disediakan&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="guestbook-grid">
              
              {/* RSVP Form Column (5cols) */}
              <div className="lg:col-span-5" id="guestbook-form-card">
                <div className="bg-[#F7F3EE] rounded-none p-6 md:p-8 border border-[#C5A059]/30 shadow-md sticky top-6 space-y-6">
                  <div className="border-b border-[#C5A059]/10 pb-4">
                    <h3 className="font-serif text-xl text-[#2D2D2D] font-semibold">Konfirmasi Kehadiran</h3>
                    <p className="text-[11px] text-stone-500 font-sans mt-1">Silakan isi formulir di bawah ini untuk RSVP acara.</p>
                  </div>

                  <form onSubmit={handleSubmitWish} className="space-y-4">
                    {/* Name input */}
                    <div className="space-y-1.5">
                      <label htmlFor="nama-input" className="text-xs uppercase tracking-wider font-bold text-[#2D2D2D]/75 block font-mono">Nama Lengkap</label>
                      <input 
                        type="text" 
                        required
                        id="nama-input"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Contoh: Rian Hardianto"
                        className="w-full px-4 py-3 bg-[#FCF9F5] text-[#2D2D2D] border border-[#C5A059]/30 rounded-none text-xs font-sans focus:outline-none focus:border-[#C5A059] transition-all font-medium"
                      />
                    </div>

                    {/* Attendance Radio/Buttons */}
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-bold text-[#2D2D2D]/75 block font-mono">Status Kehadiran</label>
                      <div className="grid grid-cols-3 gap-2" id="attendance-status-selector">
                        <button
                          type="button"
                          onClick={() => setFormStatus('hadir')}
                          className={`py-2 px-3 rounded-none text-xs font-bold text-center border transition-all cursor-pointer font-mono ${
                            formStatus === 'hadir' 
                              ? 'bg-[#C5A059] text-stone-950 border-[#C5A059] shadow-sm' 
                              : 'bg-[#FCF9F5] text-[#2D2D2D]/80 border-[#C5A059]/20 hover:bg-[#F7F3EE]'
                          }`}
                        >
                          Hadir
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormStatus('ragu')}
                          className={`py-2 px-3 rounded-none text-xs font-bold text-center border transition-all cursor-pointer font-mono ${
                            formStatus === 'ragu' 
                              ? 'bg-[#C5A059] text-stone-950 border-[#C5A059] shadow-sm' 
                              : 'bg-[#FCF9F5] text-[#2D2D2D]/80 border-[#C5A059]/20 hover:bg-[#F7F3EE]'
                          }`}
                        >
                          Ragu
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormStatus('absen')}
                          className={`py-2 px-3 rounded-none text-xs font-bold text-center border transition-all cursor-pointer font-mono ${
                            formStatus === 'absen' 
                              ? 'bg-[#C5A059] text-stone-950 border-[#C5A059] shadow-sm' 
                              : 'bg-[#FCF9F5] text-[#2D2D2D]/80 border-[#C5A059]/20 hover:bg-[#F7F3EE]'
                          }`}
                        >
                          Absen
                        </button>
                      </div>
                    </div>

                    {/* Wish/Message text area */}
                    <div className="space-y-1.5">
                      <label htmlFor="ucapan-input" className="text-xs uppercase tracking-wider font-bold text-[#2D2D2D]/75 block font-mono">Doa Restu & Pesan</label>
                      <textarea 
                        required
                        id="ucapan-input"
                        rows={4}
                        value={formWish}
                        onChange={(e) => setFormWish(e.target.value)}
                        placeholder="Tuliskan doa restu, ucapan selamat, dan pesan tulus Anda untuk kedua mempelai di sini..."
                        className="w-full px-4 py-3 bg-[#FCF9F5] text-[#2D2D2D] border border-[#C5A059]/30 rounded-none text-xs font-sans focus:outline-none focus:border-[#C5A059] transition-all font-medium leading-relaxed resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="btn-kirim-doa"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#2D2D2D] hover:bg-stone-800 text-[#FCF9F5] rounded-none font-bold text-xs tracking-wider uppercase transition-all shadow-md group disabled:opacity-50 font-mono cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-none animate-spin" />
                      ) : (
                        <>
                          <Send size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          Kirim Doa Restu
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Wish list stream Column (7cols) */}
              <div className="lg:col-span-7 flex flex-col space-y-6" id="wishes-stream-column">
                
                {/* RSVP Attendance Stats header */}
                <div className="grid grid-cols-3 gap-2 text-center" id="rsvp-counters-grid">
                  <div className="bg-emerald-50/50 rounded-none py-3 px-2 border border-emerald-200/30 shadow-sm font-sans">
                    <span className="block text-2xl font-bold text-emerald-800">{totalHadir}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 font-mono">Akan Hadir</span>
                  </div>
                  <div className="bg-amber-50/50 rounded-none py-3 px-2 border border-amber-200/30 shadow-sm font-sans">
                    <span className="block text-2xl font-bold text-amber-800">{totalRagu}</span>
                    <span className="text-[10px] uppercase font-bold text-amber-600 font-mono">Masih Ragu</span>
                  </div>
                  <div className="bg-stone-100/50 rounded-none py-3 px-2 border border-stone-200/40 shadow-sm font-sans">
                    <span className="block text-2xl font-bold text-stone-800">{totalAbsen}</span>
                    <span className="text-[10px] uppercase font-bold text-stone-500 font-mono">Berhalangan</span>
                  </div>
                </div>

                {/* Wishes feed box */}
                <div className="bg-[#F7F3EE] rounded-none p-4 md:p-6 border border-[#C5A059]/30 shadow-inner flex flex-col gap-4 max-h-[580px] overflow-y-auto" id="wishes-feed-box">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#C5A059]/20">
                    <BookOpen size={16} className="text-[#C5A059]" />
                    <span className="text-xs uppercase tracking-wider font-bold text-[#2D2D2D]/85 font-mono">Aliran Doa Restu Guest ({wishes.length})</span>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {wishes.map((w) => (
                        <motion.div
                          key={w.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-[#FCF9F5] rounded-none p-4 md:p-5 border border-[#C5A059]/15 shadow-sm space-y-2 relative text-left"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="font-semibold text-sm text-[#2D2D2D] block font-sans">{w.nama}</span>
                              <span className="text-[10px] text-stone-400 font-mono">{w.waktu}</span>
                            </div>

                            {/* Status label tag */}
                            {w.status === 'hadir' && (
                              <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-none border border-emerald-200/30 font-mono">Hadir</span>
                            )}
                            {w.status === 'ragu' && (
                              <span className="text-[9px] uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-none border border-amber-200/30 font-mono">Ragu</span>
                            )}
                            {w.status === 'absen' && (
                              <span className="text-[9px] uppercase font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-none border border-stone-200/30 font-mono">Absen</span>
                            )}
                          </div>

                          <p className="text-[#2D2D2D]/80 text-xs leading-relaxed font-sans text-justify">
                            {w.ucapan}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* PROUD CLOSING / EXCELLENCE OUTRO */}
        <section className="relative py-24 px-6 md:px-12 text-center bg-[#2D2D2D] text-white overflow-hidden" id="outro-section">
          <div className="absolute inset-0 bg-neutral-950/20 opacity-30 select-none bg-grid-gold" />
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-neutral-950/35 to-transparent pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-[#C5A059] flex justify-center"
            >
              <Heart size={32} className="stroke-[1] animate-[pulse_2s_infinite] fill-[#C5A059]/10" />
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif text-[#FCF9F5] font-medium italic">Terima Kasih</h2>
              <p className="text-stone-300 text-xs md:text-sm max-w-md mx-auto leading-relaxed select-none font-sans font-light">
                Merupakan kebahagiaan dan kehormatan yang mendalam bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu bagi pernikahan kami. 
              </p>
            </div>

            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto" />

            <div className="space-y-1">
              <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold font-sans">Kami Yang Berbahagia,</p>
              <h3 className="font-script text-4xl text-[#C5A059] tracking-wider">Fhariz & Aisyah</h3>
              <p className="text-[10px] text-stone-500 italic mt-4">Kel. Besar Bapak Sarip Rodini & Kel. Besar Bapak Aan Ambari</p>
            </div>

            {/* Scroll back to top link */}
            <div className="pt-8">
              <a 
                href="#top" 
                id="btn-back-top"
                className="text-stone-500 hover:text-[#C5A059] text-xs uppercase tracking-widest font-sans transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                Kembali ke Atas
                <span className="block border-t border-l border-current w-1.5 h-1.5 rotate-45" />
              </a>
            </div>
          </div>
        </section>

        {/* SYSTEM CREATIVE CREDIT FOOTER */}
        <footer className="py-8 bg-stone-950 text-stone-600 text-[10px] text-center border-t border-stone-900 uppercase tracking-[0.15em] font-mono" id="main-footer">
          © 2026 Fhariz & Aisyah Wedding • Crafted by Ihsanudin Mubarok My Instagram ihsnmu
        </footer>

      </main>
    </div>
  );
}
