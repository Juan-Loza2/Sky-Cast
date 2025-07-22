import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Globe, Youtube, Twitter, Facebook, Cloud } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center">
            <img src="/images/ohmcba.png" alt="OHMC Logo" className="h-12 w-auto" />
          </div>
          <div className="flex gap-14 items-center">
            <a 
              href="https://ohmc.ar/"
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-5 hover:opacity-80 transition-all duration-300"
            >
              <Globe className="w-5 h-5 group-hover:scale-110" />
              <span className="font-medium text-base">Sobre el Observatorio</span>
            </a>
            <a 
              href="https://www.youtube.com/channel/UCRUIKHNDtWU8QtfDrTTVNnQ/featured"
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-5 hover:opacity-80 transition-all duration-300"
            >
              <Youtube className="w-5 h-5 group-hover:scale-110" />
              <span className="font-medium text-base">YouTube</span>
            </a>

            <a 
              href="https://x.com/HidroCordoba"
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-5 hover:opacity-80 transition-all duration-300"
            >
              <Twitter className="w-5 h-5 group-hover:scale-110" />
              <span className="font-medium text-base">Twitter</span>
            </a>

            <a 
              href="https://www.facebook.com/profile.php?id=100090514322441"
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-5 hover:opacity-80 transition-all duration-300"
            >
              <Facebook className="w-5 h-5 group-hover:scale-110" />
              <span className="font-medium text-base">Facebook</span>
            </a>
          </div>
          <div className="text-sm opacity-80">
            <span className="font-medium">© 2025 by Grupo Radar Córdoba</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
