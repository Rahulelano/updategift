import { Link } from 'react-router-dom';
import { Gift, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">UpdateGifts</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed mb-4">
              Complete gift solution — 1000+ products, 50+ categories. Direct manufacturing to customer. Made in India.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'All Gifts', to: '/shop' },
                { label: 'Photo Frames', to: '/shop?category=Photo Frames' },
                { label: 'Home Decors', to: '/shop?category=Home Decors' },
                { label: 'MDF Gifts', to: '/shop?category=MDF Gifts' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-background/60 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {['My Account', 'Cart', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <a href="#" className="text-background/60 hover:text-primary transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-background/60">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                India — Direct Manufacturing
              </li>
              <li className="flex gap-3 text-sm text-background/60">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                +91 98765 43210
              </li>
              <li className="flex gap-3 text-sm text-background/60">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                support@updategifts.in
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-background/40">
          <p>© 2026 Update Gifts. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
