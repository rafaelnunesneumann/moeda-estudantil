'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Coins } from 'lucide-react';
import { AnimatedSection } from '@/components/shared/AnimatedSection';

export function CTASection() {
  return (
    <section className="py-28 bg-white">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-12 md:p-20 text-center shadow-2xl shadow-indigo-500/30">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-sm font-medium border border-white/20 backdrop-blur-sm"
              >
                <Coins className="w-4 h-4 text-amber-300" />
                Comece agora mesmo
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Pronto para fazer parte
                <br />
                do futuro da educação?
              </h2>

              <p className="text-indigo-200 text-lg leading-relaxed">
                Junte-se a alunos, professores e empresas que já estão usando o
                MoedaEstudantil para criar um ambiente de aprendizado mais motivador.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cadastro"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-bold border-0 text-base px-10 h-13 shadow-xl shadow-black/20 rounded-md transition-all"
                >
                  Criar conta gratuitamente
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <p className="text-indigo-300/70 text-sm">
                Gratuito. Sem compromisso. Configure em minutos.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
