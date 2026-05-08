import Link from 'next/link';
import { Coins, GitBranch, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  produto: [
    { label: 'Como Funciona', href: '/#como-funciona' },
    { label: 'Vantagens', href: '/#vantagens' },
  ],
  acesso: [
    { label: 'Cadastro de Aluno', href: '/cadastro' },
    { label: 'Cadastro de Empresa', href: '/cadastro' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Coins className="w-5 h-5 text-amber-950" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Moeda<span className="text-amber-400">Estudantil</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              Estimulando o reconhecimento do mérito estudantil através de uma
              moeda virtual. Conectando alunos, professores e empresas parceiras.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="mailto:contato@moedaestudantil.com"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="GitHub"
              >
                <GitBranch className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Produto
            </h4>
            <ul className="space-y-2">
              {footerLinks.produto.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Acesso
            </h4>
            <ul className="space-y-2">
              {footerLinks.acesso.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} MoedaEstudantil. Todos os direitos reservados.</p>
          <p>Desenvolvido com propósito educacional</p>
        </div>
      </div>
    </footer>
  );
}
