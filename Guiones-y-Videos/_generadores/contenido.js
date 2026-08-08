/**
 * Contenido maestro de los guiones + diapositivas para los videos de la
 * Academia Comercial ATRIA. Un objeto por módulo con video.
 *
 * "notas" es el MEGA GUION hablado de cada diapositiva. La suma de las notas
 * dura aprox. el tiempo del módulo (≈130 palabras por minuto).
 */

// Paleta de marca ATRIA
const BRAND = {
  primary: "2B1F3A", secondary: "5C4B75", tertiary: "A18BCF",
  dark: "0B0416", grad1: "7C3AED", grad2: "2563EB",
  ink: "1B1526", body: "3A3348", muted: "8B8397",
  paper: "FFFFFF", soft: "F5F2FA", softLine: "E7E1F0",
  gold: "E8B84B", green: "3FB27F", red: "E2626B",
};

/* ========================================================================== */
/* MÓDULO 1 — BIENVENIDA A ATRIA (15 min)                                     */
/* ========================================================================== */
const MOD1 = {
  id: "mod1", numero: "01",
  titulo: "Bienvenida a ATRIA",
  subtitulo: "Tu primer paso como Asesor Comercial",
  objetivo: "Entender qué es ATRIA, su propósito y el rol del asesor comercial.",
  nivel: "Principiante", tiempo: "15 min",
  slides: [
    {
      tipo: "portada",
      kicker: "Academia Comercial ATRIA · Módulo 01",
      titulo: "Bienvenida a ATRIA",
      subtitulo: "Tu primer paso como Asesor Comercial",
      pie: "Nivel Principiante · Duración 15 minutos",
      notas:
        "Hola, y bienvenido a la Academia Comercial de ATRIA. Si estás viendo este video, es porque diste un paso importante: decidiste convertirte en asesor comercial de ATRIA, y eso te convierte, desde hoy, en parte de nuestro equipo. Empecemos con calma, porque antes de que aprendas a vender hay algo que va a marcar toda tu carrera con nosotros, y quiero que lo entiendas de verdad, no que solo lo escuches. Es esto: nadie vende bien lo que no cree, y nadie cree en lo que no entiende. Por eso este primer módulo no trata de técnicas de venta, ni de precios, ni de comisiones. Trata de algo más profundo: entender qué es ATRIA, a quién ayuda, por qué existe y cuál va a ser tu papel en esta historia. Tómate estos quince minutos con atención. No los veas como un trámite para desbloquear el examen; míralos como la base sobre la que vas a construir todo lo demás. Un edificio no se sostiene por el último piso, sino por los cimientos, y esto son los cimientos. Cuando termines este video, vas a poder explicar en una frase qué es ATRIA, vas a saber a qué negocio le sirve y a cuál no, vas a conocer nuestra misión y nuestros valores y, sobre todo, vas a tener claro qué esperamos de ti como asesor. Respira, ponte cómodo, y empecemos este camino juntos.",
    },
    {
      tipo: "agenda",
      kicker: "Lo que verás en este módulo",
      titulo: "Tu ruta en los próximos 15 minutos",
      items: [
        ["Qué es ATRIA", "La plataforma que ordena el negocio"],
        ["Misión, visión y valores", "El porqué detrás del producto"],
        ["Qué se espera de ti", "El rol del asesor comercial"],
        ["Tu compromiso", "Ética, aprendizaje y registro"],
      ],
      notas:
        "Este es el camino que vamos a recorrer juntos en este módulo, y te lo muestro completo para que sepas siempre en qué punto estamos. Primero vamos a responder la pregunta más importante de todas: qué es ATRIA realmente, más allá del nombre y del logo. Porque si no puedes explicar en una frase qué vendes, difícilmente vas a lograr que alguien te lo compre. Después vamos a hablar del porqué: nuestra misión, nuestra visión y los valores que nos sostienen, ya que eso es lo que le da alma al producto que vas a representar todos los días. Un vendedor que conoce el propósito de lo que vende transmite una convicción que se siente al otro lado de la mesa. En tercer lugar, vamos a aterrizar en ti: qué esperamos exactamente de un asesor comercial de ATRIA, qué responsabilidades asumes al aceptar este rol y qué es lo que te va a hacer bueno en este trabajo. Y para cerrar, vamos a hablar de tu compromiso, que se resume en tres palabras que vas a escuchar mucho en esta academia: ética, aprendizaje y registro. Son cuatro bloques cortos, pero cada uno te va a dar una pieza que vas a usar en tu día a día. Así que vamos con el primero, el más fundamental de todos.",
    },
    {
      tipo: "definicion",
      kicker: "Concepto central",
      titulo: "¿Qué es ATRIA?",
      frase: "ATRIA es un sistema integral de gestión comercial para pequeñas y medianas empresas de Latinoamérica.",
      apoyo: "Une el punto de venta, el inventario, la contabilidad y —para restaurantes— el control de pedidos y menú en una sola plataforma.",
      notas:
        "Vamos a lo esencial, a la definición que quiero que memorices y puedas decir de corrido. ATRIA es un sistema integral de gestión comercial pensado para las pequeñas y medianas empresas de Latinoamérica. Fíjate en dos palabras, porque encierran todo. La primera es integral: no es una herramienta suelta que resuelve una sola cosa, es una plataforma que abarca todo el negocio. La segunda es gestión, no solo venta: ATRIA no sirve únicamente para cobrar, sirve para administrar y tener control de lo que pasa en el comercio. En la práctica, une en una sola plataforma cosas que normalmente están separadas: el punto de venta, la caja donde se cobra; el inventario, el control de lo que entra y sale; la contabilidad, el corazón administrativo; y, en un restaurante, también el control de pedidos y de menú. Déjame pintártelo con una imagen que vas a usar mucho. Piensa en cómo trabaja hoy la mayoría de los comercios pequeños: la venta por un lado, en una caja o un cuaderno; el inventario por otro, en la cabeza del dueño o en un Excel; la contabilidad en manos de un contador externo que aparece a fin de mes; y los pedidos, si es restaurante, en papelitos que van y vienen. Cada cosa es una isla que no se comunica con las demás, y cuando las islas no se hablan, aparecen los errores, se pierde tiempo y nadie tiene claridad para decidir. Lo que hace ATRIA es juntar todas esas islas en un solo lugar conectado. Esa es la idea más importante que quiero que te lleves de este video, y la que vas a repetir, con tus palabras, en cada primera conversación con un cliente.",
    },
    {
      tipo: "idea-clave",
      kicker: "La idea que lo cambia todo",
      titulo: "Cada evento genera su contabilidad, solo",
      frase: "Cada venta, compra o gasto genera automáticamente su asiento contable. El dueño deja de cuadrar todo a mano.",
      pasos: [
        ["Ocurre la operación", "Una venta, una compra, un gasto"],
        ["ATRIA la registra", "En caja, inventario y libros"],
        ["Sale la contabilidad", "Sin volver a digitar nada"],
      ],
      notas:
        "Si hay una sola idea que resume por qué ATRIA es diferente de cualquier caja registradora o programa común, es esta que ves en pantalla. Presta atención, porque la vas a usar una y otra vez. En la mayoría de los negocios, la contabilidad es una tarea aparte que alguien hace después, casi siempre tarde y a mano. Durante todo el mes se vende, se compra y se gasta; y a fin de mes alguien tiene que sentarse a cuadrar: juntar facturas, revisar inventario, sumar gastos, pasar todo a los libros. Es lento, es caro porque a menudo hay que pagarle a alguien, y se presta a errores por todos lados. ATRIA le da la vuelta por completo. Aquí, cada evento del negocio genera automáticamente su asiento contable, en el mismo instante en que ocurre. ¿Qué significa en palabras simples? Que cuando ocurre una venta, ATRIA hace tres cosas al mismo tiempo, sin que nadie se lo pida: la registra en la caja, descuenta el producto del inventario y crea el movimiento contable. Y lo mismo con una compra o un gasto. Mira el flujo en pantalla, porque es la explicación perfecta para un cliente. Primero, ocurre la operación: una venta, una compra o un gasto. Segundo, ATRIA la registra automáticamente en caja, inventario y libros, todo conectado. Y tercero, la contabilidad sale sola, actualizada, sin volver a digitar nada. El resultado, la frase que remata todo, es que el dueño deja de cuadrar a mano. Esta es la promesa central que vas a llevar a cada cliente: con ATRIA, el negocio se ordena solo mientras trabaja. Guárdate bien esta idea.",
    },
    {
      tipo: "tres-valores",
      kicker: "Nuestro propósito",
      titulo: "Misión, visión y valores",
      cards: [
        ["Misión", "Dar control y claridad a cada comercio.", "Ayudamos a que negocios y restaurantes dejen atrás el desorden de Excel, cuadernos y sistemas desconectados."],
        ["Visión", "Ser el sistema operativo del comercio en Latinoamérica.", "Que administrar un negocio deje de ser un problema y pase a ser algo simple y natural."],
        ["Valores", "Honestidad, simplicidad, cercanía y soporte en español.", "Tecnología potente que se siente simple, y un equipo humano que acompaña."],
      ],
      notas:
        "Ahora que sabes qué es ATRIA a nivel técnico, hablemos de por qué existe, porque eso le da alma a tu trabajo y convicción a tu voz. Todo producto que vale la pena nace de un propósito, y el nuestro está en tres ideas: misión, visión y valores. La misión es nuestra razón de ser hoy: dar control y claridad a cada comercio. Ayudamos a que negocios y restaurantes dejen atrás el desorden de siempre, ese que tú y yo conocemos: el Excel que solo una persona entiende, los cuadernos que se pierden, los sistemas sueltos que no se hablan entre sí. La visión es hacia dónde vamos, el sueño grande: convertirnos en el sistema operativo del comercio en Latinoamérica. Piénsalo así: hoy nadie cuestiona usar un teléfono inteligente, es natural; nosotros queremos que administrar un negocio deje de ser un dolor de cabeza y se vuelva igual de natural y simple. Y para llegar ahí nos apoyamos en cuatro valores. Honestidad, porque nunca prometemos lo que el producto no hace. Simplicidad operativa, porque la tecnología es muy potente por dentro pero se siente fácil por fuera. Cercanía, porque tratamos a cada cliente como a un vecino, no como a un número. Y soporte en español, porque acompañamos de verdad, en el idioma y la realidad de nuestra gente. Interioriza esto: cuando vendes ATRIA, no estás vendiendo un software. Estás llevando control, claridad y tranquilidad a alguien que trabaja muy duro por su negocio y su familia. Cuando lo veas así, tu forma de vender cambia para siempre.",
    },
    {
      tipo: "definicion",
      kicker: "Tu rol",
      titulo: "El asesor es la cara de ATRIA",
      frase: "Tu trabajo es entender al negocio, mostrar cómo ATRIA lo ordena y acompañar la decisión con ética.",
      apoyo: "No eres un repartidor de folletos. Eres el puente entre un problema real y una solución que funciona.",
      notas:
        "Llegamos a la parte que más te toca a ti, así que escucha con atención. El asesor comercial es la cara de ATRIA. Y no es una frase bonita, es una realidad concreta: para muchísimos clientes, tú vas a ser la primera persona, y a veces la única, con la que hablen de nosotros. Lo que digas, cómo te comportes, si cumples o no lo que prometes, para ellos eso es ATRIA. Es una gran responsabilidad, pero también un gran privilegio, porque tienes el poder de cambiarle la forma de trabajar a un negocio. Entiende bien tu rol, porque no es el de un repartidor de folletos que recita una lista de funciones como un loro. Tu trabajo tiene tres partes, y las tres importan por igual. La primera es entender al negocio: escuchar de verdad cómo trabaja hoy, qué le duele, qué le hace perder tiempo o dinero. Antes de hablar, escuchar. La segunda es mostrar cómo ATRIA lo ordena: y aquí está la clave, no mostrar todo lo que ATRIA hace, sino conectar cada función con el problema concreto que ese negocio tiene enfrente. Hacer que el cliente vea su propio problema resuelto. Y la tercera es acompañar la decisión con ética: sin presionar, sin mentir, sin prometer cosas que el producto no hace para lograr una venta rápida. Si tuviera que resumir tu rol en una frase, sería esta: eres el puente entre un problema real y una solución que funciona. Un vendedor mediocre empuja el producto; un buen asesor ayuda al cliente a ver su situación con claridad y a decidir con confianza, aunque a veces esa decisión sea esperar. Ese es el estándar que buscamos en ti, y el que esta academia te va a ayudar a alcanzar.",
    },
    {
      tipo: "lista-check",
      kicker: "Tus responsabilidades",
      titulo: "Qué se espera de ti",
      items: [
        ["Representar la marca con honestidad", "Tu palabra es la palabra de ATRIA."],
        ["Aprender el producto a fondo", "No se vende lo que no se entiende."],
        ["Registrar bien tus prospectos y ventas", "Lo que no se registra, no existe."],
        ["Cumplir las políticas comerciales", "Reglas claras protegen tu comisión."],
      ],
      notas:
        "Concretemos qué esperamos de ti en el día a día, porque las buenas intenciones se traducen en compromisos claros. Son cuatro. El primero: representar la marca con honestidad. Cuando hablas con un cliente, tu palabra es la palabra de ATRIA; si prometes algo, la empresa tiene que cumplirlo, porque para el cliente tú eres la empresa. Por eso solo prometemos lo que el producto realmente hace. Una venta lograda con una mentira no es una venta, es un problema futuro que explota en forma de reembolso, reclamo y mala reputación. El segundo: aprender el producto a fondo. Y aquí vuelvo a la frase con la que abrimos, porque es una ley: no se vende lo que no se entiende. Dedicarás los próximos módulos a conocer cada parte de ATRIA, y no es por llenarte de teoría, sino porque tu seguridad frente al cliente nace de tu conocimiento. Cuando dominas el producto, se te nota, y esa confianza se contagia. El tercero: registrar bien tus prospectos y ventas. En ATRIA tenemos una regla de oro: lo que no se registra, no existe. No existe para el seguimiento, porque se te olvida; no existe para la atribución, porque no podrás demostrar que ese cliente es tuyo; y no existe para tu comisión, porque el sistema paga sobre lo registrado y aprobado. Aprenderás a usar el CRM, y ahí llevarás todo. Y el cuarto: cumplir las políticas comerciales. Las reglas no están para complicarte ni vigilarte; protegen tu trabajo, tu comisión y la confianza del cliente. Un asesor que respeta las reglas duerme tranquilo y cobra completo. Estos cuatro compromisos, honestidad, conocimiento, registro y cumplimiento, son la base de todo lo demás.",
    },
    {
      tipo: "aplicacion",
      kicker: "Aplícalo",
      titulo: "¿Comercio o restaurante?",
      col1: ["Comercio general", "Ferretería, farmacia, tienda, distribuidora", "Necesita: POS, inventario, contabilidad y reportes"],
      col2: ["Restaurante", "Cafetería, comida rápida, bar, cocina", "Necesita además: pedidos y menú conectados a caja e insumos"],
      notas:
        "Antes de cerrar, te doy una herramienta práctica que vas a usar desde tu primera conversación y que te hará ver profesional de inmediato. ATRIA sirve a dos grandes tipos de cliente, y distinguirlos rápido es una de las primeras habilidades del buen asesor. El primer grupo es el comercio general: una ferretería, una farmacia, una tienda de barrio, una distribuidora, un minimercado. ¿Qué necesita sobre todo? El punto de venta para cobrar rápido y sin errores, el inventario para controlar sus existencias, la contabilidad automática para dejar de cuadrar a mano y los reportes para saber cómo va y decidir. Ese es su combo esencial. El segundo grupo es el restaurante, y ojo, aquí entran también cafeterías, comida rápida, bares y cualquier cocina con pedidos frecuentes. ¿Qué necesita? Todo lo del comercio general, y además algo clave: el control de pedidos y de menú, conectado con la caja y con el inventario de insumos. La diferencia importante es esta: el restaurante vive de los pedidos y del consumo de insumos. Cada plato consume ingredientes, y ahí se gana o se pierde el margen. Por eso, para el restaurante, ATRIA suma el módulo de pedidos y menú, que es su corazón. Te dejo con un hábito mental que quiero que adoptes desde ya: cuando llegues a cualquier negocio, la primera pregunta, aunque sea en silencio, es: ¿esto es un comercio o un restaurante? Esa sola respuesta ya empieza a ordenar tu conversación y te dice por dónde enfocar. Es simple, pero poderoso.",
    },
    {
      tipo: "resumen",
      kicker: "Para recordar",
      titulo: "Lo que te llevas de este módulo",
      items: [
        "ATRIA integra POS, inventario, contabilidad automática y operación para restaurantes.",
        "El asesor es el puente entre el negocio y la solución.",
        "La ética y el registro correcto son la base del programa.",
      ],
      notas:
        "Vamos a recapitular lo esencial de este módulo, porque estas son las ideas que quiero que te queden grabadas en la memoria, las que deberías poder repetir si alguien te despierta a medianoche. Primera idea: ATRIA integra en una sola plataforma el punto de venta, el inventario, la contabilidad automática y, para los restaurantes, la operación completa de pedidos y menú. No son herramientas sueltas, es una sola plataforma conectada que ordena todo el negocio mientras el dueño trabaja. Segunda idea: tú, como asesor, eres el puente entre el negocio y la solución. No eres un recitador de funciones; eres alguien que entiende problemas reales y muestra cómo ATRIA los resuelve, uno por uno. Esa es la diferencia entre informar y vender, y la vamos a profundizar más adelante. Y tercera idea: la ética y el registro correcto son la base de todo el programa. Sin honestidad no hay confianza, y sin confianza no hay ventas que duren. Sin registro no hay seguimiento, no hay atribución y no hay comisión. Si te llevas nada más que estas tres ideas de este primer módulo, ya tienes los cimientos bien puestos para todo lo que viene.",
    },
    {
      tipo: "cierre",
      kicker: "Cierre del Módulo 01",
      titulo: "Estás listo para empezar",
      frase: "Ya sabes qué es ATRIA, a quién ayuda y cuál es tu rol. Ahora vamos a conocer el producto a fondo.",
      cta: "Siguiente paso: presenta el examen del Módulo 01 y avanza al Módulo 02 — Dominio del producto.",
      notas:
        "Y con esto cerramos tu primer módulo de la Academia Comercial ATRIA. Quiero felicitarte de verdad, porque diste el paso más importante de todos, uno que muchos vendedores saltan por las prisas: entender antes de vender. Hoy ya sabes qué es ATRIA, sabes a quién ayuda y a quién no, conoces nuestra misión, nuestra visión y nuestros valores, y tienes claro cuál es tu rol como asesor y qué esperamos de ti. Eso es más de lo que muchos logran en semanas de trabajo. El siguiente paso es sencillo y te lo recomiendo hacer sin dejar pasar mucho tiempo, mientras todo está fresco. Primero, presenta el examen de este módulo; no lo veas como un obstáculo, sino como una forma de afianzar y confirmar lo que aprendiste. Y segundo, avanza al Módulo 2, donde vamos a meternos de lleno en el producto. Ahí vas a conocer cada parte de ATRIA a fondo: el punto de venta, el inventario, la contabilidad, los pedidos y los reportes, para que puedas conectar cada función con un problema real del cliente. Nos vemos en el siguiente video. Bienvenido, otra vez, y con toda intención, al equipo de ATRIA. Vamos con todo.",
    },
  ],
};

/* ========================================================================== */
/* MÓDULO 2 — DOMINIO DEL PRODUCTO (35 min)                                   */
/* ========================================================================== */
const MOD2 = {
  id: "mod2", numero: "02",
  titulo: "Dominio del producto",
  subtitulo: "Cada módulo de ATRIA conectado a un problema real",
  objetivo: "Conocer cada módulo real de ATRIA y conectarlo con un problema del cliente.",
  nivel: "Principiante", tiempo: "35 min",
  slides: [
    {
      tipo: "portada",
      kicker: "Academia Comercial ATRIA · Módulo 02",
      titulo: "Dominio del producto",
      subtitulo: "Cada módulo de ATRIA conectado a un problema real",
      pie: "Nivel Principiante · Duración 35 minutos",
      notas:
        "Bienvenido de nuevo al equipo. Este es el Módulo 2 de la Academia Comercial ATRIA, dominio del producto, y déjame decirte, sin exagerar, que es uno de los módulos más importantes de todo el programa. Si el primer módulo te dio los cimientos, este te da las herramientas con las que vas a trabajar todos los días. ¿Por qué es tan importante? Porque aquí se cumple una regla que no tiene excepciones en el mundo de las ventas: no se vende lo que no se entiende. Puedes tener el mejor guion escrito, la mejor actitud, la sonrisa más amable y la mejor presencia; pero si no dominas el producto de verdad, el cliente lo va a notar en los primeros dos minutos de conversación. Va a hacer una pregunta y vas a titubear, y ahí se cae la confianza. En cambio, cuando dominas el producto, cada respuesta sale con seguridad, y esa seguridad se contagia y se convierte en credibilidad. En este módulo vas a conocer cada parte de ATRIA a fondo. Pero, y esto es clave, no lo vamos a hacer como un manual técnico aburrido que se limita a describir pantallas y botones. Lo vamos a hacer de la forma en que piensa un vendedor experto. Cada módulo del producto lo vamos a conectar con tres cosas: qué hace, qué problema resuelve y qué tipo de cliente lo necesita. Esa fórmula de tres es lo que convierte el conocimiento técnico frío en argumentos de venta que mueven decisiones. Son treinta y cinco minutos de contenido valioso, así que ponte cómodo, y si puedes, ten a la mano papel y lápiz para anotar, porque lo que viene lo vas a usar en la calle. Vamos a empezar por entender el mapa completo del producto, y luego lo recorreremos parte por parte.",
    },
    {
      tipo: "agenda",
      kicker: "Los módulos que dominarás",
      titulo: "El producto ATRIA, parte por parte",
      items: [
        ["Punto de venta (POS)", "El corazón de la caja"],
        ["Pedidos y menú", "El módulo de restaurantes"],
        ["Inventario", "Control de existencias y lotes"],
        ["Contabilidad automática", "La joya de ATRIA"],
        ["Multi-sucursal y reportes", "Visión de todo el negocio"],
        ["Función → problema → beneficio", "Cómo se conecta todo"],
      ],
      notas:
        "Este es el recorrido completo que vamos a hacer, y te lo muestro entero para que tengas el mapa en la cabeza antes de empezar el viaje. Vamos a ver cinco grandes módulos del producto, uno por uno, con calma. Empezaremos por el punto de venta, que es el corazón de la caja, el módulo que casi todos los clientes van a usar en cada venta, todos los días. Luego veremos pedidos y menú, que es el módulo especial, el que está diseñado específicamente para los restaurantes y todo lo relacionado con la comida. Después pasaremos al inventario, que controla las existencias, los lotes y los vencimientos, y que le ahorra al cliente mucho más dinero del que imagina. Enseguida llegaremos a la contabilidad automática, que yo, personalmente, llamo la joya de la corona de ATRIA, porque es lo que de verdad nos diferencia de cualquier otro sistema del mercado. Y cerraremos el recorrido con multi-sucursal y reportes, que le dan al dueño la visión completa, de águila, sobre su negocio. Al final de todo, vamos a unir las piezas con la fórmula más importante que vas a aprender para vender: función, problema, beneficio. Quiero pedirte algo desde ahora: cada vez que veas o abras una pantalla de ATRIA, de aquí en adelante, quiero que la mires con esos tres lentes puestos. No pienses solo qué hace esa pantalla, piensa qué problema resuelve y a quién le sirve. Si adoptas ese hábito mental, este módulo habrá cumplido su misión. Empecemos por el primero, el punto de venta.",
    },
    {
      tipo: "modulo-producto",
      kicker: "Módulo del producto 1 de 5",
      titulo: "Punto de venta (POS)",
      queHace: "Vende rápido, aplica descuentos, cobra de forma mixta y sigue operando cuando el internet falla.",
      problema: "Ventas lentas, colas y ventas sin registrar.",
      cliente: "Cualquier comercio con caja.",
      notas:
        "Empecemos por el punto de venta, o POS por sus siglas en inglés, que significa point of sale, punto de venta. Este es el módulo que el cliente ve funcionar todos los días, en cada venta que hace, así que es el más visible y el que más rápido genera confianza cuando lo muestras bien. Vamos a analizarlo con nuestra fórmula. Primero, ¿qué hace el POS de ATRIA? Hace varias cosas que le resuelven la vida a un comerciante. Permite vender rápido, con muy pocos toques, buscando el producto por su nombre o por su código de barras, sin perder tiempo. Permite aplicar descuentos de forma controlada, para que el negocio no regale dinero sin darse cuenta. Permite cobrar de forma mixta, o sea, una parte en efectivo y otra parte con tarjeta, algo comunísimo en nuestros comercios latinoamericanos y que muchos sistemas ni siquiera contemplan. Y tiene una característica que a los clientes les encanta y que siempre debes mencionar: sigue operando aunque se caiga el internet. Cuando la conexión vuelve, todo se sincroniza solo, sin perder ni una sola venta. Segundo, y esta es la parte que de verdad vende, ¿qué problema resuelve el POS? Resuelve tres dolores muy concretos: las ventas lentas que hacen perder tiempo y paciencia; las colas de clientes que se cansan de esperar y a veces se van sin comprar; y, el más grave de todos, las ventas que se hacen sin quedar registradas, esas ventas fantasma que después nadie sabe si el dinero entró a la caja o se quedó en el bolsillo de alguien. Ese descontrol le cuesta muchísimo a los negocios. Y tercero, ¿quién es el cliente típico de este módulo? La respuesta es amplia: prácticamente cualquier comercio que tenga una caja. Una tienda, una ferretería, una farmacia, una boutique, un minimercado. Si cobran dinero, necesitan un buen punto de venta. Fíjate cómo, al analizarlo, usamos la fórmula completa: te dije qué hace, qué problema resuelve y quién lo necesita. Así, exactamente así, vas a pensar cada módulo del producto de aquí en adelante. Practícalo con este mismo, repítelo en voz alta, hasta que te salga natural.",
    },
    {
      tipo: "modulo-producto",
      kicker: "Módulo del producto 2 de 5",
      titulo: "Pedidos y menú para restaurantes",
      queHace: "Organiza el menú, toma pedidos, conecta la venta con la caja y controla el consumo de inventario.",
      problema: "Pedidos perdidos, cobros desordenados y poca claridad de qué se vende.",
      cliente: "Restaurante, cafetería, comida rápida, bar o cocina con pedidos frecuentes.",
      notas:
        "El segundo módulo es muy especial, porque es el que convierte a ATRIA en la solución ideal para todo el mundo de la comida: pedidos y menú para restaurantes. Este módulo está diseñado pensando en la realidad concreta de una cocina y un salón llenos de movimiento, y cuando lo dominas, tienes en tus manos la llave para vender a un sector enorme y muy desatendido. Analicémoslo con nuestra fórmula, como siempre. ¿Qué hace? Hace cuatro cosas encadenadas que vale la pena que memorices. Primero, organiza el menú: carga los platos, sus precios, sus categorías, sus variantes, de modo que todo esté ordenado y a la mano. Segundo, toma los pedidos por mesa o por cuenta, para que nada se pierda ni se confunda entre el salón y la cocina; el mesero captura, y la cocina recibe. Tercero, conecta cada pedido directamente con la caja, así que el cobro sale exactamente de lo que realmente se pidió, sin que se cuele nada ni se cobre de menos. Y cuarto, y esto es lo más potente, ayuda a controlar el consumo de inventario, porque cuando se vende un plato, ATRIA sabe qué insumos, qué ingredientes se usaron para prepararlo, y los descuenta. Ahora, ¿qué problema resuelve? Resuelve el dolor más común y más frustrante de los restaurantes, ese que hace que el dueño viva estresado. Resuelve los pedidos que se pierden o se confunden, con el clásico «yo no pedí esto» o el plato que nunca llegó a la mesa. Resuelve los cobros desordenados, donde al final del día nunca se sabe con certeza si se cobró todo lo que se sirvió. Y resuelve la falta de claridad sobre qué platos se venden más y, sobre todo, cuáles dejan margen y cuáles no; porque hay platos que se venden mucho pero dejan poquísimo, y el dueño muchas veces ni lo sabe. Y por último, ¿quién lo necesita? Lo necesita cualquier restaurante, cafetería, negocio de comida rápida, bar, food truck o cocina que maneje pedidos con frecuencia. Te doy un consejo de vendedor: cuando entres a un negocio de comida y veas al dueño corriendo entre las mesas, apuntando pedidos en papelitos, este es el módulo que va a hacer brillar sus ojos, porque le vas a mostrar el orden que tanto necesita. Ese momento de conexión es lo que cierra ventas en el sector gastronómico.",
    },
    {
      tipo: "modulo-producto",
      kicker: "Módulo del producto 3 de 5",
      titulo: "Inventario",
      queHace: "Controla existencias, lotes, vencimientos, almacenes y movimientos entre sucursales.",
      problema: "Pérdidas por robo o vencimiento y quiebres de stock.",
      cliente: "Negocios con productos físicos.",
      notas:
        "El tercer módulo es el inventario, y quiero que le prestes especial atención, porque es uno de los que más dinero le ahorra al cliente sin que él siquiera se dé cuenta de cuánto está perdiendo hoy. El inventario es dinero quieto en los estantes, y controlarlo bien es controlar la salud del negocio. Vamos con la fórmula. ¿Qué hace el módulo de inventario de ATRIA? Controla las existencias en tiempo real, es decir, te dice cuánto tienes de cada producto en este preciso momento, sin tener que ir a contar a la bodega. Maneja lotes y vencimientos, algo absolutamente vital para las farmacias, para las tiendas de alimentos y para cualquier negocio que venda productos que caducan. Controla varios almacenes o bodegas al mismo tiempo, porque muchos negocios tienen más de un lugar donde guardan mercadería. Y registra los movimientos entre sucursales, cuando un producto sale de una tienda y va a otra, para que nunca se pierda el rastro. Ahora la pregunta que vende: ¿qué problema resuelve? Resuelve dos dolores que son carísimos, aunque muchas veces invisibles. El primero son las pérdidas: productos que se roban, productos que se vencen en la estantería y hay que botar, y productos que simplemente se pierden porque nadie sabía que estaban ahí, arrumados en un rincón. Todo eso es dinero que se evapora. El segundo dolor son los quiebres de stock, que es cuando un cliente llega dispuesto a comprar y resulta que no hay producto. Eso es doblemente malo: es una venta que se perdió y es un cliente que se va molesto y quizás no vuelve. ¿Y quién necesita este módulo? Lo necesita todo negocio que maneje productos físicos: ferreterías con miles de artículos distintos, farmacias con medicamentos que vencen, tiendas, distribuidoras, minimercados. Y te dejo un dato de oro para tus conversaciones de venta, uno que impacta: la gran mayoría de los negocios pequeños no tiene ni idea de cuánto dinero tiene, literalmente, parado o perdido dentro de su inventario. Trabajan a ciegas. ATRIA se los muestra con números claros, y ver ese número suele ser el momento en que el cliente entiende que necesita ordenar su inventario ya.",
    },
    {
      tipo: "modulo-producto",
      kicker: "Módulo del producto 4 de 5 · La joya",
      titulo: "Contabilidad automática",
      queHace: "Cada venta, compra, gasto y cobro genera su asiento sin volver a digitar. Libro diario, mayor y estados salen solos.",
      problema: "Contabilidad atrasada, cara y llena de errores.",
      cliente: "Negocios que hoy pagan a alguien para 'cuadrar'.",
      notas:
        "Llegamos a la que, con todo cariño y con toda razón, llamo la joya de ATRIA: la contabilidad automática. Presta aquí la máxima atención de todo el módulo, porque este es el argumento que de verdad nos separa de cualquier caja registradora o POS común del mercado. Cualquiera vende un sistema para cobrar; casi nadie le entrega al comerciante su contabilidad hecha sola. Vamos con la fórmula, pero con más profundidad. ¿Qué hace? Ya lo tocamos en el primer módulo, pero ahora lo entendemos completo. Cada venta, cada compra a un proveedor, cada gasto del negocio y cada cobro que se recibe genera automáticamente su asiento contable, en el instante, sin que ninguna persona tenga que volver a digitar esa información en otro programa ni pasarla a un contador. Y a partir de esos asientos que se crean solos, el libro diario, el libro mayor y los estados financieros del negocio se arman solos y se mantienen actualizados al día, no a fin de mes, no con tres meses de atraso, sino al día. ¿Qué problema resuelve? Resuelve el dolor de una contabilidad que está atrasada, que es cara y que está llena de errores. Y quiero que dimensiones este dolor, porque es enorme. Piensa en cuántos negocios pequeños llevan su contabilidad con meses de retraso, tomando decisiones a ciegas porque los números que tienen ya son viejos. Piensa en cuántos le pagan mes a mes a un contador que solo aparece a recoger papeles y que les entrega los resultados cuando ya es demasiado tarde para reaccionar. Piensa en los errores de digitación, en las facturas que se traspapelan, en los sustos con los impuestos. Todo eso lo resuelve ATRIA. ¿Y quién lo necesita? En verdad lo necesitan todos, pero muy en especial los negocios que hoy pagan a alguien únicamente para cuadrar sus cuentas. Y aquí te regalo un argumento de venta poderosísimo, de los que cierran tratos: en muchísimos casos, lo que el cliente se ahorra en tiempo propio y en costos de contabilidad externa paga por sí solo la suscripción mensual de ATRIA. O sea, el sistema se paga solo con el ahorro que genera. Cuando aprendas a mostrar bien este módulo, en el Módulo de demostración, vas a ver con tus propios ojos cómo le cambia la cara al cliente, porque le estás quitando de encima uno de los mayores dolores de cabeza que tiene un dueño de negocio. Domina este módulo más que ningún otro.",
    },
    {
      tipo: "modulo-producto",
      kicker: "Módulo del producto 5 de 5",
      titulo: "Multi-sucursal y reportes",
      queHace: "Consolida varias tiendas y entrega reportes de ventas, rentabilidad, cuentas por cobrar y stock bajo.",
      problema: "No saber qué local es más rentable ni dónde se pierde dinero.",
      cliente: "Negocios con dos o más sucursales, y cualquiera que quiera decidir con datos.",
      notas:
        "El quinto y último módulo del producto es multi-sucursal y reportes, y es el que le regala al dueño la visión de águila sobre todo su negocio, esa mirada desde arriba que le permite decidir con inteligencia en lugar de por corazonada. Vamos con la fórmula por última vez en este recorrido. ¿Qué hace? Hace dos grandes cosas. Por un lado, consolida varias tiendas o sucursales en una sola vista, de manera que el dueño no tenga que andar sumando a mano lo de cada local en una servilleta al final del día. Todo junto, en una sola pantalla, comparable. Por otro lado, entrega reportes claros y útiles: reportes de ventas, para saber cuánto se vendió y cuándo; reportes de rentabilidad, para saber cuánto se ganó de verdad, que no es lo mismo que cuánto se vendió; reportes de cuentas por cobrar, para no perder de vista el dinero que le deben; y reportes de stock bajo, para saber qué productos hay que reponer antes de que se agoten. ¿Qué problema resuelve? Resuelve una angustia muy típica y muy real del dueño que tiene varios locales: no saber con certeza cuál de sus sucursales es realmente la más rentable, ni dónde exactamente se le está escapando el dinero. Y te comparto algo que verás mucho en la calle: muchísimos dueños están convencidos de que su local más grande, el que más vende, es el que más gana. Y cuando ATRIA les muestra los reportes de rentabilidad, se llevan la sorpresa de su vida al descubrir que, a veces, ese local grande gana menos que uno pequeño porque tiene más gastos. Los datos rompen las suposiciones. ¿Y quién lo necesita? De forma directa e inmediata, lo necesitan los negocios que tienen dos o más sucursales. Pero pon mucha atención a esto, porque es importante: los reportes le sirven absolutamente a cualquier negocio, incluso al que tiene un solo local. ¿Por qué? Porque decidir con datos reales siempre, siempre, es mejor que decidir con una corazonada. Un dueño que ve sus números toma mejores decisiones. Con esto ya conoces los cinco grandes módulos del producto de ATRIA. Ahora viene la parte que une todo y que convierte este conocimiento en ventas.",
    },
    {
      tipo: "formula",
      kicker: "La fórmula del vendedor experto",
      titulo: "Función → Problema → Beneficio",
      pasos: [
        ["Función", "Lo que la herramienta hace", "El POS cobra mixto y sin internet"],
        ["Problema", "El dolor real del cliente", "Pierde ventas cuando se cae la red"],
        ["Beneficio", "Lo que el cliente gana", "Nunca deja de vender ni de cobrar"],
      ],
      notas:
        "Aquí está el secreto, la fórmula que de verdad separa a un vendedor promedio de uno experto. Quiero que la grabes a fuego, porque es el hilo que conecta todo lo que acabas de aprender del producto con lo que vas a lograr en la calle. Déjame primero mostrarte cómo NO se hace, para que sientas la diferencia. Un vendedor promedio se para frente al cliente y enumera funciones, una tras otra: mire, señor, esto tiene punto de venta, tiene inventario, tiene contabilidad, tiene reportes, tiene multi-sucursal. Y el cliente escucha, asiente con la cabeza por educación, dice «ajá, interesante»... y no compra. ¿Por qué no compra, si le dijiste todo lo que hace? Porque en ningún momento sintió que eso resolviera un problema suyo. Le hablaste de tu producto, no de su dolor. Ahora mira cómo lo hace el vendedor experto. Usa una fórmula de tres pasos encadenados: función, problema, beneficio. Primero menciona la función, lo que la herramienta hace. Segundo, y este es el paso que casi todos olvidan, conecta esa función con el problema real y específico de ese cliente que tiene enfrente. Y tercero, remata con el beneficio, es decir, con lo que el cliente concretamente gana. Veámoslo con el ejemplo que tienes en pantalla, usando el POS. Función: el punto de venta de ATRIA cobra de forma mixta y sigue funcionando aunque se caiga el internet. Problema: usted me contó que pierde ventas cada vez que se le cae la red y la caja deja de funcionar. Beneficio: con ATRIA, usted nunca deja de vender ni de cobrar, pase lo que pase con el internet. ¿Sientes la diferencia? ¿Escuchas cómo la tercera versión sí mueve algo por dentro? La función sola es simple información, datos que entran por un oído y salen por el otro. Pero la función, más el problema, más el beneficio, eso es una venta en construcción. Grábate esta cadena de tres eslabones, porque la vas a usar con cada uno de los cinco módulos que aprendimos y con cada cliente que atiendas. Es, sin exagerar, la herramienta más importante que te llevas de este módulo.",
    },
    {
      tipo: "ejemplos",
      kicker: "Función y problema en la vida real",
      titulo: "Tres casos para practicar",
      casos: [
        ["Ferretería con dos locales", "No sabe cuál es más rentable.", "ATRIA multi-sucursal + reportes."],
        ["Farmacia", "Pierde productos vencidos.", "Control de lotes y vencimientos del inventario."],
        ["Restaurante", "Pierde control entre pedidos, caja e insumos.", "Pedidos y menú conectados con inventario y reportes."],
      ],
      notas:
        "Vamos a aterrizar la fórmula con tres casos reales, exactamente del tipo que te vas a encontrar cuando salgas a la calle a trabajar. Te recomiendo memorizar estos tres, porque son oro puro para tus primeras conversaciones. Caso número uno: una ferretería con dos locales. ¿Cuál es su problema? Que el dueño no sabe cuál de sus dos locales es más rentable; trabaja a ciegas, repartiendo su atención y su mercadería sin datos que lo guíen. ¿Cuál es la solución de ATRIA? El módulo multi-sucursal junto con los reportes de rentabilidad. Y fíjate cómo se lo dirías en una sola frase potente: «Con ATRIA usted va a ver, negro sobre blanco y sin discusión, cuál de sus dos locales le deja más plata y por qué». Eso es función, problema y beneficio en acción. Caso número dos: una farmacia que pierde productos vencidos. ¿El problema? Cada medicamento que se vence en el estante es dinero que se va directo a la basura, y en una farmacia eso pasa seguido. ¿La solución? El control de lotes y vencimientos del inventario, que le avisa al farmacéutico con anticipación, antes de que el producto caduque, para que lo venda o lo rote a tiempo. El beneficio es claro: deja de botar plata. Caso número tres: un restaurante que pierde el control entre los pedidos, la caja y los insumos. ¿El problema? Los pedidos se confunden, no cuadra la caja al final del día, y no sabe cuántos insumos consume realmente. ¿La solución? El módulo de pedidos y menú conectado con el inventario y con los reportes, que ordena todo el flujo de principio a fin. Ahora, quiero que notes algo muy importante sobre el ORDEN de estos tres casos. En los tres, yo no empecé por la función. Empecé por el problema, y la función apareció después, como la respuesta natural a ese problema. Ese es el orden mental correcto que debes entrenar: primero escuchas y entiendes el problema del cliente, y solo después ofreces la función que lo resuelve. Nunca al revés. El vendedor novato llega ofreciendo funciones; el vendedor experto llega escuchando problemas. Practica estos tres casos hasta que te salgan de corrido.",
    },
    {
      tipo: "errores",
      kicker: "Cuidado con esto",
      titulo: "Errores comunes que debes evitar",
      items: [
        ["Mostrar TODOS los módulos", "Aunque el cliente solo necesite dos. Abrumas y confundes."],
        ["Hablar de funciones sin problema", "Listar características sin conectarlas a un dolor real no vende."],
      ],
      notas:
        "Antes de cerrar este módulo, quiero advertirte sobre los dos errores más comunes, y te lo digo con énfasis porque son errores que se cometen justo cuando ya te sientes seguro y entusiasmado con el producto. Son trampas del exceso de confianza. El primer error es querer mostrar todos los módulos, aunque el cliente solo necesite dos. Es muy tentador, lo entiendo: acabas de aprender todo lo maravilloso que hace ATRIA, estás emocionado, y quieres enseñarlo todo, presumir cada función, demostrar todo lo que sabes. Pero para el cliente, eso no es impresionante, es abrumador y confuso. Imagina que llegas donde el dueño de una pequeña tienda de barrio, con un solo local, y te pones a hablarle con entusiasmo del módulo multi-sucursal para consolidar varias tiendas. ¿Qué logras? Lo pierdes. Él piensa «esto es demasiado grande para mí, esto no es para mi negocito». Recuerda siempre: menos es más. Muestra solo lo que le sirve a ese cliente en particular, y guarda el resto. El segundo error es hablar de funciones sin conectarlas a un problema. Es el error de recitar la ficha técnica de memoria, como si leyeras un folleto. «Tiene esto, tiene lo otro, tiene aquello». Ya lo vimos con la fórmula, pero lo repito porque es el error más frecuente de todos: una función suelta, sin un problema al lado, es puro aire que el cliente olvida en cinco segundos. En cambio, una función que resuelve un dolor concreto es una venta que empieza a construirse. Si logras evitar estos dos errores, mostrar de menos y siempre con problema, ya estás por encima de la mayoría de los vendedores del mercado. Porque dominar el producto, y esto es lo más importante que te llevas, no es saber decir todo lo que hace; dominar el producto es saber elegir, con criterio, lo que le importa al cliente que tienes enfrente, y dejar callado lo demás.",
    },
    {
      tipo: "resumen",
      kicker: "Para recordar",
      titulo: "Lo que te llevas de este módulo",
      items: [
        "Cada módulo de ATRIA resuelve un problema concreto.",
        "Conecta siempre: función → problema → beneficio.",
        "No todos los clientes necesitan todo. Elige lo relevante.",
      ],
      notas:
        "Hagamos el resumen de este módulo, que estuvo cargado de contenido valioso. Quédate con estas tres ideas por encima de todo. Primera idea: cada módulo de ATRIA, el punto de venta, los pedidos y menú, el inventario, la contabilidad automática y los reportes multi-sucursal, resuelve un problema concreto y real de un negocio de verdad. No son funciones para presumir en un folleto; son soluciones a dolores que le quitan el sueño al dueño. Cuando pienses en cualquier módulo, piensa primero en el dolor que cura. Segunda idea: la cadena que nunca, jamás, debes soltar es función, problema, beneficio. Menciona qué hace la herramienta, conéctalo con el dolor específico de ese cliente, y remata con lo que gana en dinero, en tiempo o en tranquilidad. Esa cadena es tu herramienta de trabajo diaria. Y tercera idea: no todos los clientes necesitan todo. Tu trabajo como asesor profesional no es mostrarlo absolutamente todo, sino elegir con criterio lo relevante para el negocio que tienes enfrente. La sabiduría del buen vendedor está tanto en lo que muestra como en lo que decide callar. Si dominas estas tres ideas, dominas el producto de la única manera que realmente sirve: la manera que vende.",
    },
    {
      tipo: "cierre",
      kicker: "Cierre del Módulo 02",
      titulo: "Ya dominas el producto",
      frase: "Conoces cada módulo de ATRIA y sabes conectarlo con un problema real. Ese es el conocimiento que da seguridad.",
      cta: "Siguiente paso: presenta el examen del Módulo 02 y continúa con el Módulo 03 — Cliente ideal.",
      notas:
        "Y con esto cerramos el Módulo 2. Hiciste un trabajo excelente, y quiero que lo reconozcas, porque acabas de recorrer todo el producto de ATRIA con la mentalidad correcta, la mentalidad de un vendedor experto. Ya no ves pantallas sueltas ni botones sin sentido: ahora ves soluciones a problemas reales. Conoces el punto de venta, los pedidos y menú para restaurantes, el inventario con sus lotes y vencimientos, la contabilidad automática que es nuestra joya, y los reportes multi-sucursal que dan la visión completa. Y lo más importante de todo: sabes conectar cada uno de ellos con un dolor concreto del cliente, usando la fórmula de oro, función, problema y beneficio. Ese conocimiento es exactamente lo que te va a dar seguridad, esa seguridad que se nota y se contagia, cuando estés sentado frente a un dueño de negocio. Tienes además dos recursos de apoyo que te recomiendo revisar para reforzar: la ficha de producto en PDF y la comparativa de Excel contra ATRIA, que es buenísima para mostrar el contraste. El siguiente paso es presentar el examen de este módulo, para afianzar todo lo que aprendiste, y luego avanzar al Módulo 3, donde vamos a aprender algo clave que te va a ahorrar muchísimo tiempo: cómo identificar al cliente ideal. Es decir, a quién sí conviene venderle y a quién no, para que enfoques tu energía donde de verdad rinde. Nos vemos en el próximo video. Vas muy bien.",
    },
  ],
};

/* ========================================================================== */
/* MÓDULO 7 — PRESENTACIÓN Y DEMOSTRACIÓN (35 min)                            */
/* ========================================================================== */
const MOD7 = {
  id: "mod7", numero: "07",
  titulo: "Presentación y demostración",
  subtitulo: "Demos que conectan cada función con un problema",
  objetivo: "Preparar y ejecutar demos que conectan cada función con un problema.",
  nivel: "Intermedio", tiempo: "35 min",
  slides: [
    {
      tipo: "portada",
      kicker: "Academia Comercial ATRIA · Módulo 07",
      titulo: "Presentación y demostración",
      subtitulo: "Demos que conectan cada función con un problema",
      pie: "Nivel Intermedio · Duración 35 minutos",
      notas:
        "Bienvenido al Módulo 7 de la Academia Comercial ATRIA: presentación y demostración. Si llegaste hasta aquí, quiero que te des cuenta de todo lo que ya recorriste, porque no es poco. Ya sabes qué es ATRIA, ya dominas el producto módulo por módulo, ya sabes identificar al cliente ideal, ya sabes prospectar para conseguir reuniones y ya sabes diagnosticar para entender al cliente. Con todo eso en tu mochila, llega ahora uno de los momentos más emocionantes y más decisivos de toda la venta: la demostración. La demo es el momento de la verdad, donde el cliente por fin ve ATRIA funcionando con sus propios ojos, donde deja de imaginarse cómo será y empieza a creer que esto es real y que es para él. Es donde las palabras se vuelven hechos. Pero quiero advertirte algo desde el primer minuto, porque es el error que arruina más demostraciones y hace que vendedores con buen producto pierdan ventas que tenían ganadas. Escúchalo bien: una buena demostración no muestra todo el producto. Una buena demostración muestra exactamente lo que le importa al cliente que tienes enfrente, y nada más. En los próximos treinta y cinco minutos vas a aprender, paso a paso, a preparar una demo con inteligencia, a estructurarla con un método claro, a adaptarla a quince, treinta o cuarenta y cinco minutos según el caso y el tiempo que tengas, a manejar el caso especial de los restaurantes, y a evitar los errores que hacen que una demo, por buena que parezca, se caiga al final. Cuando termines, vas a poder tomar todo lo que descubriste en el diagnóstico y convertirlo en una demostración que conecta, que emociona y que cierra. Este es un módulo muy práctico, así que presta mucha atención. Empecemos.",
    },
    {
      tipo: "agenda",
      kicker: "Lo que dominarás en este módulo",
      titulo: "El arte de la demostración",
      items: [
        ["Preparar y personalizar", "Elegir qué mostrar, y qué no"],
        ["La estructura en 4 pasos", "El esqueleto de toda demo"],
        ["Demos de 15, 30 y 45 min", "Adaptar según el caso"],
        ["El caso restaurante", "El flujo mínimo que debe verse"],
        ["Errores que la hunden", "Y cómo evitarlos"],
      ],
      notas:
        "Este es el plan de vuelo completo del módulo, para que sepas hacia dónde vamos. Vamos a empezar por la preparación, y no es casualidad que sea lo primero, porque una demostración se gana o se pierde antes de empezar, en la decisión silenciosa de qué vas a mostrar y qué vas a dejar fuera. La mayoría de los vendedores subestima esta parte, y ahí pierden. Luego veremos la estructura en cuatro pasos, que es el esqueleto que te va a servir para cualquier demo, con cualquier cliente, de cualquier rubro; un método que puedes repetir siempre. Después aprenderemos a adaptar la duración de la demo: veremos formatos de quince, de treinta y de cuarenta y cinco minutos, porque en la realidad no siempre tienes el mismo tiempo disponible ni el cliente necesita ver lo mismo. Saber ajustar el formato es señal de profesionalismo. Enseguida le dedicaremos un espacio especial y merecido al caso del restaurante, que tiene un flujo mínimo que siempre, sin excepción, debe mostrarse completo. Y cerraremos con los errores que hunden una demostración, esos que debes conocer bien para no cometerlos nunca. Como ves, cada bloque de este módulo te entrega una herramienta concreta y aplicable. Así que vamos a arrancar con la base de todo: la preparación.",
    },
    {
      tipo: "definicion",
      kicker: "El principio rector",
      titulo: "Una demo no muestra todo",
      frase: "Muestra solo lo que le importa al cliente que tienes enfrente.",
      apoyo: "La demo no es una exhibición del producto. Es la prueba, en vivo, de que su problema tiene solución.",
      notas:
        "Antes de entrar en la técnica y en los pasos concretos, necesito que interiorices el principio que gobierna absolutamente todo este módulo. Si entiendes esta sola idea de verdad, en el fondo, todo lo demás va a caer por su propio peso y te va a parecer obvio. Aquí va: una demo no muestra todo el producto; muestra solo lo que le importa al cliente que tienes enfrente. Repítelo en tu mente, porque va en contra del instinto natural del vendedor. El instinto te dice que mientras más funciones muestres, más valor entregas, ¿verdad? Pues es exactamente al revés. Mientras más funciones irrelevantes le muestras a un cliente, más diluyes tu mensaje central, más lo aburres y más lo confundes. Cada pantalla que abres y que no tiene que ver con su problema es una pantalla que le resta fuerza y claridad a tu demostración. Quiero que cambies la imagen mental que tienes de lo que es una demo. No la pienses como una exhibición del producto, como un desfile donde muestras todo lo bonito que tiene ATRIA. Piénsala, en cambio, como lo que realmente es: una prueba en vivo de que el problema específico del cliente tiene solución. El cliente, en el fondo, no quiere ver un software; no le interesa el software en sí. Lo que quiere ver es su propio dolor resuelto en la pantalla, su propia operación funcionando ordenada. Esa es toda la diferencia entre una demo que simplemente impresiona por un rato y luego se olvida, y una demo que de verdad vende y mueve al cliente a decidir. Con este principio bien clavado en la cabeza, ahora sí, vamos a la preparación.",
    },
    {
      tipo: "definicion",
      kicker: "Paso previo · Preparación",
      titulo: "Preparar y personalizar la demo",
      frase: "Con lo que descubriste en el diagnóstico, elige 2 o 3 módulos relevantes. No muestres funciones irrelevantes.",
      apoyo: "Sin diagnóstico no hay demo. Lo que aprendiste del cliente es el guion de lo que vas a mostrar.",
      notas:
        "La preparación es donde de verdad se gana la demostración, y sin embargo es la parte a la que casi nadie le da la importancia que merece. Los vendedores flojos improvisan; los buenos preparan. Aquí va la regla concreta que quiero que apliques siempre: con todo lo que descubriste en el diagnóstico, esa conversación previa donde entendiste cómo trabaja el negocio y cuáles son sus dolores, elige solamente dos o tres módulos relevantes para mostrar. No más de tres. Y no muestres funciones irrelevantes, por muy impresionantes o llamativas que te parezcan a ti como vendedor. Fíjate en la conexión profunda que existe entre el módulo de diagnóstico y este de demostración, porque es fundamental: sin diagnóstico, no hay demo posible. Lo que aprendiste del cliente en el diagnóstico es, literalmente, el guion de lo que vas a mostrar en la demo. No es una frase bonita, es así de directo. Si diagnosticaste bien, entonces ya sabes cuáles son los dos o tres dolores principales de ese negocio, y esos dolores te están diciendo, casi que te están dictando, exactamente qué pantallas debes abrir y cuáles debes dejar cerradas. Te doy un ejemplo para que quede clarísimo. Supón que en el diagnóstico el cliente te dijo dos cosas: que se le pierden productos constantemente y que su contabilidad va siempre atrasada. Bien, entonces tu demo tiene que girar en torno a dos módulos, y solo dos: inventario y contabilidad automática. Punto. No abras el módulo de restaurantes si estás con una ferretería. No te pongas a mostrar el multi-sucursal si tiene un solo local. Cada minuto que gastes en algo que no es su dolor es un minuto que le robas a lo que sí le importa. Mi consejo práctico: prepara tu demo la noche anterior, o al menos un rato antes, con el diagnóstico en la mano, decidiendo con calma qué vas a mostrar, en qué orden, y con qué ejemplos. Un asesor que llega preparado transmite una seguridad y un profesionalismo que el cliente percibe de inmediato, incluso antes de que abras la primera pantalla. La preparación se nota.",
    },
    {
      tipo: "estructura",
      kicker: "El esqueleto de toda demo",
      titulo: "La estructura en 4 pasos",
      pasos: [
        ["1", "Recap del dolor", "Recuerda en un minuto el problema que él mismo te contó.", "≈ 1 min"],
        ["2", "Solución en vivo enfocada", "Muestra ATRIA resolviendo justo ese dolor. Es el núcleo.", "El grueso"],
        ["3", "Beneficio en dinero/tiempo", "Traduce lo que vio a plata ahorrada u horas ganadas.", "≈ 2 min"],
        ["4", "Cierre + próximo paso", "Confirma interés y define qué sigue.", "≈ 2 min"],
      ],
      notas:
        "Ahora te voy a dar el esqueleto que sirve para toda demostración, sin importar el cliente, el rubro ni la duración. Es un método de cuatro pasos, y van siempre en este orden. Te los presento primero de corrido y luego los profundizamos uno por uno. Paso uno: recap del dolor. Antes de mostrar una sola pantalla, dedica alrededor de un minuto a recordarle al cliente el problema que él mismo te contó en el diagnóstico. Algo como: «Usted me dijo que se le pierden productos y que nunca sabe con certeza cuánto ganó realmente en el mes». Esto logra dos cosas poderosas al mismo tiempo: le demuestra que lo escuchaste con atención, y prepara su mente para valorar la solución que viene. Paso dos: la solución en vivo, enfocada. Este es el núcleo de la demo, el grueso de tu tiempo y de tu energía. Aquí muestras ATRIA resolviendo exactamente ese dolor, en vivo, con datos que se parezcan a los de su propio negocio. No navegues por menús que no vienen al caso, no te distraigas; ve directo a resolver el problema que él te planteó. Paso tres: el beneficio en dinero o en tiempo. Después de que el cliente vio la solución funcionando, no des por hecho que él solito sacó la cuenta del valor. Tradúcesela tú: «Mire, esto que acaba de ver le ahorra alrededor de diez horas al mes de cuadres, o le evita esas pérdidas de mercadería vencida que me contaba». Los números convencen mucho más que los adjetivos. Y paso cuatro: cierre más próximo paso. Nunca, nunca termines una demo sin dos cosas: confirmar el interés del cliente y definir claramente qué sigue, con fecha. Puede ser una propuesta, una segunda reunión, el registro. Estos cuatro pasos, recap, solución, beneficio y cierre, son tu mapa para cualquier demostración. Ahora vamos a verlos uno por uno, con más detalle, porque cada uno tiene su técnica.",
    },
    {
      tipo: "paso-detalle",
      kicker: "Paso 1 · Antes de mostrar nada",
      titulo: "Recap del dolor",
      frase: "«Usted me dijo que los pedidos se confunden y que no sabe qué platos dejan más margen.»",
      puntos: [
        "Demuestra que escuchaste en el diagnóstico.",
        "Enfoca la mente del cliente en su propio problema.",
        "Crea el contraste perfecto para la solución que viene.",
      ],
      notas:
        "Vamos a profundizar en el paso uno, el recap del dolor, porque es, paradójicamente, el que más gente se salta y a la vez el que más impacto tiene en toda la demostración. Es un minuto que vale oro. La técnica es simple: antes de mostrar absolutamente nada en la pantalla, antes de tocar el teclado, le repites al cliente su propio problema, con sus propias palabras si es posible, tal como te lo contó en el diagnóstico. Por ejemplo, a un dueño de restaurante le dirías: «Usted me dijo que los pedidos se confunden entre el salón y la cocina, y que no sabe cuáles de sus platos le dejan más margen y cuáles casi nada». ¿Por qué es tan poderoso arrancar así, en lugar de ir directo a mostrar el sistema? Por tres razones muy concretas. La primera razón: le demuestras, sin decírselo, que de verdad lo escuchaste durante el diagnóstico. No eres un vendedor genérico que repite el mismo discurso a todo el mundo; eres alguien que entendió su negocio en particular, y eso genera una confianza enorme. La segunda razón: enfocas su mente en su propio problema. Al recordarle su dolor, haces que reviva por un momento la molestia, la frustración; y así, cuando aparezca la solución en la pantalla, él va a estar mentalmente listo, incluso ansioso, por valorarla. Y la tercera razón, quizás la más importante: creas un contraste perfecto, casi cinematográfico. Primero el dolor, la incomodidad; e inmediatamente después, el alivio, la solución. Ese contraste entre el antes y el después es justamente lo que hace que la solución se sienta valiosa y deseable. Un producto sin un problema al lado no vale nada; un producto que llega justo después de recordar el dolor, vale muchísimo. Así que grábate esto: un minuto bien invertido aquí, en el recap del dolor, rinde más que diez minutos de demo a las carreras. Nunca, jamás, te lo saltes por querer llegar rápido al sistema.",
    },
    {
      tipo: "paso-detalle",
      kicker: "Paso 2 · El corazón de la demo",
      titulo: "Solución en vivo, enfocada",
      frase: "«Le muestro cómo se toma el pedido, se cobra y queda registrado, todo en un flujo.»",
      puntos: [
        "Antes de abrir una pantalla, di qué problema vas a resolver.",
        "Usa datos parecidos a los de su negocio: sus productos, sus precios.",
        "Enseña lo suficiente para que vea su operación más ordenada, no todo ATRIA.",
      ],
      notas:
        "El paso dos es el corazón de la demostración, es donde pasas la mayor parte del tiempo, y por eso merece que le dediquemos atención especial. Aquí es donde muestras ATRIA resolviendo el dolor, en vivo y en directo. Pero hay una técnica concreta que separa una demo profesional de una demo torpe y amateur, y te la voy a dar. La técnica es esta: antes de abrir cada pantalla, di en voz alta qué problema vas a resolver con ella. Repito, porque es sutil pero poderoso: no abras la pantalla y luego expliques qué es; primero anuncia qué vas a resolver, y después muestra. Es la diferencia entre «mire, este es el módulo de pedidos» y «usted me contó que los pedidos se le confunden; le voy a mostrar cómo con ATRIA se toma un pedido, se cobra y queda registrado, todo en un solo flujo, sin confusión». ¿Sientes cómo la segunda forma crea expectativa y le da sentido a lo que va a ver? Anuncia, y luego demuestra. El segundo consejo para este paso: usa datos que se parezcan a los del negocio del cliente. Si estás con una ferretería, mete en el sistema tornillos, pinturas, herramientas, cosas que él vende. Si es un restaurante, usa platos reales de su menú si los conoces, con sus nombres. ¿Por qué? Porque mientras más se reconozca el cliente en la pantalla, mientras más sienta que eso es su negocio y no un ejemplo genérico de laboratorio, más lo va a hacer suyo emocionalmente. Un dato genérico distancia; un dato familiar acerca. Y el tercer consejo, que es el más importante de este paso y de todo el módulo: enseña lo suficiente para que el cliente vea su operación más ordenada, no para que vea todo ATRIA. Una demo excelente no enseña el producto completo, con todos sus botones y menús; enseña justo lo necesario para que el cliente diga, en su cabeza: «así se vería mi negocio, por fin ordenado». Resiste la tentación, que va a ser fuerte, de mostrar de más, de lucirte con esa función extra tan bonita. Cada clic que no resuelve su dolor específico es un clic que le resta fuerza, foco y claridad a tu demostración. Menos, pero al blanco.",
    },
    {
      tipo: "paso-detalle",
      kicker: "Paso 3 · Traduce a valor",
      titulo: "Beneficio en dinero y tiempo",
      frase: "«Esto que acaba de ver le ahorra unas 10 horas de cuadres al mes y evita las pérdidas por vencimiento.»",
      puntos: [
        "El cliente no compra funciones; compra resultados.",
        "Traduce cada función a dinero ahorrado, tiempo ganado o riesgo evitado.",
        "Los números hacen tangible lo que los adjetivos solo prometen.",
      ],
      notas:
        "El paso tres es donde muchísimas demos se quedan cortas y pierden la venta en la línea de meta. El vendedor muestra la solución con orgullo, el cliente asiente y dice «qué bien», y ahí, justo ahí, el vendedor se detiene, creyendo que ya terminó. Pero falta el paso que convierte el simple interés en una decisión de compra: traducir todo lo que el cliente vio a un beneficio concreto, medido en dinero y en tiempo. Recuerda siempre un principio de fondo que rige toda venta: el cliente no compra funciones, el cliente compra resultados. A nadie, en el fondo, le emociona un asiento contable que se genera automáticamente; eso es una función. Lo que sí emociona a cualquier dueño de negocio es ahorrarse diez horas al mes de trabajo tedioso y dejar de pagarle a alguien por cuadres atrasados; eso es un resultado. Así que después de mostrar cada solución en la pantalla, tradúcela tú mismo, no esperes a que el cliente haga la cuenta solo, porque muchas veces no la hace. Por ejemplo, le dirías: «Esto que acaba de ver, la contabilidad que se arma sola con cada venta que usted hace, le ahorra alrededor de diez horas de cuadres al mes, y además le evita las pérdidas por productos vencidos que me comentaba». Fíjate en la mecánica de lo que hice: convertí cada función en una de tres monedas que todo dueño entiende: dinero ahorrado, tiempo ganado o riesgo evitado. Esos son los tres idiomas universales del comercio, y debes hablar al menos uno en cada beneficio. Y un detalle técnico que hace toda la diferencia: usa números siempre que puedas, aunque sean estimados razonables y honestos. ¿Por qué? Porque los números hacen tangible, concreto, agarrable, lo que los adjetivos solo prometen en el aire. Decir «esto es muy útil, muy bueno» no vende nada, porque es vago. Decir «esto le ahorra diez horas al mes» sí vende, porque el cliente puede imaginarse esas diez horas, puede tocarlas. Traduce siempre a valor, y traduce con números.",
    },
    {
      tipo: "paso-detalle",
      kicker: "Paso 4 · Nunca termines sin esto",
      titulo: "Cierre y próximo paso",
      frase: "«¿Le parece si preparo la propuesta con el plan que cubre este flujo y la vemos el jueves?»",
      puntos: [
        "Confirma el interés con una pregunta directa.",
        "Define siempre el siguiente paso concreto, con fecha.",
        "Una demo sin próximo paso es una conversación que se enfría.",
      ],
      notas:
        "Y llegamos al paso cuatro, el cierre de la demo, que es donde se pierden una cantidad increíble de ventas por un error tan simple como no pedir el siguiente paso. El vendedor hace todo bien y al final se despide con un tibio «cualquier cosa me avisa», y ahí muere la oportunidad. No dejes que te pase. Nunca, nunca termines una demostración sin hacer dos cosas concretas. La primera: confirma el interés del cliente con una pregunta directa, sin miedo y sin rodeos. Pregúntale abiertamente: «¿Cómo ve lo que le mostré?», «¿Esto resolvería lo que hablábamos al principio?», «¿Le hace sentido para su negocio?». Y luego cállate y deja que el cliente se pronuncie. Su respuesta te va a decir exactamente en qué punto está y qué le falta para decidir. No adivines: pregunta. La segunda cosa: define siempre un siguiente paso concreto y con fecha. No lo dejes flotando en un vago «yo le aviso» o «ahí estamos en contacto», porque eso es la muerte lenta de la venta. Di algo específico y con compromiso, como: «¿Le parece si preparo la propuesta con el plan que cubre justo este flujo que le mostré, y la vemos juntos el jueves a esta misma hora?». Fíjate que ahí hay una acción concreta, la propuesta, y una fecha concreta, el jueves. Entiende bien esto: una demo sin próximo paso definido es una conversación que se enfría, y una conversación fría es una venta que se muere despacio, sin que te des cuenta, mientras el cliente se distrae con los mil asuntos de su día a día. El próximo paso puede ser muchas cosas según el caso: una propuesta formal, una segunda reunión ahora con el dueño o con el socio, una prueba del sistema, o directamente el registro si el cliente ya está convencido y listo. Lo importante, lo innegociable, es que salgas de esa demostración con una fecha y una acción claramente acordadas entre los dos. Así mantienes vivo el impulso que generaste y demuestras un profesionalismo que el cliente valora y respeta.",
    },
    {
      tipo: "duraciones",
      kicker: "Adapta según el tiempo y el caso",
      titulo: "Demos de 15, 30 y 45 minutos",
      cols: [
        ["15 min", "Solo el dolor principal", "Vas directo al problema número uno del cliente y lo resuelves en vivo. Ideal para un primer acercamiento o poco tiempo."],
        ["30 min", "Dolor + contabilidad", "Resuelves el dolor principal y sumas la contabilidad automática, que casi siempre suma valor y sorprende."],
        ["45 min", "Recorrido completo", "Dolor principal, contabilidad y reportes. Para clientes con decisión avanzada o varios interesados en la sala."],
      ],
      notas:
        "No todas las demostraciones duran lo mismo ni deben durar lo mismo, y saber adaptar la duración con criterio es una marca clara de profesionalismo que te diferencia. Te voy a dar tres formatos que puedes usar según el tiempo que tengas disponible y según el nivel de interés y de avance del cliente. Empecemos por la demo de quince minutos. Aquí vas directo al dolor principal del cliente, el número uno, y lo resuelves en vivo, sin rodeos ni preámbulos largos. Este formato es ideal para un primer acercamiento, cuando el cliente tiene poco tiempo, o cuando tu objetivo es abrir la puerta para conseguir una segunda reunión más larga después. Y no lo subestimes: un solo dolor, resuelto con claridad y contundencia, deja mucho mejor sabor de boca que diez funciones mostradas a las carreras y a medias. En quince minutos, calidad y foco por encima de cantidad. Sigamos con la demo de treinta minutos. En este formato resuelves el dolor principal del cliente y, además, le sumas la contabilidad automática. Y quizás te preguntes: ¿por qué siempre la contabilidad, incluso si no la pidió? Por una razón muy comercial: porque la contabilidad automática casi siempre suma valor y sorprende, incluso a clientes que ni sabían que la necesitaban. Es nuestro as bajo la manga, ese «ah, ¿y también hace esto?» que eleva la percepción de valor de todo el producto. Por eso, si tienes treinta minutos, casi siempre vale la pena incluirla. Y finalmente, la demo de cuarenta y cinco minutos, que es el recorrido más completo. Aquí muestras el dolor principal, la contabilidad y también los reportes. ¿Para quién es este formato largo? Es para clientes que ya tienen una decisión avanzada y quieren ver todo antes de dar el sí, o para cuando hay varias personas en la sala, como el dueño junto con su contador o su socio, y cada uno necesita ver la parte que le toca y le preocupa. La clave de todo esto, y con esto cierro, está en no confundir los formatos ni equivocarte de talla: no le des una demo maratónica de cuarenta y cinco minutos a alguien que solo tiene quince y va a estar mirando el reloj, ni tampoco despaches en quince minutos apurados a un cliente que ya está listo para decidir y que quería ver todo con calma. Lee el momento, lee al cliente, y elige el formato adecuado. Esa lectura es parte del arte de vender.",
    },
    {
      tipo: "caso-restaurante",
      kicker: "Caso especial",
      titulo: "El flujo mínimo del restaurante",
      flujo: ["Menú", "Pedido", "Cobro", "Efecto en inventario"],
      apoyo: "En un restaurante, aunque sea una demo corta, este flujo completo siempre debe verse. Es lo que le prueba al dueño que ATRIA entiende su operación.",
      notas:
        "Quiero dedicarle un espacio propio y detallado al caso del restaurante, porque tiene una particularidad que no puedes pasar por alto si quieres vender en el sector de la comida, que es enorme. En un restaurante, por corta que sea la demo, aunque solo tengas quince minutos, hay un flujo mínimo que siempre, sin excepción, debe verse completo. Ese flujo tiene cuatro pasos encadenados: menú, pedido, cobro y efecto en el inventario de insumos. Déjame explicarte por qué los cuatro pasos son obligatorios y por qué mostrarlos completos es lo que cierra ventas en restaurantes. Empiezas mostrando el menú cargado en el sistema, con sus platos, sus categorías y sus precios; que el dueño vea su carta ahí, digital y ordenada. Luego tomas un pedido, tal como lo haría un mesero capturándolo en una mesa real; eliges los platos, las cantidades, y el pedido queda registrado y viaja hacia la cocina sin papelitos de por medio. Después, ese mismo pedido pasa directo al cobro, y aquí el cliente ve algo que le encanta: cómo la caja cobra exactamente lo que se pidió, ni un plato de más ni uno de menos, sin errores ni «se me olvidó cobrar el postre». Y finalmente, y este es el paso que sella la demostración y que muchos vendedores olvidan mostrar, enseñas el efecto en el inventario: cómo, al vender ese plato, ATRIA descontó automáticamente los insumos y los ingredientes que se usaron para prepararlo. ¿Por qué es tan importante mostrar el flujo completo, los cuatro pasos, y no solo la caja bonita? Porque eso, precisamente eso, es lo que le prueba al dueño que ATRIA entiende su operación de verdad, de principio a fin, y que no es solamente una caja registradora más vestida de moderna. Cuando el dueño de un restaurante ve con sus propios ojos que un solo plato vendido mueve al mismo tiempo la caja y el inventario de insumos, hace clic en su cabeza: entiende que por fin va a tener control real sobre su negocio, sobre su dinero y sobre sus ingredientes. Ese momento de comprensión es exactamente el que cierra restaurantes. Así que grábate esos cuatro pasos como una secuencia sagrada: menú, pedido, cobro, inventario. Son el corazón de toda demostración gastronómica, y mostrarlos completos es tu mejor argumento de venta en ese sector.",
    },
    {
      tipo: "errores",
      kicker: "Cuidado con esto",
      titulo: "Errores que hunden una demo",
      items: [
        ["Demo genérica sin diagnóstico", "Mostrar lo mismo a todos, sin haber entendido el negocio. Se siente enlatada y no conecta."],
        ["No definir el siguiente paso", "Terminar sin acordar qué sigue. La conversación se enfría y la venta se pierde sola."],
      ],
      notas:
        "Antes de cerrar el módulo, vamos a hablar de los dos errores que hunden una demostración, para que los tengas siempre presentes y los evites de manera consciente. Son los dos más letales, y curiosamente son fáciles de cometer si no estás atento. El primer error es la demo genérica sin diagnóstico. Es el vendedor que muestra exactamente lo mismo a todos los clientes, con las mismas pantallas, en el mismo orden y con el mismo discurso memorizado, sin haberse tomado el tiempo de entender ese negocio en particular. El cliente lo detecta de inmediato, casi por instinto: se da cuenta de que está viendo una presentación enlatada, de molde, una que le sirve igual a él que al negocio de al lado, y en ese momento desconecta emocionalmente. Siente que no le estás hablando a él, sino a un cliente genérico que no existe. Recuérdalo siempre: sin diagnóstico previo, no hay demo que conecte ni que valga. La personalización es todo. El segundo error, que ya lo mencionamos en el paso cuatro pero que repito aquí porque es sencillamente letal, es no definir el siguiente paso al terminar. Es el drama del vendedor que hace una demostración brillante, técnicamente perfecta, el cliente queda encantado y sonriente, y luego se despiden con un «bueno, cualquier cosa me avisa». Esa venta, aunque el vendedor no lo sepa todavía, ya está muerta. La conversación se va a enfriar en cuestión de horas, el cliente se va a distraer con los mil asuntos de su día a día, el entusiasmo se va a evaporar, y la oportunidad se va a perder sola, sin que nadie la mate activamente. Simplemente se desvanece. Por eso, cierra siempre con una fecha y una acción concreta. Si logras evitar estos dos errores, si siempre personalizas con base en el diagnóstico y siempre cierras con un próximo paso claro, tus demostraciones van a estar, sin exagerar, muy por encima del promedio de cualquier vendedor del mercado. Son dos cosas simples, pero marcan toda la diferencia.",
    },
    {
      tipo: "resumen",
      kicker: "Para recordar",
      titulo: "Lo que te llevas de este módulo",
      items: [
        "Personaliza la demo según el diagnóstico: muestra solo lo relevante.",
        "Sigue la cadena función → problema → beneficio en cada pantalla.",
        "Cierra siempre con un próximo paso concreto y con fecha.",
      ],
      notas:
        "Vamos a resumir este módulo tan práctico y tan importante, quedándonos con las ideas que debes aplicar en cada demostración que hagas de aquí en adelante. Primera idea: personaliza la demo según el diagnóstico. Antes de mostrar absolutamente nada, elige con criterio dos o tres módulos relevantes, y muestra solamente lo que le importa a ese cliente en particular. La demo se prepara, no se improvisa. Segunda idea: en cada pantalla que abras, sigue la cadena de oro que aprendiste en el módulo de producto, función, problema, beneficio. Anuncia el problema que vas a resolver, muestra en vivo la función que lo resuelve, y traduce el resultado a dinero ahorrado o a tiempo ganado. Esa cadena aplica también aquí, en la demostración. Tercera idea: cierra siempre, sin excepción, con un próximo paso concreto y con fecha. Una demo sin próximo paso definido es una venta que se enfría y se pierde sola. Y como bonus, para el caso de los restaurantes, no olvides nunca el flujo mínimo completo: menú, pedido, cobro e inventario, los cuatro pasos siempre. Con estas ideas bien aplicadas, dominas el arte de la demostración, que es una de las habilidades que más venden.",
    },
    {
      tipo: "cierre",
      kicker: "Cierre del Módulo 07",
      titulo: "Listo para demostrar",
      frase: "Ya sabes preparar, estructurar y cerrar una demo que conecta cada función con un problema real.",
      cta: "Siguiente paso: presenta el examen del Módulo 07 y practica en el Simulador antes de tu primera demo real.",
      notas:
        "Y con esto cerramos el Módulo 7, uno de los más decisivos de toda la academia. Diste un paso enorme, y quiero que lo valores, porque la demostración es justamente donde muchísimas ventas se ganan o se pierden, y ahora tú tienes un método claro y repetible para ganarlas. Repasemos todo lo que te llevas: ya sabes preparar la demo con base en el diagnóstico, eligiendo qué mostrar y qué callar; ya sabes estructurarla en cuatro pasos, recap del dolor, solución en vivo, beneficio y cierre; ya sabes adaptarla a quince, treinta o cuarenta y cinco minutos según el caso; ya sabes manejar el flujo especial y completo del restaurante; y ya sabes cerrar siempre con un próximo paso concreto y con fecha. Es un arsenal completo. Tienes además, como recurso de apoyo, el guion de demo de quince, treinta y cuarenta y cinco minutos; te recomiendo mucho que lo revises y lo uses para practicar. Y ese es justamente mi último y más importante consejo para ti: practica antes de tu primera demo real con un cliente. No estrenes tu demostración con alguien que puede convertirse en una venta. Usa el Simulador de la plataforma para ensayar una y otra vez, equivócate ahí, en el entorno seguro donde no hay nada en juego, corrige, y llega a tu cliente real con la seguridad y la soltura de quien ya lo ha hecho muchas veces. El cliente lo va a notar. Así que ya sabes: presenta el examen de este módulo para afianzar lo aprendido, y luego ve directo al Simulador a practicar. Nos vemos en el próximo video, y de corazón, mucho éxito en tus demostraciones. Vas a hacerlo muy bien.",
    },
  ],
};

module.exports = { BRAND, MODULOS: [MOD1, MOD2, MOD7] };
