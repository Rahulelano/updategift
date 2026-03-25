import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function SectionTitle({ title, subtitle, children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
    >
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-muted-foreground text-sm">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}
