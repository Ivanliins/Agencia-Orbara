/**
 * Conteúdo das páginas de serviço (/criacao-de-sites, /loja-virtual, /seo, /google-ads, /motion-graphics).
 *
 * Cada página é o destino de um grupo de anúncios: o título repete a busca do anúncio.
 * Só usamos afirmações que o site já faz em outros lugares (planos, FAQ, cases):
 * prazo de 3 a 5 dias para sites e os resultados originais de cada case.
 */
import type { WhatsAppSource } from "@/components/site/tokens";

export type ServiceSlug = "criacao-de-sites" | "loja-virtual" | "seo" | "google-ads" | "motion-graphics";

export type ServicePage = {
  slug: ServiceSlug;
  /** Nome curto usado em menus, breadcrumbs e JSON-LD. */
  name: string;
  serviceType: string;
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  h1: string;
  h1Accent: string;
  sub: string;
  chips: string[];
  waSource: WhatsAppSource;
  included: { title: string; desc: string }[];
  steps: { title: string; desc: string }[];
  pricing: { title: string; desc: string; plans?: boolean };
  /** Cases do site que comprovam o serviço (slugs de /cases) ou "motion" para os vídeos. */
  proof: { cases?: string[]; motion?: boolean };
  faq: { q: string; a: string }[];
};

const FIDELIDADE = {
  q: "Vocês trabalham com contrato de fidelidade?",
  a: "Não. Após o projeto inicial (site, setup de campanhas ou plano de SEO), o acompanhamento é mês a mês. Acreditamos que resultado é o único contrato que importa. Se não estivermos entregando, você tem toda a liberdade de encerrar.",
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "criacao-de-sites",
    name: "Criação de Sites",
    serviceType: "Criação de sites e landing pages",
    seoTitle: "Criação de Sites Profissionais e Landing Pages | Orbara",
    seoDescription:
      "Sites e landing pages rápidos, prontos para o Google e integrados ao WhatsApp. No ar em 3 a 5 dias, a partir de R$ 1.490 em até 6x. Diagnóstico grátis do seu site.",
    kicker: "Criação de sites e landing pages",
    h1: "Criação de sites profissionais",
    h1Accent: "que geram clientes.",
    sub: "Sites e landing pages rápidos no celular, prontos para o Google e integrados ao WhatsApp, pensados para transformar visita em pedido de orçamento.",
    chips: ["No ar em 3 a 5 dias", "A partir de R$ 1.490", "Em até 6x", "Sem fidelidade", "Diagnóstico grátis"],
    waSource: "sites",
    included: [
      { title: "Landing pages e sites institucionais", desc: "Uma página focada numa oferta ou o site completo da empresa. E-commerce e plataformas sob medida." },
      { title: "Texto que conduz ao contato", desc: "Copy pensada para a visita entender o que você faz, confiar e chamar." },
      { title: "Rápido no celular", desc: "Otimização de performance (Core Web Vitals) e layout feito primeiro para a tela pequena." },
      { title: "Pronto para o Google", desc: "SEO técnico de base: títulos, descrições, dados estruturados e site indexável." },
      { title: "WhatsApp, formulário e CRM", desc: "Contato a um toque, com mensagem pronta, e integração com as ferramentas que você usa." },
      { title: "Leads medidos", desc: "Configuração de Analytics e conversões para saber de onde vem cada contato." },
    ],
    steps: [
      { title: "Diagnóstico gratuito", desc: "Olhamos seu site atual (ou seu negócio, se ainda não tem site) e o que está travando os contatos." },
      { title: "Estratégia e estrutura", desc: "Definimos as páginas, a mensagem principal e o caminho até o contato." },
      { title: "Design e desenvolvimento", desc: "Layout exclusivo, texto e programação com foco em velocidade e conversão." },
      { title: "No ar em 3 a 5 dias", desc: "Publicação, integração com WhatsApp e medição de leads desde o primeiro dia." },
    ],
    pricing: {
      title: "Planos que cabem no momento da sua empresa",
      desc: "Parcelamento em até 6x. Projetos sob medida (e-commerce e plataformas) são orçados depois do diagnóstico.",
      plans: true,
    },
    proof: { cases: ["casa-voltari", "camila-nogueira", "central-park"] },
    faq: [
      {
        q: "Quanto custa um site?",
        a: "O plano Essencial (landing page otimizada) custa R$ 1.490 e o Aceleração R$ 2.995, ambos em até 6x. Projetos sob medida, como e-commerce e plataformas, são orçados depois do diagnóstico gratuito.",
      },
      {
        q: "Quanto tempo leva para o site ficar no ar?",
        a: "De 3 a 5 dias a partir da aprovação do briefing: o plano Essencial fica pronto em até 3 dias e o Aceleração, em até 5. E-commerce e plataformas sob medida têm o prazo definido na proposta.",
      },
      {
        q: "Já tenho um site. Vocês refazem ou otimizam?",
        a: "Depende do diagnóstico técnico e de conversão que fazemos gratuitamente. Em muitos casos, reconstruir do zero é mais rápido e eficiente. Em outros, uma otimização cirúrgica resolve. Apresentamos as duas opções com custo e projeção.",
      },
      FIDELIDADE,
    ],
  },
  {
    slug: "loja-virtual",
    name: "Loja Virtual",
    serviceType: "Criação de loja virtual (e-commerce)",
    seoTitle: "Criação de Loja Virtual Profissional para Vender Online | Orbara",
    seoDescription:
      "Loja virtual rápida no celular, com pagamento, frete e WhatsApp integrados, pronta para o Google e para anúncios. Orçamento depois do diagnóstico grátis.",
    kicker: "Criação de loja virtual",
    h1: "Criação de loja virtual",
    h1Accent: "pronta para vender.",
    sub: "Uma loja online rápida no celular, com pagamento, frete e WhatsApp integrados, pensada para transformar visita em pedido.",
    chips: ["Pagamento e frete integrados", "Rápida no celular", "Pronta para o Google", "Diagnóstico grátis"],
    waSource: "loja",
    included: [
      { title: "Loja completa", desc: "Vitrine, páginas de produto, carrinho e checkout, com a identidade da sua marca." },
      { title: "Pagamento e frete", desc: "Pix, cartão e boleto, e cálculo de frete integrados à loja." },
      { title: "Rápida no celular", desc: "A maioria das compras começa no celular: layout e performance pensados primeiro para a tela pequena." },
      { title: "Pronta para o Google", desc: "SEO de base nas categorias e produtos, com dados estruturados para aparecer nas buscas." },
      { title: "WhatsApp e atendimento", desc: "Botão de WhatsApp com mensagem pronta para tirar dúvidas antes da compra." },
      { title: "Vendas medidas", desc: "Analytics e conversões configurados para saber de onde vem cada venda." },
    ],
    steps: [
      { title: "Diagnóstico gratuito", desc: "Entendemos seus produtos, volume de pedidos e como você vende hoje." },
      { title: "Plataforma e estrutura", desc: "Escolhemos a plataforma certa para o seu momento e organizamos categorias e páginas." },
      { title: "Design e cadastro", desc: "Layout da loja, páginas de produto e integração de pagamento e frete." },
      { title: "Loja no ar", desc: "Publicação, testes de compra e medição de vendas desde o primeiro dia." },
    ],
    pricing: {
      title: "Orçamento sob medida",
      desc: "O valor depende do número de produtos, das integrações e da plataforma. Começamos pelo diagnóstico gratuito e mandamos a proposta com o prazo.",
    },
    proof: { cases: ["casa-voltari"] },
    faq: [
      {
        q: "Quanto custa uma loja virtual?",
        a: "Depende do número de produtos, das integrações (pagamento, frete, ERP) e da plataforma. Fazemos um diagnóstico gratuito e mandamos a proposta com valor e prazo.",
      },
      {
        q: "Quanto tempo leva para a loja ficar no ar?",
        a: "O prazo é definido na proposta, de acordo com o tamanho do catálogo e as integrações.",
      },
      {
        q: "Vocês também trazem clientes para a loja?",
        a: "Sim. Além de criar a loja, fazemos SEO e Google Ads para ela aparecer para quem já está procurando o que você vende.",
      },
      FIDELIDADE,
    ],
  },
  {
    slug: "seo",
    name: "SEO",
    serviceType: "Otimização para mecanismos de busca (SEO)",
    seoTitle: "Agência de SEO: Técnico, Local e Conteúdo | Orbara",
    seoDescription:
      "SEO técnico, local e de conteúdo para sua empresa aparecer no Google quando o cliente procura. Acompanhamento mês a mês, sem fidelidade. Diagnóstico grátis do seu site.",
    kicker: "SEO técnico, local e de conteúdo",
    h1: "SEO para empresas",
    h1Accent: "aparecerem quando o cliente procura.",
    sub: "Trabalhamos o site e o Perfil da Empresa no Google para você ser encontrado por quem já está buscando o seu serviço, sem pagar por clique.",
    chips: ["SEO técnico", "SEO local", "Sem fidelidade", "Diagnóstico grátis"],
    waSource: "seo",
    included: [
      { title: "Auditoria técnica", desc: "Indexação, velocidade, versão mobile e dados estruturados: o que impede o Google de entender seu site." },
      { title: "Palavras com intenção de compra", desc: "Mapeamos o que seu cliente digita quando está pronto para contratar, não só quando está curioso." },
      { title: "Otimização das páginas", desc: "Títulos, descrições, conteúdo e links internos alinhados a essas buscas." },
      { title: "SEO local", desc: "Perfil da Empresa no Google (antigo Google Meu Negócio) otimizado, presença no Maps, avaliações e dados da empresa iguais em toda a internet, para aparecer em \"perto de mim\" e nas buscas da sua cidade." },
      { title: "Conteúdo que atrai e converte", desc: "Páginas e artigos que respondem às dúvidas do seu cliente e levam ao contato." },
      { title: "Acompanhamento mês a mês", desc: "Ajustes contínuos com base no que o Google e os visitantes mostram." },
    ],
    steps: [
      { title: "Diagnóstico gratuito", desc: "Avaliamos o site e a presença no Google e mostramos o que corrigir primeiro." },
      { title: "Correções técnicas", desc: "Resolvemos o que trava indexação, velocidade e entendimento do Google." },
      { title: "Conteúdo e autoridade", desc: "Páginas e conteúdos para as buscas que trazem cliente." },
      { title: "Acompanhamento", desc: "Mês a mês, sem fidelidade, ajustando pelo que dá resultado." },
    ],
    pricing: {
      title: "Plano mensal, sem fidelidade",
      desc: "O valor depende do tamanho do site e da concorrência no seu mercado. Começamos pelo diagnóstico gratuito e mandamos a proposta.",
    },
    proof: { cases: ["camila-nogueira", "central-park"] },
    faq: [
      {
        q: "SEO demora mesmo? Vale o investimento?",
        a: "Os primeiros resultados aparecem em 3 a 4 meses. Resultados sólidos e competitivos chegam entre 6 e 12 meses. E a partir daí? O tráfego é seu — sem custo por clique.",
      },
      {
        q: "Qual a diferença entre SEO e Google Ads?",
        a: "O anúncio coloca você no topo desde os primeiros dias de campanha, mas para quando a verba acaba. O SEO leva meses para amadurecer e depois traz cliente sem custo por clique. Na maioria dos casos, os dois juntos funcionam melhor.",
      },
      {
        q: "Vocês fazem SEO local para negócios da minha cidade?",
        a: "Sim. Otimizamos o Perfil da Empresa no Google, o Maps e as páginas do site para as buscas da sua região, como \"perto de mim\" e \"serviço + cidade\". Foi o que levou o Estacionamento Central Park a +68% de ocupação em 2 meses.",
      },
      FIDELIDADE,
    ],
  },
  {
    slug: "google-ads",
    name: "Google Ads",
    serviceType: "Gestão de Google Ads e tráfego pago",
    seoTitle: "Gestão de Google Ads e Tráfego Pago para Empresas | Orbara",
    seoDescription:
      "Gestão de Google Ads com medição de leads, landing page dedicada e otimização contínua. Você paga a mídia direto ao Google e nos paga a gestão. Sem fidelidade.",
    kicker: "Gestão de Google Ads",
    h1: "Gestão de Google Ads",
    h1Accent: "que traz cliente, não só clique.",
    sub: "Campanhas de pesquisa para aparecer quando o cliente procura o seu serviço, com cada formulário e cada clique no WhatsApp medidos.",
    chips: ["Rede de Pesquisa", "Leads medidos", "Sem fidelidade", "Mídia paga direto ao Google"],
    waSource: "googleads",
    included: [
      { title: "Campanhas por serviço", desc: "Estrutura de pesquisa separada por serviço e intenção de compra." },
      { title: "Palavras-chave e negativas", desc: "Escolhidas e revisadas a partir dos termos de pesquisa reais da sua conta." },
      { title: "Anúncios e recursos", desc: "Anúncios responsivos, sitelinks, frases de destaque e demais recursos do Google." },
      { title: "Conversões medidas", desc: "Formulário e WhatsApp registrados no Google Ads para otimizar por lead, não por clique." },
      { title: "Landing page dedicada", desc: "Página com a mesma mensagem do anúncio, rápida no celular." },
      { title: "Otimização contínua", desc: "Acompanhamento do custo por lead, termos de pesquisa e lances." },
    ],
    steps: [
      { title: "Auditoria ou criação da conta", desc: "Revisamos o que já existe (ou montamos do zero) e o que está desperdiçando verba." },
      { title: "Medição primeiro", desc: "Conversões de formulário e WhatsApp configuradas antes de escalar." },
      { title: "Campanhas e página", desc: "Grupos por serviço, anúncios e landing page alinhados." },
      { title: "Otimização", desc: "Ajustes contínuos pelo custo por lead." },
    ],
    pricing: {
      title: "Você paga a mídia ao Google, e a gestão a nós",
      desc: "A verba de mídia vai direto para o Google. Trabalhamos com verbas a partir de R$ 1.500/mês em mídia: o mínimo para ter dados suficientes e otimizar de verdade.",
    },
    proof: { cases: ["casa-voltari", "camila-nogueira"] },
    faq: [
      {
        q: "Como funciona o Google Ads? A verba é separada?",
        a: "Sim. Você investe diretamente no Google (a verba de mídia) e nos paga pela gestão estratégica das campanhas. Trabalhamos com verbas a partir de R$1.500/mês em mídia. O mínimo garante volume de dados suficiente para otimização real.",
      },
      {
        q: "Quando começo a ver resultado no Google Ads?",
        a: "As primeiras semanas servem para calibrar o algoritmo e coletar dados reais do mercado. A partir do segundo mês, a campanha já está otimizada. Resultados consistentes e previsíveis acontecem entre o 60º e o 90º dia.",
      },
      FIDELIDADE,
    ],
  },
  {
    slug: "motion-graphics",
    name: "Motion Graphics",
    serviceType: "Motion graphics e vídeos animados",
    seoTitle: "Motion Graphics e Vídeos Animados para Empresas | Orbara",
    seoDescription:
      "Comerciais animados, vinhetas e vídeos para Reels, Stories e YouTube, entregues em 16:9 e 9:16. Veja os cases em vídeo e peça um orçamento.",
    kicker: "Motion graphics e vídeos animados",
    h1: "Motion graphics",
    h1Accent: "que prendem a atenção.",
    sub: "Comerciais, vinhetas, anúncios animados e conteúdo para redes, entregues nos formatos horizontal e vertical, prontos para site, YouTube, Reels e Stories.",
    chips: ["16:9 + 9:16", "Reels e Stories", "Comerciais animados", "Vinhetas"],
    waSource: "motion",
    included: [
      { title: "Comerciais animados", desc: "Vídeos curtos que explicam o seu serviço ou produto e terminam numa chamada clara." },
      { title: "Anúncios para redes", desc: "Versões para Reels, Stories e YouTube, com o começo pensado para segurar a atenção." },
      { title: "Vinhetas e aberturas", desc: "Logo animado e aberturas para vídeos, eventos e apresentações." },
      { title: "Dois formatos", desc: "Horizontal (16:9) e vertical (9:16) do mesmo projeto." },
      { title: "Roteiro e direção", desc: "Do texto à animação, com a mensagem e a marca do seu negócio." },
      { title: "Trilha e narração", desc: "Quando o projeto pede, entregamos com trilha e narração." },
    ],
    steps: [
      { title: "Briefing", desc: "Objetivo do vídeo, onde vai rodar e o que o público precisa entender." },
      { title: "Roteiro", desc: "Texto e sequência de cenas aprovados antes da animação." },
      { title: "Animação", desc: "Produção nos formatos combinados." },
      { title: "Entrega", desc: "Arquivos prontos para site, YouTube, Reels e Stories." },
    ],
    pricing: {
      title: "Orçamento por projeto",
      desc: "Depende da duração, da quantidade de formatos e da complexidade da animação. Mandamos o valor depois de entender o roteiro.",
    },
    proof: { motion: true },
    faq: [
      {
        q: "Em quais formatos vocês entregam?",
        a: "Horizontal (16:9) e vertical (9:16), prontos para site, YouTube, Reels e Stories.",
      },
      {
        q: "Quanto custa um vídeo animado?",
        a: "Depende da duração, do número de formatos e da complexidade da animação. Mandamos o orçamento depois de entender o roteiro.",
      },
    ],
  },
];

export const servicePage = (slug: string) => SERVICE_PAGES.find((s) => s.slug === slug);
