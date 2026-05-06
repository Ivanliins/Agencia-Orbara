import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

type GalleryImage = {
  src: string;
  caption: string;
  tag?: string;
};

type ChartPoint = { month: string; value: number };

const CASES = {
  "casa-voltari": {
    client: "Voltari",
    segment: "Mobilidade Elétrica",
    period: "3 meses",
    result: "+138%",
    resultLabel: "em vendas online",
    title: "Do nicho ao mainstream da mobilidade elétrica",
    tagline:
      "Como posicionamos a Voltari como referência em motos elétricas, patinetes e ciclomotores — e mais que dobramos as vendas online em 3 meses.",
    challenge: {
      heading: "O desafio",
      body: "A Voltari vende motos elétricas, autopropelidos, patinetes e ciclomotores — um mercado em expansão acelerada, mas com muito ruído competitivo. O site existente não comunicava os diferenciais dos produtos, não ranqueava para os principais termos de pesquisa e as campanhas pagas consumiam orçamento sem retorno claro. O público certo não chegava até a marca, e quem chegava não convertia.",
    },
    strategy: {
      heading: "A estratégia",
      items: [
        {
          label: "Site com foco em produto e conversão",
          body: "Reconstruímos o site da Voltari com páginas dedicadas a cada categoria — motos elétricas, patinetes, ciclomotores e autopropelidos — com especificações técnicas claras, comparativos, galeria e CTAs diretos para compra e contato. Cada página foi pensada para converter o visitante que já pesquisou e quer decidir.",
        },
        {
          label: "SEO por categoria e intenção de compra",
          body: "Mapeamos os termos com maior volume e intenção transacional: 'moto elétrica [cidade]', 'patinete elétrico para adulto', 'ciclomotor elétrico preço', entre outros. Em 3 meses a Voltari ocupava a primeira página do Google para 9 dos 12 termos priorizados.",
        },
        {
          label: "Tráfego pago segmentado por perfil e produto",
          body: "Campanhas no Meta Ads e Google Ads segmentadas por faixa etária, comportamento de mobilidade urbana e interesse em sustentabilidade. Criativos mostravam os produtos em uso real — no trânsito, no dia a dia — gerando identificação imediata com o público-alvo.",
        },
        {
          label: "Remarketing e funil de decisão",
          body: "Implementamos remarketing para visitantes que visualizaram produtos sem comprar, com anúncios dinâmicos por categoria e sequência de e-mails automatizados com comparativos de modelos e benefícios — reduzindo o ciclo de decisão de semanas para dias.",
        },
      ],
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
        caption: "Moto elétrica Voltari — produto principal da linha",
        tag: "Produto",
      },
      {
        src: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=900&q=80",
        caption: "Patinetes e ciclomotores — categorias com alta demanda urbana",
        tag: "Produto",
      },
      {
        src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80",
        caption: "Criativos Meta Ads — produto em uso real no trânsito urbano",
        tag: "Anúncio",
      },
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
        caption: "Posição #1 no Google para 'moto elétrica' na região",
        tag: "SEO",
      },
    ] as GalleryImage[],
    timeline: [
      { month: "Mês 1", event: "Novo site no ar, campanhas ativas e SEO estruturado" },
      { month: "Mês 2", event: "+71% em vendas vs. período anterior; remarketing ativado" },
      { month: "Mês 3", event: "+138% em vendas online; Voltari na 1ª página para 9 termos-chave" },
    ],
    metrics: [
      { label: "Vendas online", before: "18/mês", after: "43/mês" },
      { label: "Taxa de conversão (site)", before: "0,8%", after: "3,4%" },
      { label: "Custo por venda (ads)", before: "R$ 390", after: "R$ 112" },
      { label: "Sessões orgânicas", before: "820/mês", after: "3.140/mês" },
    ],
    chartData: [
      { month: "Antes", value: 18 },
      { month: "Mês 1", value: 22 },
      { month: "Mês 2", value: 31 },
      { month: "Mês 3", value: 43 },
    ] as ChartPoint[],
    chartLabel: "Vendas online / mês",
    barData: [
      { label: "Vendas/mês", before: 18, after: 43 },
      { label: "Conversão %", before: 0.8, after: 3.4 },
      { label: "Sessões org. (÷100)", before: 8.2, after: 31.4 },
    ],
    siteUrl: "https://73b8d9f6-16d5-469e-9dc6-576d763c3f7a-00-2eivf1yw5xnkl.worf.replit.dev/",
    accent: "#ff5d00",
    bg: "#0d0101",
    fg: "#fffafa",
  },
  "camila-nogueira": {
    client: "Dra. Camila Nogueira — Advocacia",
    segment: "Direito · Família & Sucessões",
    period: "3 meses",
    result: "+91%",
    resultLabel: "em novos clientes/mês",
    title: "Autoridade digital dentro das normas da OAB",
    tagline:
      "Como construímos presença digital para um escritório de advocacia respeitando todas as restrições éticas e ainda assim gerando crescimento expressivo.",
    challenge: {
      heading: "O desafio",
      body: "A advocacia tem regras rígidas de publicidade impostas pelo Estatuto da OAB: sem promessas de resultado, sem depoimentos de clientes, sem impulsionamento de conteúdo jurídico. Isso limita severamente as táticas tradicionais. A Dra. Camila precisava crescer sem comprometer sua reputação ou correr riscos disciplinares.",
    },
    strategy: {
      heading: "A estratégia",
      items: [
        {
          label: "Site de autoridade com blog jurídico",
          body: "Desenvolvemos um site profissional com arquitetura de conteúdo baseada em educação: artigos explicativos sobre direito de família, guias sobre inventário e divórcio, e FAQs que respondem dúvidas reais — tudo dentro das normas da OAB.",
        },
        {
          label: "SEO local de alta intenção",
          body: "Focamos em termos como 'advogada divórcio [cidade]' e 'inventário extrajudicial [bairro]'. Em 3 meses o escritório alcançou a primeira página para 8 dos 10 termos priorizados.",
        },
        {
          label: "Google Ads em conformidade com a OAB",
          body: "Criamos campanhas no Google Search — única plataforma permitida pela OAB para impulsionamento — com anúncios informativos, sem promessas de resultado e com extensões de localização e ligação para maximizar o contato direto.",
        },
        {
          label: "Perfil Google Meu Negócio otimizado",
          body: "Completamos 100% do perfil, adicionamos perguntas e respostas frequentes, posts informativos semanais e gestão ativa das avaliações — gerando credibilidade e visibilidade local sem violar qualquer diretriz.",
        },
      ],
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80",
        caption: "Novo site com posicionamento de autoridade jurídica",
        tag: "Site",
      },
      {
        src: "https://images.unsplash.com/photo-1521791055366-0d553872952f?w=900&q=80",
        caption: "Blog jurídico com artigos educativos — tráfego orgânico crescente",
        tag: "Conteúdo",
      },
      {
        src: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=900&q=80",
        caption: "Anúncio Google Search informativo, em conformidade com OAB",
        tag: "Google Ads",
      },
      {
        src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80",
        caption: "Perfil Google Meu Negócio: de incompleto a referência local",
        tag: "GMB",
      },
    ] as GalleryImage[],
    timeline: [
      { month: "Mês 1", event: "Auditoria, site novo e configuração do Google Ads" },
      { month: "Mês 2", event: "Blog com 8 artigos publicados; perfil GMB otimizado" },
      { month: "Mês 3", event: "+91% em novos clientes; primeira página do Google alcançada" },
    ],
    metrics: [
      { label: "Novos clientes/mês", before: "4", after: "8" },
      { label: "Posição média no Google (termos-chave)", before: "Página 4+", after: "Página 1" },
      { label: "Visitas orgânicas/mês", before: "120", after: "890" },
      { label: "Taxa de agendamento (site)", before: "1,2%", after: "4,7%" },
    ],
    chartData: [
      { month: "Antes", value: 4 },
      { month: "Mês 1", value: 5 },
      { month: "Mês 2", value: 7 },
      { month: "Mês 3", value: 8 },
    ] as ChartPoint[],
    chartLabel: "Novos clientes / mês",
    barData: [
      { label: "Clientes/mês", before: 4, after: 8 },
      { label: "Visitas org. (÷10)", before: 12, after: 89 },
      { label: "Agendamento %", before: 1.2, after: 4.7 },
    ],
    accent: "#0d0101",
    bg: "#ff5d00",
    fg: "#0d0101",
  },
  "central-park": {
    client: "Estacionamento Central Park",
    segment: "Mobilidade Urbana",
    period: "2 meses",
    result: "+68%",
    resultLabel: "em ocupação mensal",
    title: "Do desconhecido ao ponto de referência da região",
    tagline:
      "Como um estacionamento local passou de invisível no mapa a líder de ocupação na região em apenas 60 dias.",
    challenge: {
      heading: "O desafio",
      body: "O Estacionamento Central Park estava operando com 40% de ocupação média, com vagas ociosas especialmente em horários de pico matinal e noturno. A visibilidade no Google Maps era quase nula — sem fotos, sem avaliações, sem presença em buscas por 'estacionamento próximo'. O boca a boca era a única fonte de clientes.",
    },
    strategy: {
      heading: "A estratégia",
      items: [
        {
          label: "Google Meu Negócio: do zero ao destaque",
          body: "Otimizamos completamente o perfil: fotos profissionais do espaço, horários corretos, categorias precisas, descrição com palavras-chave locais e gestão ativa de avaliações. Em semanas o estabelecimento aparecia no 'pacote local' do Google.",
        },
        {
          label: "Campanhas de geolocalização",
          body: "Campanhas no Google Ads e Meta Ads com raio de 3 km, segmentadas por horário de pico (8h–10h e 18h–20h) e por perfis de profissionais que trabalham na região. Criativos com mensagem de conveniência e segurança.",
        },
        {
          label: "Conteúdo de referência local",
          body: "Criamos conteúdo posicionando o Central Park como ponto de referência para quem frequenta a região: posts sobre eventos próximos, dicas de mobilidade, comparativo de opções de transporte. Isso gerou engajamento orgânico e shares locais.",
        },
        {
          label: "Programa de fidelidade digital",
          body: "Implementamos um sistema simples de fidelidade via WhatsApp: check-ins digitais com acúmulo de pontos e benefícios para clientes frequentes, aumentando a recorrência e gerando avaliações positivas organicamente.",
        },
      ],
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=900&q=80",
        caption: "Perfil Google Maps após otimização — fotos profissionais e 94 avaliações",
        tag: "Google Maps",
      },
      {
        src: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=900&q=80",
        caption: "Campanha Meta Ads com segmentação de 3 km e criativos de conveniência",
        tag: "Anúncio",
      },
      {
        src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=80",
        caption: "Central Park no top 3 do pacote local — buscas 'estacionamento próximo'",
        tag: "SEO Local",
      },
      {
        src: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=900&q=80",
        caption: "Programa de fidelidade via WhatsApp — check-in digital e acúmulo de pontos",
        tag: "Fidelidade",
      },
    ] as GalleryImage[],
    timeline: [
      { month: "Semana 1–2", event: "Otimização do perfil Google Maps e primeiras fotos" },
      { month: "Semana 3–4", event: "Campanhas geolocalizadas no ar; programa de fidelidade lançado" },
      { month: "Mês 2", event: "+68% em ocupação; vagas ociosas reduzidas em 70% no pico" },
    ],
    metrics: [
      { label: "Taxa de ocupação média", before: "40%", after: "67%" },
      { label: "Avaliações no Google", before: "12 (3,8★)", after: "94 (4,7★)" },
      { label: "Visibilidade em buscas locais", before: "Fora do top 10", after: "Top 3 no pacote local" },
      { label: "Clientes recorrentes", before: "22%", after: "51%" },
    ],
    chartData: [
      { month: "Antes", value: 40 },
      { month: "Sem 1–2", value: 44 },
      { month: "Sem 3–4", value: 53 },
      { month: "Mês 2", value: 67 },
    ] as ChartPoint[],
    chartLabel: "Ocupação média %",
    barData: [
      { label: "Ocupação %", before: 40, after: 67 },
      { label: "Avaliações", before: 12, after: 94 },
      { label: "Recorrência %", before: 22, after: 51 },
    ],
    accent: "#ff5d00",
    bg: "#0d0101",
    fg: "#fffafa",
  },
};

function GrowthChart({
  data,
  label,
  accent,
  bg,
  fg,
  barData,
}: {
  data: ChartPoint[];
  label: string;
  accent: string;
  bg: string;
  fg: string;
  barData: { label: string; before: number; after: number }[];
}) {
  const isDark = bg === "#0d0101";
  const gridColor = isDark ? "rgba(255,250,250,0.08)" : "rgba(13,1,1,0.10)";
  const tickColor = isDark ? "rgba(255,250,250,0.4)" : "rgba(13,1,1,0.45)";
  const tooltipBg = isDark ? "#1a0808" : "#fff4f0";

  const CustomTooltip = ({ active, payload, label: lbl }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-2xl px-4 py-3 shadow-xl text-sm font-bold"
          style={{ background: tooltipBg, color: fg, border: `1px solid ${accent}33` }}
        >
          <div className="opacity-50 text-xs font-semibold mb-1">{lbl}</div>
          <div style={{ color: accent }} className="text-lg font-black">
            {payload[0].value}
          </div>
          <div className="opacity-40 text-xs">{label}</div>
        </div>
      );
    }
    return null;
  };

  const gradientId = `grad-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Area chart — progression */}
      <div
        className="rounded-3xl p-6"
        style={{
          background: isDark ? "rgba(255,250,250,0.03)" : "rgba(13,1,1,0.04)",
          border: `1px solid ${gridColor}`,
        }}
      >
        <div className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: accent }}>
          Evolução
        </div>
        <div className="text-sm font-semibold mb-6 opacity-50" style={{ color: fg }}>
          {label}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accent} stopOpacity={0.4} />
                <stop offset="95%" stopColor={accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: tickColor, fontSize: 11, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: tickColor, fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: accent, strokeWidth: 1, strokeDasharray: "4 2" }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={accent}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              dot={{ fill: accent, strokeWidth: 0, r: 5 }}
              activeDot={{ r: 7, fill: accent, stroke: bg, strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart — before vs after */}
      <div
        className="rounded-3xl p-6"
        style={{
          background: isDark ? "rgba(255,250,250,0.03)" : "rgba(13,1,1,0.04)",
          border: `1px solid ${gridColor}`,
        }}
      >
        <div className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: accent }}>
          Antes & Depois
        </div>
        <div className="text-sm font-semibold mb-6 opacity-50" style={{ color: fg }}>
          Comparativo de métricas-chave
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: tickColor, fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: tickColor, fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: isDark ? "rgba(255,250,250,0.04)" : "rgba(13,1,1,0.04)" }}
              contentStyle={{
                background: tooltipBg,
                border: `1px solid ${accent}33`,
                borderRadius: "1rem",
                color: fg,
                fontWeight: 700,
                fontSize: 12,
              }}
            />
            <Bar dataKey="before" name="Antes" radius={[6, 6, 0, 0]}>
              {barData.map((_, i) => (
                <Cell key={i} fill={isDark ? "rgba(255,250,250,0.15)" : "rgba(13,1,1,0.15)"} />
              ))}
            </Bar>
            <Bar dataKey="after" name="Depois" radius={[6, 6, 0, 0]}>
              {barData.map((_, i) => (
                <Cell key={i} fill={accent} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-4 justify-center">
          <span className="flex items-center gap-1.5 text-xs font-bold opacity-50" style={{ color: fg }}>
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: isDark ? "rgba(255,250,250,0.25)" : "rgba(13,1,1,0.25)" }} />
            Antes
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: accent }}>
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: accent }} />
            Depois
          </span>
        </div>
      </div>
    </div>
  );
}

function Lightbox({
  images,
  startIndex,
  onClose,
  accent,
}: {
  images: GalleryImage[];
  startIndex: number;
  onClose: () => void;
  accent: string;
}) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setCurrent((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(13,1,1,0.95)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute -top-12 right-0 text-white opacity-60 hover:opacity-100 transition-opacity text-3xl font-bold leading-none"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>

        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "16/10" }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={images[current].src}
              alt={images[current].caption}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Tag badge */}
          {images[current].tag && (
            <div
              className="absolute top-4 left-4 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: accent, color: "#0d0101" }}
            >
              {images[current].tag}
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="mt-4 text-center">
          <p className="text-white font-medium opacity-75 text-sm">{images[current].caption}</p>
          <p className="text-white opacity-30 text-xs mt-1">
            {current + 1} / {images.length}
          </p>
        </div>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              className="absolute top-1/2 -left-14 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl opacity-50 hover:opacity-100 transition-opacity"
              style={{ background: "rgba(255,255,255,0.1)" }}
              onClick={prev}
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              className="absolute top-1/2 -right-14 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl opacity-50 hover:opacity-100 transition-opacity"
              style={{ background: "rgba(255,255,255,0.1)" }}
              onClick={next}
              aria-label="Próxima"
            >
              ›
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: i === current ? accent : "rgba(255,255,255,0.3)",
                  transform: i === current ? "scale(1.3)" : "scale(1)",
                }}
                aria-label={`Imagem ${i + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function CaseDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const c = CASES[slug as keyof typeof CASES];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  if (!c) {
    return (
      <div className="min-h-screen bg-[#0d0101] flex flex-col items-center justify-center px-4">
        <div className="font-black text-[#ff5d00] text-8xl mb-4">404</div>
        <div className="font-black text-[#fffafa] text-3xl mb-8">Case não encontrado.</div>
        <Link href="/">
          <span className="inline-block bg-[#ff5d00] text-[#0d0101] font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform cursor-pointer">
            Voltar ao início →
          </span>
        </Link>
      </div>
    );
  }

  const isDark = c.bg === "#0d0101";

  return (
    <div style={{ background: c.bg, color: c.fg }} className="min-h-screen">
      {/* Nav back */}
      <div className="px-6 md:px-12 pt-8">
        <Link href="/">
          <span
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            style={{ color: c.fg }}
          >
            ← Voltar
          </span>
        </Link>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="px-6 md:px-12 pt-12 pb-16 max-w-4xl mx-auto"
      >
        <div
          className="text-xs font-black uppercase tracking-[0.35em] mb-4 opacity-50"
          style={{ color: c.fg }}
        >
          {c.segment}
        </div>

        <h1
          className="font-black leading-[0.92] tracking-tight mb-6"
          style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", color: c.fg }}
        >
          {c.title}
        </h1>

        <p
          className="text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-10"
          style={{ color: c.fg, opacity: 0.7 }}
        >
          {c.tagline}
        </p>

        {/* Result highlight + site button */}
        <div className="flex flex-wrap items-end gap-4">
          <div
            className="inline-flex flex-col items-start gap-1 px-8 py-6 rounded-3xl"
            style={{ background: c.accent }}
          >
            <span
              className="font-black leading-none"
              style={{
                fontSize: "clamp(3rem, 8vw, 5rem)",
                color: c.accent === "#ff5d00" ? "#0d0101" : "#fffafa",
              }}
            >
              {c.result}
            </span>
            <span
              className="text-sm font-bold uppercase tracking-widest opacity-70"
              style={{ color: c.accent === "#ff5d00" ? "#0d0101" : "#fffafa" }}
            >
              {c.resultLabel} · {c.period}
            </span>
          </div>

          {"siteUrl" in c && c.siteUrl && (
            <motion.a
              href={c.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 font-black text-base px-7 py-5 rounded-3xl cursor-pointer transition-shadow"
              style={{
                background: "rgba(255,250,250,0.08)",
                color: c.fg,
                border: `2px solid rgba(255,250,250,0.18)`,
                backdropFilter: "blur(8px)",
                boxShadow: `0 0 0 0 ${c.accent}`,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 32px ${c.accent}55`;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = c.accent;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,250,250,0.18)";
              }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: c.accent }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5" stroke="#0d0101" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span>Visitar o site da Voltari</span>
            </motion.a>
          )}
        </div>
      </motion.div>

      {/* Divider */}
      <div className="w-full h-px opacity-10" style={{ background: c.fg }} />

      {/* Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-12 py-16 max-w-4xl mx-auto"
      >
        <h2
          className="font-black text-3xl md:text-4xl mb-6"
          style={{ color: c.accent }}
        >
          {c.challenge.heading}
        </h2>
        <p
          className="text-base md:text-lg font-medium leading-relaxed max-w-3xl"
          style={{ color: c.fg, opacity: 0.75 }}
        >
          {c.challenge.body}
        </p>
      </motion.div>

      {/* Divider */}
      <div className="w-full h-px opacity-10" style={{ background: c.fg }} />

      {/* Strategy */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-12 py-16 max-w-4xl mx-auto"
      >
        <h2
          className="font-black text-3xl md:text-4xl mb-10"
          style={{ color: c.accent }}
        >
          {c.strategy.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {c.strategy.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl p-7"
              style={{
                background: isDark
                  ? "rgba(255,250,250,0.04)"
                  : "rgba(13,1,1,0.06)",
                border: `1px solid ${isDark ? "rgba(255,250,250,0.08)" : "rgba(13,1,1,0.1)"}`,
              }}
            >
              <div
                className="text-xs font-black uppercase tracking-widest mb-3"
                style={{ color: c.accent }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                className="font-black text-lg mb-3"
                style={{ color: c.fg }}
              >
                {item.label}
              </h3>
              <p
                className="text-sm font-medium leading-relaxed"
                style={{ color: c.fg, opacity: 0.65 }}
              >
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Divider */}
      <div className="w-full h-px opacity-10" style={{ background: c.fg }} />

      {/* Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-12 py-16 max-w-4xl mx-auto"
      >
        <h2
          className="font-black text-3xl md:text-4xl mb-3"
          style={{ color: c.accent }}
        >
          Evidências visuais
        </h2>
        <p
          className="text-sm font-medium mb-10 opacity-50"
          style={{ color: c.fg }}
        >
          Crescimento real, dados reais
        </p>

        {/* Charts */}
        <div className="mb-10">
          <GrowthChart
            data={c.chartData}
            label={c.chartLabel}
            accent={c.accent}
            bg={c.bg}
            fg={c.fg}
            barData={c.barData}
          />
        </div>

        {/* Divider */}
        <div className="w-full h-px opacity-10 mb-10" style={{ background: c.fg }} />

        <p
          className="text-xs font-black uppercase tracking-widest mb-6 opacity-40"
          style={{ color: c.fg }}
        >
          Registros do projeto — clique para ampliar
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {c.gallery.map((img, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              onClick={() => setLightboxIndex(i)}
              className="group relative overflow-hidden rounded-2xl text-left focus:outline-none"
              style={{
                aspectRatio: "4/3",
                border: `1px solid ${isDark ? "rgba(255,250,250,0.08)" : "rgba(13,1,1,0.10)"}`,
              }}
              aria-label={`Ver imagem: ${img.caption}`}
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay on hover */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(13,1,1,0.85) 60%, transparent)" }}
              >
                <p className="text-white text-xs font-semibold leading-snug line-clamp-2">
                  {img.caption}
                </p>
              </div>

              {/* Tag */}
              {img.tag && (
                <div
                  className="absolute top-2 left-2 text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: c.accent, color: "#0d0101" }}
                >
                  {img.tag}
                </div>
              )}

              {/* Expand icon */}
              <div
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M7.5 1.5H10.5V4.5M4.5 10.5H1.5V7.5M10.5 1.5L6.5 5.5M1.5 10.5L5.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Divider */}
      <div className="w-full h-px opacity-10" style={{ background: c.fg }} />

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-12 py-16 max-w-4xl mx-auto"
      >
        <h2
          className="font-black text-3xl md:text-4xl mb-10"
          style={{ color: c.accent }}
        >
          Linha do tempo
        </h2>
        <div className="flex flex-col gap-0">
          {c.timeline.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="flex gap-6 items-start"
            >
              <div className="flex flex-col items-center" style={{ minWidth: "2rem" }}>
                <div
                  className="w-3 h-3 rounded-full mt-1 shrink-0"
                  style={{ background: c.accent }}
                />
                {i < c.timeline.length - 1 && (
                  <div
                    className="w-px flex-1 mt-1"
                    style={{ background: c.accent, opacity: 0.2, minHeight: "2rem" }}
                  />
                )}
              </div>
              <div className="pb-8">
                <div
                  className="text-xs font-black uppercase tracking-widest mb-1"
                  style={{ color: c.accent }}
                >
                  {step.month}
                </div>
                <p
                  className="text-base font-medium"
                  style={{ color: c.fg, opacity: 0.8 }}
                >
                  {step.event}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Divider */}
      <div className="w-full h-px opacity-10" style={{ background: c.fg }} />

      {/* Metrics before/after */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-12 py-16 max-w-4xl mx-auto"
      >
        <h2
          className="font-black text-3xl md:text-4xl mb-10"
          style={{ color: c.accent }}
        >
          Antes & Depois
        </h2>
        <div className="overflow-x-auto rounded-3xl" style={{ border: `1px solid ${isDark ? "rgba(255,250,250,0.08)" : "rgba(13,1,1,0.10)"}` }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: isDark ? "rgba(255,250,250,0.04)" : "rgba(13,1,1,0.04)" }}>
                <th
                  className="text-left px-6 py-4 font-black uppercase tracking-widest text-xs"
                  style={{ color: c.fg, opacity: 0.45 }}
                >
                  Métrica
                </th>
                <th
                  className="text-center px-6 py-4 font-black uppercase tracking-widest text-xs"
                  style={{ color: c.fg, opacity: 0.45 }}
                >
                  Antes
                </th>
                <th
                  className="text-center px-6 py-4 font-black uppercase tracking-widest text-xs"
                  style={{ color: c.accent }}
                >
                  Depois
                </th>
              </tr>
            </thead>
            <tbody>
              {c.metrics.map((m, i) => (
                <tr
                  key={i}
                  style={{
                    borderTop: `1px solid ${isDark ? "rgba(255,250,250,0.06)" : "rgba(13,1,1,0.06)"}`,
                  }}
                >
                  <td
                    className="px-6 py-5 font-semibold"
                    style={{ color: c.fg, opacity: 0.75 }}
                  >
                    {m.label}
                  </td>
                  <td
                    className="px-6 py-5 text-center font-bold"
                    style={{ color: c.fg, opacity: 0.4 }}
                  >
                    {m.before}
                  </td>
                  <td
                    className="px-6 py-5 text-center font-black text-base"
                    style={{ color: c.accent }}
                  >
                    {m.after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* CTA footer */}
      <div
        className="px-6 md:px-12 py-20 text-center"
        style={{
          background: isDark ? "rgba(255,93,0,0.06)" : "rgba(13,1,1,0.06)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="font-black leading-tight tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: c.fg }}
          >
            Quer resultados assim?
          </div>
          <p
            className="text-lg font-medium mb-10 max-w-md mx-auto"
            style={{ color: c.fg, opacity: 0.65 }}
          >
            Vamos conversar sobre o que a Orbara pode fazer pelo seu negócio.
          </p>
          <Link href="/#contato">
            <span
              className="inline-block font-black text-lg px-10 py-5 rounded-full hover:scale-105 transition-transform cursor-pointer shadow-lg"
              style={{
                background: c.accent,
                color: c.accent === "#ff5d00" ? "#0d0101" : "#fffafa",
                boxShadow: `0 8px 32px ${c.accent}44`,
              }}
            >
              Quero crescer →
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={c.gallery}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            accent={c.accent}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
