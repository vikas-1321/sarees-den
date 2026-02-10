import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    /* 🟤 Dark Brown Background with a Metallic Gold top border */
    <footer 
      style={{ backgroundColor: 'rgb(14 87 89); ' }} 
      className="text-[#F7E7CE] py-16 font-serif mt-auto border-t-[3px] border-[#D4AF37]"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          
          {/* 1. Brand Section: Pure Gold Heading */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#D4AF37] tracking-[0.2em] uppercase">
              SAREES DEN
            </h2>
            <p className="text-sm leading-relaxed opacity-90 text-[#F7E7CE]/80">
              Preserving the art of hand-woven elegance since 1995. We bring the 
              timeless gold-standard heritage of Indian looms to your wardrobe.
            </p>
            <div className="flex gap-6 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#D4AF37] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border-b border-[#D4AF37]/30 pb-1"
              >
                Instagram
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#D4AF37] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border-b border-[#D4AF37]/30 pb-1"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* 2. Navigation: Champagne Links with Gold Hover */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[#D4AF37] font-bold uppercase text-[10px] tracking-[0.3em] mb-6 opacity-80">
                Collections
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link to="/shop-all" className="hover:text-white transition-colors">Kanjeevaram</Link></li>
                <li><Link to="/shop-all" className="hover:text-white transition-colors">Banarasi Silk</Link></li>
                <li><Link to="/shop-all" className="hover:text-white transition-colors">Zari Work</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#D4AF37] font-bold uppercase text-[10px] tracking-[0.3em] mb-6 opacity-80">
                Experience
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link to="/" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Shipping</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Care Guide</Link></li>
              </ul>
            </div>
          </div>

          {/* 3. Newsletter: Gold Underline & Champagne Join */}
          <div className="space-y-6">
            <h4 className="text-[#D4AF37] font-bold uppercase text-[10px] tracking-[0.3em] opacity-80">
              The Registry
            </h4>
            <p className="text-sm text-[#F7E7CE]/80">
              Subscribe for exclusive access to gold-labeled drops and heritage stories.
            </p>
            <form 
              className="flex border-b border-[#D4AF37]/50 pb-2 focus-within:border-[#D4AF37] transition-colors"
              onSubmit={(e) => e.preventDefault()}
            >
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent w-full outline-none text-xs tracking-widest text-[#F7E7CE] placeholder:text-[#F7E7CE]/40 font-sans"
                required
              />
              <button 
                type="submit" 
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] hover:text-white transition-all"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* 4. Bottom Section: Muted Gold */}
        <div className="border-t border-[#D4AF37]/20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/50">
            © 2026 SAREES DEN.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/50">
            <Link to="/" className="hover:text-white">Privacy</Link>
            <Link to="/" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;