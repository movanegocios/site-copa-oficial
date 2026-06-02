// ============================================================
//  CONFIG.JS — Jogos do Brasil | Configurações Centrais
//  Edite aqui todas as informações da campanha sem tocar no
//  restante do código.
// ============================================================

const CONFIG = {

  // ----------------------------------------------------------
  // IDENTIDADE DA CAMPANHA
  // ----------------------------------------------------------
  campanha: {
    nome:      "COPA 2026",
    subtitulo: "A festa começa aqui",
    slogan:    "Prepare sua torcida para os Jogos do Brasil",
    descricao: "Combos especiais, delivery, retirada com desconto, reservas e promoções para torcer do seu jeito.",
    logoPath:  "logo.png",
    logoUrl:   "",
  },

  // ----------------------------------------------------------
  // TIPO DE CAMPANHA
  // "delivery" | "bar" | "hibrida"
  // ----------------------------------------------------------
  tipoCampanha: "hibrida",

  // ----------------------------------------------------------
  // BOTÃO VER CARDÁPIO
  // Aparece logo abaixo dos botões do cabeçalho/hero
  // e também no CTA final.
  // ----------------------------------------------------------
  cardapio: {
    enabled: true,
    texto: "🍽️ Ver cardápio",
    url: "https://seulinkdocardapio.com.br",
  },

  // ----------------------------------------------------------
  // BOTÕES PRINCIPAIS DO HERO
  // ----------------------------------------------------------
  botoes: {
    primario: {
      texto: "Pedir pelo WhatsApp",
      acao:  "whatsapp",
      link:  "",
      scroll:"#campanha",
      mensagemWhatsApp: "Olá! Vi a campanha dos Jogos do Brasil e quero fazer meu pedido ou reserva. 🇧🇷⚽",
    },
    secundario: {
      texto: "Ver promoções",
      acao:  "scroll",
      link:  "",
      scroll:"#combos-da-copa",
    },
  },

  // ----------------------------------------------------------
  // WHATSAPP
  // Coloque DDI + DDD + número, sem espaços ou símbolos.
  // Exemplo: 5541999999999
  // ----------------------------------------------------------
  whatsapp: {
    numero:   "5511916072188",
    mensagem: "Olá! Vi a promoção dos Jogos do Brasil e quero fazer meu pedido ou reserva. 🇧🇷⚽",
    tooltip:  "Peça ou reserve aqui! 👋",
  },

  // ----------------------------------------------------------
  // VELOCIDADE DO CARROSSEL SUPERIOR
  // Controle simples da velocidade dos jogos no topo.
  // Quanto maior o número, mais lento.
  // Quanto menor o número, mais rápido.
  // Exemplo: 18 = rápido | 22 = equilibrado | 35 = lento
  // ----------------------------------------------------------
  carousel: {
    speedSeconds: 22,
    minSpeedSeconds: 12,
    maxSpeedSeconds: 60,
  },

  // ----------------------------------------------------------
  // TEMPO DE TROCA DOS CARDS ANIMADOS DO HERO
  // 3500 = 3,5 segundos
  // ----------------------------------------------------------
  cardsRotationMs: 3500,

  // ----------------------------------------------------------
  // SEÇÕES DO SITE
  // true = mostra | false = esconde
  // ----------------------------------------------------------
  secoes: {
    mostrarComoTorcer: true,
    mostrarCombos: true,
    mostrarRetirada: true,
    mostrarBar: true,
    mostrarBolao: true,
    mostrarBolaoMesa: true,
    mostrarReels: true,
    mostrarReservas: true,
    mostrarRoleta: true,
    mostrarPromocoes: true,
    mostrarDuvidasObjecoes: true,
    mostrarPotencializacao: true,
  },

  // ----------------------------------------------------------
  // JOGOS DO DIA — alimenta o carrossel do header e formulários
  // ----------------------------------------------------------
  jogos: [
    { partida: "Brasil x Marrocos",  data: "13/06", hora: "19h" },
    { partida: "Brasil x Haiti",     data: "19/06", hora: "22h" },
    { partida: "Brasil x Escócia",   data: "24/06", hora: "16h" },
    { partida: "Brasil x Argentina", data: "30/06", hora: "20h" },
    { partida: "Brasil x Alemanha",  data: "05/07", hora: "17h" },
    { partida: "Brasil x Marrocos",  data: "13/06", hora: "19h" },
    { partida: "Brasil x Haiti",     data: "19/06", hora: "22h" },
    { partida: "Brasil x Escócia",   data: "24/06", hora: "16h" },
    { partida: "Brasil x Argentina", data: "30/06", hora: "20h" },
    { partida: "Brasil x Alemanha",  data: "05/07", hora: "17h" },
  ],

  // ----------------------------------------------------------
  // VÍDEO DE INTRODUÇÃO ESTILO NETFLIX
  // enabled: true = exibe introdução | false = pula direto
  // videoType: "youtube" | "external" | "local"
  // ----------------------------------------------------------
  intro: {
    enabled:   false,
    videoType: "youtube",
    youtube:   "dQw4w9WgXcQ",
    external:  "",
    local:     "video/intro.mp4",
    skipText:  "Pular introdução →",
    durationMs: 8000,
  },

  // ----------------------------------------------------------
  // VÍDEO PRINCIPAL DO HERO / CABEÇALHO VISUAL
  // type: "youtube" | "external" | "local"
  // ----------------------------------------------------------
  video: {
    type:     "external",
    youtube:  "",
    external: "https://www.pexels.com/pt-br/download/video/7039916/",
    local:    "video/campanha.mp4",
    poster:   "",
  },

  // ----------------------------------------------------------
  // MODELO DE MÍDIA PARA QUALQUER CARD
  //
  // Para imagem:
  // media: { type: "image", src: "img/foto.jpg" }
  //
  // Para YouTube:
  // media: { type: "youtube", src: "ID_DO_VIDEO" }
  //
  // Para vídeo local:
  // media: { type: "local", src: "video/arquivo.mp4", poster: "img/poster.jpg" }
  //
  // Para vídeo externo direto:
  // media: { type: "external", src: "https://site.com/video.mp4" }
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // CARDS ANIMADOS SOBRE O VÍDEO HERO
  // Todos aceitam imagem, vídeo local, externo ou YouTube.
  // ----------------------------------------------------------
  cards: [
    {
      titulo:  "Combo Jogo Completo",
      texto:   "Demonstração de oferta pronta para vender antes do jogo",
      selo:    "🔥 Mais Vendido",
      media: {
        type: "image",
        src: "https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg",
      },
    },
    {
      titulo:  "Delivery Inteligente",
      texto:   "Pedido direto no WhatsApp com mensagem pronta",
      selo:    "⚡ Rápido",
      media: {
        type: "image",
        src: "https://images.pexels.com/photos/10679779/pexels-photo-10679779.jpeg",
      },
    },
    {
      titulo:  "Promoção da Copa",
      texto:   "Ações para criar urgência e aumentar pedidos",
      selo:    "🇧🇷 Exclusivo",
      media: {
        type: "image",
        src: "https://www.burgerfi.com/wp-content/uploads/2025/02/burgerfi_fries_and_burgers-1.webp",
      },
    },
    {
      titulo:  "Retirada com Desconto",
      texto:   "Estratégia para reduzir fila e aumentar margem",
      selo:    "⭐ Premium",
      media: {
        type: "image",
        src: "https://gestion.pe/resizer/v2/4HDNBYT5TFFOVHDFFLOYZODCKY.JPEG?auth=b2bc88849d5262d26992de74db8e713ee3082ad3a65c2c6866ec87b26e84718b&width=6000&height=4000&quality=75&smart=true",
        poster: "",
      },
    },
    {
      titulo:  "Kit Torcedor",
      texto:   "Modelo de combo para grupos, famílias e delivery",
      selo:    "🎁 Novidade",
      media: {
        type: "image",
        src: "https://www.pizzaprime.com.br/img/combos/Combo_Extra.webp",
      },
    },
  ],

  // ----------------------------------------------------------
  // SEÇÃO: ESCOLHA COMO QUER TORCER
  // Todos os cards aceitam mídia.
  // Para abrir modal:
  // modal: "reserva"
  // modal: "bolao"
  // ----------------------------------------------------------
  formasTorcer: [
    {
      titulo: "Pedidos para casa",
      texto: "Mostre combos e ofertas para o cliente pedir antes da bola rolar, sem depender apenas de post solto.",
      icone: "🏠",
      acao: "whatsapp",
      botao: "Quero isso no meu delivery",
      mensagemWhatsApp: "Olá! Quero pedir para assistir aos Jogos do Brasil em casa.",
      media: {
        type: "image",
        src: "https://images.pexels.com/photos/23224693/pexels-photo-23224693.jpeg",
      },
    },
    {
      titulo: "Retirada no balcão",
      texto: "Crie uma oferta para o cliente pedir pelo WhatsApp, retirar na loja e economizar taxa de entrega.",
      icone: "🛍️",
      acao: "scroll",
      botao: "Ver estratégia de retirada",
      scroll: "#retire-e-ganhe",
      media: {
        type: "image",
        src: "https://www.prazeresdamesa.com.br/wp-content/uploads/2026/01/Da-Mooca-Pizza-Shop_Balcao-de-Pizzas_Mario-Rodrigues-scaled.jpg",
      },
    },
    {
      titulo: "Reserva de mesa",
      texto: "Ideal para bares e restaurantes com telão que querem organizar mesas, grupos e horários antes do jogo.",
      icone: "🍻",
      acao: "scroll",
      botao: "Ver reserva inteligente",
      modal: "reserva",
      tipoEspecial: "reserva",
      scroll: "#reservas",
      media: {
        type: "image",
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS7mehTdT8iOoW7sB46m2y-1Rn5j110_q6og&s",
      },
    },
    {
      titulo: "Ação promocional",
      texto: "Use bolão promocional sem aposta em dinheiro para gerar interação, pedidos e retorno ao WhatsApp.",
      icone: "🏆",
      acao: "scroll",
      botao: "Ver bolão demonstrativo",
      modal: "bolao",
      tipoEspecial: "bolao",
      scroll: "#bolao-do-hexa",
      media: {
        type: "external",
        src: "https://www.pexels.com/pt-br/download/video/35117254/",
      },
    },
  ],

  // ----------------------------------------------------------
  // SEÇÃO: COMBOS DA COPA
  // Todos aceitam mídia.
  // ----------------------------------------------------------
  combos: [
    {
      titulo: "Combo Sofá da Copa",
      descricao: "Exemplo de combo pronto para vender no delivery antes do jogo.",
      precoOriginal: "R$ 89,90",
      precoPromocional: "R$ 69,90",
      selo: "Mais pedido",
      botao: "Quero um combo assim",
      mensagemWhatsApp: "Olá! Quero criar combos como este para vender nos Jogos do Brasil.",
      media: {
        type: "image",
        src: "https://cdn.nsite.com.br/imgcache/6295/520x/uploads/6295/product/photo_66d0f0f99a69c.jpg.webp",
      },
    },
    {
      titulo: "Combo Galera",
      descricao: "Modelo de oferta para grupos, mesas grandes, famílias e amigos assistindo juntos.",
      precoOriginal: "R$ 149,90",
      precoPromocional: "R$ 119,90",
      selo: "Para grupo",
      botao: "Quero vender para grupos",
      mensagemWhatsApp: "Olá! Quero uma campanha para vender combos para grupos nos Jogos do Brasil.",
      media: {
        type: "image",
        src: "https://img.uenicdn.com/image/upload/v1544801901/category/shutterstock_571691737.jpg",
      },
    },
    {
      titulo: "Combo Pré-Jogo",
      descricao: "Oferta para incentivar pedidos antecipados e reduzir correria no horário da partida.",
      precoOriginal: "R$ 79,90",
      precoPromocional: "R$ 59,90",
      selo: "Antes do jogo",
      botao: "Quero pedidos antecipados",
      mensagemWhatsApp: "Olá! Quero uma campanha para incentivar pedidos antecipados antes dos jogos.",
      media: {
        type: "image",
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCoe1wskE1KiRVR0jjy-XLYAotCmy-H5iWPg&s",
        poster: "img/combo-pre-jogo.jpg",
      },
    },
    {
      titulo: "Combo Gol do Brasil",
      descricao: "Modelo de promoção relâmpago para criar urgência, comentários e chamadas no WhatsApp.",
      precoOriginal: "",
      precoPromocional: "Oferta relâmpago",
      selo: "Gol do Brasil",
      botao: "Quero essa ação",
      mensagemWhatsApp: "Olá! Quero ser avisado sobre a promoção Gol do Brasil.",
      media: {
        type: "image",
        src: "https://i.pinimg.com/736x/ef/fe/49/effe49984d1c16f0ce9713d8164c43f7.jpg",
      },
    },
    {
      titulo: "Combo Retirada",
      descricao: "Estratégia para aumentar retirada no balcão, reduzir taxa de entrega e melhorar margem.",
      precoOriginal: "R$ 74,90",
      precoPromocional: "R$ 64,90",
      selo: "Retirada",
      botao: "Quero retirada com desconto",
      mensagemWhatsApp: "Olá! Quero pedir para retirada com desconto nos Jogos do Brasil.",
      media: {
        type: "image",
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRMVIp41Qy35TUrzwOjiNwFKPrn52_CtO7wQ&s",
      },
    },
  ],

  // ----------------------------------------------------------
  // SEÇÃO: RETIRE E GANHE
  // ----------------------------------------------------------
  retirada: {
  enabled: true,
  titulo: "Retire e Ganhe",
  texto: "Mostre ao cliente uma vantagem clara para pedir pelo WhatsApp e retirar no balcão: menos fila, mais agilidade e uma condição especial para aumentar sua margem.",
  botao: "Quero retirar com desconto",
  cardapioTexto: "🍽️ Ver demonstração do cardápio",
  mensagemWhatsApp: "Olá! Quero fazer meu pedido para retirada com desconto na campanha dos Jogos do Brasil.",
    beneficios: [
      {
        icone: "💸",
        titulo: "Aumente retirada",
        texto: "Leve mais clientes para retirar no balcão e reduza dependência de entrega.",
      },
      {
        icone: "🛵",
        titulo: "Melhore a margem",
        texto: "A retirada ajuda a reduzir custos e pode tornar a operação mais previsível.",
      },
      {
        icone: "⏱️",
        titulo: "Pedidos antecipados",
        texto: "Incentive o cliente a pedir antes do jogo e diminua correria no pico.",
      },
      {
        icone: "🇧🇷",
        titulo: "Oferta fácil de entender",
        texto: "Uma chamada simples ajuda o cliente a decidir rápido e chamar no WhatsApp.",
      },
    ],
  },

  // ----------------------------------------------------------
  // SEÇÃO: BARES, RESTAURANTES E TELÃO
  // Todos os cards do bar aceitam mídia.
  // ----------------------------------------------------------
  bar: {
    enabled: true,
    titulo: "Vai assistir no bar?",
    descricao: "Demonstração para bares e restaurantes transformarem jogos em reservas, grupos, consumo e novos clientes no WhatsApp.",
    mensagemWhatsApp: "Olá! Quero saber como a campanha de reservas e promoções pode funcionar no meu bar ou restaurante.",

    beneficios: [
      {
        icone: "📅",
        titulo: "Reserva de mesa",
        texto: "Organize grupos e horários antes da partida para chegar com mesas mais previsíveis.",
        media: {
          type: "image",
          src: "https://images.pexels.com/photos/14853491/pexels-photo-14853491.jpeg",
        },
      },
      {
        icone: "🍺",
        titulo: "Combos para mesa",
        texto: "Crie ofertas para grupos consumirem mais durante o jogo.",
        media: {
          type: "image",
          src: "https://cdnm.westwing.com.br/glossary/uploads/br/2015/09/10145558/Balde-de-cerveja-com-gelo-e-garrafas-de-cerveja-c-a2534.jpg",
        },
      },
      {
        icone: "🍟",
        titulo: "Porção da Torcida",
        texto: "Sugestões de consumo compartilhado para aumentar ticket médio.",
        media: {
          type: "external",
          src: "https://www.pexels.com/pt-br/download/video/36126541/",
          poster: "",
        },
      },
      {
        icone: "⚽",
        titulo: "Gol Premiado",
        texto: "Ações rápidas para gerar movimento e interação durante a partida.",
        media: {
          type: "image",
          src: "https://www.robertotranjan.com.br/wp-content/uploads/10-p1-placar.jpg",
        },
      },
      {
        icone: "🏆",
        titulo: "Bolão da Mesa",
        texto: "Palpites promocionais sem aposta em dinheiro para engajar clientes.",
        media: {
          type: "image",
          src: "https://s2-ge.glbimg.com/5SPe-orFG7iBLQp_TyeWQ0b4pmY=/0x0:496x495/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2022/o/M/jsPoQWTvuJC1z2RQB2yQ/bolao-eptv.png",
        },
      },
    ],

    cardPrincipal: {
      titulo: "Garanta reservas antes da bola rolar",
      texto: "Use a campanha para organizar mesas, grupos e chamadas no WhatsApp antes dos jogos do Brasil.",
      icone: "🏟️",
      botaoReserva: "Ver reserva funcionando",
      botaoWhatsApp: "Quero isso no meu bar",
      mensagemWhatsApp: "Olá! Quero uma campanha com reserva de mesa para meu bar ou restaurante.",
      media: {
        type: "image",
        src: "https://blog.connectplug.com.br/wp-content/uploads/2018/05/group-friends-eating-together-1024x683.jpg",
      },
    },
  },

  // ----------------------------------------------------------
  // SEÇÃO: RESERVAS
  // Agora a reserva aparece como card e abre modal.
  // O card aceita mídia.
  // ----------------------------------------------------------
  reservas: {
    enabled: true,
    titulo: "Reserva inteligente para bares e restaurantes",
    descricao: "Informe jogo, horário e quantidade de pessoas. O desconto da reserva será calculado automaticamente.",

    card: {
      titulo: "Reserva com desconto automático",
      texto: "Demonstração de como o cliente escolhe jogo, horário e quantidade de pessoas antes de chamar no WhatsApp.",
      selo: "Reserva inteligente",
      icone: "📅",
      botao: "Ver reserva funcionando",
      metas: [
        "Desconto por grupo",
        "WhatsApp automático",
        "Pronto para planilha",
      ],
      media: {
        type: "image",
        src: "https://www.unileverfoodsolutions.com.br/dicas-e-servicos/seu-negocio/mesa-compartilhada/jcr:content/parsys/set1/row2/span12/image.img.jpg/1723034794559.jpg",
      },
    },
  },

  // ----------------------------------------------------------
  // REGRAS DE DESCONTO DA RESERVA
  // ----------------------------------------------------------
  reservationDiscounts: [
    {
      minPeople: 1,
      maxPeople: 2,
      discount: 0,
      label: "Sem desconto",
    },
    {
      minPeople: 3,
      maxPeople: 5,
      discount: 5,
      label: "5% de desconto para grupo",
    },
    {
      minPeople: 6,
      maxPeople: 10,
      discount: 10,
      label: "10% de desconto para galera",
    },
    {
      minPeople: 11,
      maxPeople: 999,
      discount: 15,
      label: "15% de desconto especial",
    },
  ],

  // ----------------------------------------------------------
  // SEÇÃO: BOLÃO PROMOCIONAL
  // Importante: não é aposta em dinheiro.
  // É uma ação promocional vinculada a pedido ou reserva.
  //
  // O bolão agora aparece como CARD.
  // Ao clicar, abre modal com 2 combos participantes.
  // Depois libera o formulário do palpite.
  // ----------------------------------------------------------
  bolao: {
    enabled: true,
    titulo: "Bolão Online",
    descricao: "Escolha um combo participante, envie seu palpite antes da bola rolar e concorra a um prêmio especial da casa.",
    premioPrincipal: "Combo grátis",
    abrirWhatsApp: true,

    card: {
      titulo: "Bolão Online",
      texto: "Peça um dos combos participantes, envie seu palpite e participe da promoção pelo site ou WhatsApp.",
      selo: "Participação promocional",
      icone: "🏆",
      botao: "Participar do bolão",
      metas: [
        "Sem aposta em dinheiro",
        "Válido com pedido",
        "Prêmio especial",
      ],
      media: {
        type: "image",
        src: "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2022/12/18/1544462202-taca-copa-do-mundo.png",
      },
    },

    combosParticipantes: [
      {
        titulo: "Combo Sofá da Copa",
        descricao: "Pizza grande + refrigerante + acompanhamento para assistir em casa.",
        precoOriginal: "R$ 89,90",
        precoPromocional: "R$ 69,90",
        media: {
          type: "image",
          src: "https://placehold.co/700x440/003399/FFD700?text=Combo+Sofa",
        },
      },
      {
        titulo: "Combo Galera",
        descricao: "2 pizzas ou 4 burgers + bebida. Ideal para grupo de amigos.",
        precoOriginal: "R$ 149,90",
        precoPromocional: "R$ 119,90",
        media: {
          type: "image",
          src: "https://placehold.co/700x440/009c3b/FFD700?text=Combo+Galera",
        },
      },
    ],

    regras: [
      "Participação válida apenas para quem pediu um dos combos participantes.",
      "A participação deve ser feita antes do início do jogo.",
      "Acertou o placar exato: concorre ao prêmio principal.",
      "Acertou o vencedor: pode ganhar cupom ou benefício menor.",
      "A promoção pode variar conforme a loja.",
      "Essa ação é promocional e não envolve aposta em dinheiro.",
    ],

    jogos: [
      { partida: "Brasil x Marrocos",  data: "13/06", hora: "19h" },
      { partida: "Brasil x Haiti",     data: "19/06", hora: "22h" },
      { partida: "Brasil x Escócia",   data: "24/06", hora: "16h" },
      { partida: "Brasil x Argentina", data: "30/06", hora: "20h" },
      { partida: "Brasil x Alemanha",  data: "05/07", hora: "17h" },
    ],
  },


  // ----------------------------------------------------------
  // SEÇÃO: BOLÃO DA MESA — PRESENCIAL COM GARÇOM
  // Segundo bolão separado do bolão online.
  // Envia tipoBolao: "presencial_mesa" para WhatsApp, n8n e Apps Script.
  // ----------------------------------------------------------
bolaoMesa: {
    enabled: true,
    kicker: "🍺 Bolão presencial por comanda",
    titulo: "Bolão da Mesa",
    descricao: "Comprou um combo participante no bar? Preencha seu palpite pelo celular, informe mesa e comanda e acompanhe a torcida. O palpite fica pendente até a equipe conferir a comanda.",
    premioPrincipal: "Combo especial da casa",
    abrirWhatsApp: true,
    maxPalpitesPorMesa: 2,
    bloquearMinutosAntes: 10,
    anoBase: 2026,
    storageKey: "movaBolaoMesaClienteControleV1",
    statusInicial: "pendente_validacao",
    validacao: "manual_por_comanda",
    regraOperacional: "max_2_palpites_por_mesa_validacao_por_comanda",

    card: {
      titulo: "Comprou combo? Envie seu palpite",
      texto: "Cada mesa/comanda pode registrar até 2 palpites. O combo precisa estar marcado na comanda para o palpite ser validado pela casa.",
      selo: "Presencial no bar",
      icone: "🍺",
      botao: "Enviar palpite da mesa",
      metas: [
        "2 palpites por mesa",
        "Validação por comanda",
        "Até 10 min antes do jogo",
      ],
      media: {
        type: "image",
        src: "https://cdnm.westwing.com.br/glossary/uploads/br/2015/09/10145558/Balde-de-cerveja-com-gelo-e-garrafas-de-cerveja-c-a2534.jpg",
      },
    },

    painel: {
      selo: "Como funciona",
      titulo: "Seu palpite fica organizado e seguro",
      texto: "O garçom marca o combo na comanda e avisa que você ganhou direito ao palpite. Você preenche pelo celular e a equipe confere depois se o combo participante está registrado na comanda.",
      comboTitulo: "Combo Balde da Torcida",
      comboDescricao: "Balde de cerveja + porção para compartilhar na mesa. Cada combo participante libera o direito de participar conforme as regras da casa.",
      botao: "Participar do Bolão da Mesa",
      passos: [
        {
          titulo: "1. Peça o combo participante",
          texto: "O garçom marca o combo na comanda da sua mesa."
        },
        {
          titulo: "2. Preencha pelo celular",
          texto: "Informe nome, WhatsApp, mesa, comanda, combo e palpite."
        },
        {
          titulo: "3. Aguarde a validação",
          texto: "O palpite entra como pendente e a casa valida conferindo a comanda."
        }
      ]
    },

    combosParticipantes: [
      {
        titulo: "Combo Balde da Torcida",
        descricao: "Balde com 6 cervejas + porção da casa para compartilhar na mesa.",
        valor: "Consulte no bar"
      },
      {
        titulo: "Combo Mesa Campeã",
        descricao: "Balde de cerveja + batata ou porção participante da promoção.",
        valor: "Consulte no bar"
      },
      {
        titulo: "Combo Gol da Mesa",
        descricao: "Bebida + porção para grupos que estão assistindo ao jogo no estabelecimento.",
        valor: "Consulte no bar"
      }
    ],

    regras: [
      "Cada mesa/comanda pode registrar no máximo 2 palpites por jogo.",
      "O palpite só pode ser enviado até 10 minutos antes do início do jogo.",
      "O cliente preenche o palpite pelo celular após comprar um combo participante.",
      "O combo precisa estar marcado na comanda da mesa.",
      "O registro entra como pendente de validação e o estabelecimento confere pela comanda.",
      "Essa ação é promocional e não envolve aposta em dinheiro."
    ],

    modalDescricao: "Comprou um combo participante? Preencha seus dados, informe mesa e comanda, envie seu palpite e aguarde validação do estabelecimento.",

    jogos: [
      { partida: "Brasil x Marrocos",  data: "13/06", hora: "19h" },
      { partida: "Brasil x Haiti",     data: "19/06", hora: "22h" },
      { partida: "Brasil x Escócia",   data: "24/06", hora: "16h" },
      { partida: "Brasil x Argentina", data: "30/06", hora: "20h" },
      { partida: "Brasil x Alemanha",  data: "05/07", hora: "17h" },
    ],
  },

  // ----------------------------------------------------------
  // SEÇÃO: REELS DA CAMPANHA
  // type: "local" | "external" | "youtube" | "image"
  // Cada reel pode ter um produto para aparecer no card de zoom.
  // ----------------------------------------------------------
  reelsConfig: {
    speedSeconds: 28,
  },

  reels: [
    {
      title: "Promoção especial",
      type: "external",
      src: "https://www.pexels.com/pt-br/download/video/35636124/",
      description: "Exemplo de criativo curto para divulgar a campanha nas redes.",
      ctaText: "Ver oferta no WhatsApp",
      whatsappMessage: "Olá! Vi o reel da campanha e quero saber mais sobre as ofertas dos Jogos do Brasil.",
      produto: {
        nome: "Combo Sofá da Copa",
        imagem: "https://placehold.co/240x240/003399/FFD700?text=Combo",
        descricao: "Pizza grande, bebida e acompanhamento para assistir em casa.",
        valor: "R$ 69,90",
        botao: "Pedir no WhatsApp",
      },
    },
    {
      title: "Ambiente e experiência",
      type: "external",
      src: "https://www.pexels.com/pt-br/download/video/31863656/",
      description: "Veja o clima da casa e reserve sua mesa para assistir aos jogos.",
      ctaText: "Reservar minha mesa",
      whatsappMessage: "Olá! Quero reservar uma mesa para assistir aos Jogos do Brasil.",
      produto: {
        nome: "Reserva da Torcida",
        imagem: "https://placehold.co/240x240/009c3b/FFD700?text=Mesa",
        descricao: "Mesa para assistir ao jogo com a galera e benefícios especiais.",
        valor: "Até 15% OFF",
        botao: "Reservar agora",
      },
    },
    {
      title: "Retirada com desconto",
      type: "external",
      src: "https://www.pexels.com/pt-br/download/video/31176063/",
      description: "Demonstração de chamada para incentivar retirada no balcão e pedido antecipado.",
      ctaText: "Quero retirar",
      whatsappMessage: "Olá! Vi o reel de retirada e quero fazer meu pedido com desconto.",
      produto: {
        nome: "Combo Retirada",
        imagem: "https://placehold.co/240x240/FFD700/003399?text=Retirada",
        descricao: "Pedido pronto, sem fila e com desconto especial.",
        valor: "R$ 64,90",
        botao: "Quero retirar",
      },
    },
  ],

  // ----------------------------------------------------------
  // SEÇÃO: PROMOÇÕES ESPECIAIS
  // Todos aceitam mídia.
  // ----------------------------------------------------------
  promocoes: [
    {
      titulo: "Pedido Antecipado",
      descricao: "Incentive o cliente a pedir antes do jogo e reduza o pico de atendimento em cima da hora.",
      precoOriginal: "R$ 79,90",
      precoPromocional: "R$ 59,90",
      selo: "Pré-jogo",
      botao: "Quero pedidos antecipados",
      acao: "whatsapp",
      mensagemWhatsApp: "Olá! Quero uma campanha para gerar pedidos antecipados nos Jogos do Brasil.",
      media: {
        type: "image",
        src: "https://dluccapizza.pedizap.com.br/imgcache/6295/768x/uploads/6295/product/photo_66d0f0e643233.jpg.webp",
      },
    },
    {
      titulo: "Retirada Premiada",
      descricao: "Use benefícios e brindes para incentivar retirada no balcão e aumentar movimento na loja.",
      precoOriginal: "",
      precoPromocional: "Brinde especial",
      selo: "Retirada",
      botao: "Quero essa promoção",
      acao: "whatsapp",
      mensagemWhatsApp: "Olá! Quero usar retirada premiada na minha campanha dos Jogos do Brasil.",
      media: {
        type: "image",
        src: "https://alloydeliveryimages.s3.sa-east-1.amazonaws.com/item_images/5520/66c4b7c1a6aa7p96q6.webp",
      },
    },
    {
      titulo: "Mesa da Torcida",
      descricao: "Demonstração de oferta para grupos reservarem mesa e consumirem mais durante a partida.",
      precoOriginal: "",
      precoPromocional: "Até 15% OFF",
      selo: "Grupo",
      botao: "Ver reserva funcionando",
      acao: "scroll",
      scroll: "#reservas",
      mensagemWhatsApp: "Olá! Quero reservar uma mesa para os Jogos do Brasil.",
      media: {
        type: "image",
        src: "https://cms-cdn.saipos.com/assets/2023/03/10/Fale-com-um-vendedor_uid_640b7e4382273.png",
      },
    },
  ],

  // ----------------------------------------------------------
  // ROLETA PROMOCIONAL
  // Prêmios com código e desconto. Edite aqui sem mexer no script.
  // ----------------------------------------------------------
  roulette: {
    enabled: true,
    delaySeconds: 3,

    // Controle de reaparição da roleta:
    // A roleta só aparece novamente após o prazo definido em horas.
    // Padrão: 48 horas. Edite o campo hours para mudar.
    cooldownExibicao: {
      enabled: true,
      hours: 48,
      storageKey: "jogosBrasilRoletaExibidaV1",
    },

    spinDurationMs: 5600,
    extraSpins: 8,
    showOncePerSession: false,
    mensagemWhatsApp: "",

    // Limite de giro:
    // - Sem backend: bloqueia 1 giro por navegador/celular usando localStorage.
    // - Com backend em serverUrl: o servidor pode bloquear também por IP.
    limiteGiro: {
      enabled: true,
      storageKey: "jogosBrasilRoletaUsadaV1",
      textoBloqueado: "Giro já utilizado",
      mensagemBloqueado: "Você já girou a roleta neste aparelho. Use o benefício liberado no WhatsApp.",

      // Para bloquear por IP de verdade, conecte aqui um endpoint n8n/Apps Script/backend.
      // O frontend sozinho não consegue ler ou bloquear IP público com segurança.
      serverUrl: "",
      requireServer: false,
    },

    prizes: [
      {
        nome: "Desconto da Torcida",
        desconto: 5,
        codigo: "BRASIL5",
        mensagem: "Use seu desconto em pedidos feitos antes do jogo.",
        cta: "Usar 5% no WhatsApp",
      },
      {
        nome: "Gol de Desconto",
        desconto: 10,
        codigo: "GOL10",
        mensagem: "Aproveite para pedir agora e garantir o benefício.",
        cta: "Usar 10% agora",
      },
      {
        nome: "Combo Especial",
        desconto: 12,
        codigo: "COMBO12",
        mensagem: "Benefício válido para combos participantes da campanha.",
        cta: "Pedir combo com desconto",
      },
      {
        nome: "Retirada Premiada",
        desconto: 15,
        codigo: "RETIRA15",
        mensagem: "Peça pelo WhatsApp, retire no balcão e economize.",
        cta: "Usar na retirada",
      },
      {
        nome: "Brinde da Copa",
        desconto: null,
        codigo: "BRINDE10",
        mensagem: "Chame no WhatsApp e consulte o brinde disponível.",
        cta: "Resgatar brinde",
      },
      {
        nome: "Cupom Surpresa",
        desconto: 8,
        codigo: "HEXA8",
        mensagem: "Cupom surpresa liberado para a campanha.",
        cta: "Usar cupom",
      },
    ],
  },


  // ----------------------------------------------------------
  // SEÇÃO: DÚVIDAS E QUEBRA DE OBJEÇÕES
  // Conteúdo para responder dúvidas dos clientes sobre pedidos, reservas e promoções.
  // ----------------------------------------------------------
  duvidasObjecoes: {
    enabled: true,
    kicker: "💡 Dúvidas comuns",
    titulo: "Antes de pedir, reservar ou participar...",
    descricao: "Veja as dúvidas mais comuns sobre pedidos, reservas, retirada, bolão promocional e benefícios especiais nos Jogos do Brasil.",

    destaque: {
      icone: "🇧🇷",
      titulo: "A bola vai rolar. A sua experiência começa antes do apito inicial.",
      texto: "Quando o cliente decide pedir, reservar ou chamar no WhatsApp, ele precisa encontrar uma experiência rápida, clara e convincente. Essa campanha organiza ofertas, botões, reservas, promoções e chamadas em uma página pronta para conversão.",
      botao: "Quero entender a campanha",
      mensagemWhatsApp: "Olá! Quero entender as promoções dos Jogos do Brasil.",
    },

    itens: [
      {
        pergunta: "Posso pedir para assistir em casa?",
        resposta: "Sim. Você pode chamar pelo WhatsApp, escolher um combo, combinar entrega ou retirada e garantir tudo antes da bola rolar.",
      },
      {
        pergunta: "Como faço para reservar uma mesa?",
        resposta: "O WhatsApp fecha a venda, mas a página prepara o cliente. Ela mostra oferta, benefícios, reservas, promoções, retirada, bolão e chamadas organizadas antes da pessoa chamar.",
      },
      {
        pergunta: "Como funciona a roleta promocional?",
        resposta: "Ajuda porque cria caminhos claros de ação: pedir em casa, retirar com desconto, reservar mesa, participar de promoção e chamar no WhatsApp com mensagem pronta.",
      },
      {
        pergunta: "O bolão envolve aposta em dinheiro?",
        resposta: "Não. É uma ação promocional vinculada a pedido ou reserva. Você envia seu palpite e participa conforme as regras da casa.",
      },
      {
        pergunta: "Posso retirar no balcão?",
        resposta: "Sim. Você pode pedir pelo WhatsApp, combinar o horário e retirar no balcão com os benefícios disponíveis para a campanha.",
      },
      {
        pergunta: "As promoções são válidas para todos os jogos?",
        resposta: "As promoções podem variar conforme jogo, horário, disponibilidade e regras do estabelecimento. Consulte no WhatsApp antes de finalizar.",
      },
    ],
  },

  // ----------------------------------------------------------
  // SEÇÃO: POTENCIALIZE SUA CAMPANHA
  // Benefícios da experiência para o cliente final
  // ----------------------------------------------------------
  potencializacao: {
    enabled: true,
    kicker: "⚽ Inteligência comercial",
    titulo: "Muito além de assistir ao jogo",
    descricao: "Além de vender nos dias de jogo, a campanha mostra uma estrutura profissional para organizar clientes, criar base de dados e preparar novas ações de venda.",

    media: {
      type: "image",
      src: "https://cdn-blog.superprof.com/blog_br/wp-content/uploads/2026/02/copa-mundo-2026.png",
      poster: "",
    },

    beneficios: [
      {
        icone: "⏰",
        titulo: "Peça antes do jogo",
        texto: "Antecipe seu pedido e evite correria nos horários de maior movimento.",
      },
      {
        icone: "📊",
        titulo: "Reserva organizada",
        texto: "Informe horário, jogo, quantidade de pessoas e observações para facilitar a confirmação.",
      },
      {
        icone: "🧠",
        titulo: "Promoções e cupons",
        texto: "Aproveite roleta, cupons, bolão promocional e ofertas especiais nos jogos.",
      },
      {
        icone: "🚀",
        titulo: "WhatsApp direto",
        texto: "Clique, escolha sua opção e fale diretamente com a equipe pelo WhatsApp.",
      },
    ],

    bonus: {
      enabled: true,
      selo: "Oferta por tempo limitado",
      titulo: "Benefícios por tempo limitado",
      texto: "Durante os Jogos do Brasil, algumas ofertas, cupons e benefícios podem ter prazo limitado ou disponibilidade reduzida.",
      horas: 24,
      destaque: "Consulte disponibilidade, horário e regras da promoção pelo WhatsApp.",
      botao: "Quero aproveitar agora",
      mensagemWhatsApp: "Olá! Quero aproveitar as promoções dos Jogos do Brasil.",
    },
  },

  // ----------------------------------------------------------
  // CTA FINAL
  // ----------------------------------------------------------
  finalCTA: {
    titulo: "A bola vai rolar. Seu pedido também precisa rolar.",
    texto: "Escolha seu combo, reserve sua mesa, retire com desconto, participe das promoções e fale direto pelo WhatsApp antes da partida começar.",
    mensagemWhatsApp: "Olá! Quero pedir ou reservar para os Jogos do Brasil. Pode me ajudar?",
  },



  // ----------------------------------------------------------
  // SEÇÃO: LOCALIZAÇÃO / GOOGLE MAPS
  // Edite aqui o endereço, link do Maps e informações oficiais do estabelecimento.
  // ----------------------------------------------------------
  localizacao: {
    enabled: true,
    kicker: "📍 Como chegar",
    titulo: "Venha torcer com a gente",
    descricao: "Confira nosso endereço no Google Maps, escolha a melhor rota e venha retirar seu pedido ou assistir aos Jogos do Brasil com conforto.",
    nome: "Nome do Estabelecimento",
    endereco: "Rua Exemplo, 123 — Bairro / Cidade",
    referencia: "Próximo ao ponto de referência principal",
    horario: "Funcionamento especial nos dias de jogo",

    // Link que abre o Google Maps em outra aba.
    googleMapsUrl: "https://maps.google.com/",

    // Cole aqui o link de incorporação do Google Maps se quiser usar o mapa oficial do cliente.
    // No Google Maps: Compartilhar > Incorporar mapa > copie apenas o link dentro de src="...".
    // Se deixar vazio, o site cria automaticamente um mapa usando o campo endereco.
    googleMapsEmbedUrl: "",

    mapSubtitle: "Mapa oficial com pin do Google Maps",
    botaoPrimario: "Abrir no Google Maps",
    botaoSecundario: "Chamar no WhatsApp",
    mensagemWhatsApp: "Olá! Vi o endereço no site e quero confirmar como chegar ao estabelecimento.",
  },

  // ----------------------------------------------------------
  // SEÇÃO: AVALIAÇÕES E CLIENTES
  // Troque fotos, nomes, notas e textos pelos depoimentos reais.
  // ----------------------------------------------------------
  avaliacoesClientes: {
    enabled: true,
    titulo: "Coloque aqui suas avaliações e clientes",
    descricao: "Adicione avaliações reais, fotos de clientes, prints de feedbacks e comentários sobre pedidos, reservas, delivery e atendimento no local.",
    itens: [
      {
        nome: "Nome do cliente",
        detalhe: "Cliente atendido",
        foto: "img/cliente-1.jpg",
        nota: 5,
        texto: "Coloque aqui o depoimento de um cliente falando sobre atendimento, pedidos, reservas ou experiência no estabelecimento.",
      },
      {
        nome: "Nome do cliente",
        detalhe: "Experiência no estabelecimento",
        foto: "img/cliente-2.jpg",
        nota: 5,
        texto: "Coloque aqui uma avaliação curta sobre o ambiente, a comida, o delivery ou a facilidade de chamar no WhatsApp.",
      },
      {
        nome: "Avaliação em destaque",
        detalhe: "Prova social para gerar confiança",
        foto: "img/cliente-3.jpg",
        nota: 5,
        texto: "Use este card para destacar um print de avaliação, uma foto de cliente ou um comentário especial.",
      },
    ],
  },

  // ----------------------------------------------------------
  // REDES SOCIAIS
  // ----------------------------------------------------------
  redes: {
    instagram: "https://instagram.com/",
    tiktok:    "https://tiktok.com/@",
    youtube:   "https://youtube.com/@",
    whatsapp:  "",
  },

  // ----------------------------------------------------------
  // INTEGRAÇÕES — preencha quando disponíveis
  // ----------------------------------------------------------
  integracoes: {
    n8n: {
      webhookUrl: "",
    },
    googleAppsScript: {
      url: "",
    },
    facebookPixelId: "",
    gtmId: "",
  },

  // ----------------------------------------------------------
  // TEXTOS DO RODAPÉ
  // ----------------------------------------------------------
  rodape: {
    textoCopyright: "© 2026|2027 Jogos do Brasil. Todos os direitos reservados.",
    textoInstitucional: "Site oficial de promoções, pedidos, reservas, retirada, bolão e atendimento pelo WhatsApp durante os Jogos do Brasil.",

    // Use imagem local, link externo, vídeo local ou vídeo externo.
    // Exemplos:
    // src: "img/footer-campanha.png"
    // src: "https://seudominio.com/footer-campanha.png"
    // type: "image" | "video" | "local" | "external"
    imagemAnimada: {
      enabled: true,
      type: "image",
      src: "logo.png",
      alt: "Imagem demonstrativa da campanha Jogos do Brasil",
      poster: "",
    },

    // Compatibilidade com versões anteriores do site/painel.
    imagemDemonstrativa: {
      enabled: true,
      type: "image",
      src: "logo.png",
      alt: "Imagem demonstrativa da campanha Jogos do Brasil",
      poster: "",
    },
  },

};

// ============================================================
// CONEXÃO COM O PAINEL ADMINISTRATIVO
// Permite que o painel leia e que o site use a configuração salva
// no navegador durante os testes.
//
// IMPORTANTE:
// Agora a configuração salva no localStorage é mesclada com a base
// padrão, e não substitui tudo. Assim campos novos como roleta premium,
// imagem animada do rodapé e produtos dos reels continuam existindo
// mesmo se o navegador tiver uma configuração antiga salva.
// ============================================================
function mergeConfigDeep(defaultConfig, savedConfig) {
  if (!savedConfig || typeof savedConfig !== "object" || Array.isArray(savedConfig)) {
    return defaultConfig;
  }

  const output = Array.isArray(defaultConfig)
    ? [...defaultConfig]
    : { ...defaultConfig };

  Object.keys(savedConfig).forEach((key) => {
    const savedValue = savedConfig[key];
    const defaultValue = output[key];

    if (
      savedValue &&
      typeof savedValue === "object" &&
      !Array.isArray(savedValue) &&
      defaultValue &&
      typeof defaultValue === "object" &&
      !Array.isArray(defaultValue)
    ) {
      output[key] = mergeConfigDeep(defaultValue, savedValue);
    } else {
      output[key] = savedValue;
    }
  });

  return output;
}

try {
  const adminSavedConfig = localStorage.getItem("jogosBrasilAdminConfigV1");

  if (adminSavedConfig) {
    const parsedAdminConfig = JSON.parse(adminSavedConfig);

    if (parsedAdminConfig && typeof parsedAdminConfig === "object" && Object.keys(parsedAdminConfig).length > 0) {
      const mergedConfig = mergeConfigDeep(CONFIG, parsedAdminConfig);
      Object.keys(CONFIG).forEach((key) => delete CONFIG[key]);
      Object.assign(CONFIG, mergedConfig);
      window.CONFIG = CONFIG;
    } else {
      window.CONFIG = CONFIG;
    }
  } else {
    window.CONFIG = CONFIG;
  }
} catch (error) {
  window.CONFIG = CONFIG;
  console.warn("Não foi possível carregar configuração do painel:", error);
}
