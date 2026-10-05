// Guía comercial por tareas; contrastada con las pantallas y módulos de POS.
// Cada entrada: nombre, explicación, ejemplo y capítulo del manual.
export const posGuide = [
 ['cobrar','Cobrar y atender','Del primer producto al comprobante.',[
  ['Ventas y tickets','Escanea o busca el producto. Prepara la compra y conserva varios tickets cuando atiendes a más de una persona.','Deja un ticket abierto mientras el cliente busca otro artículo.','venta'],
  ['Formas de pago','Registra efectivo, tarjeta o una combinación. Revisa lo recibido y el cambio antes de confirmar.','Una compra puede pagarse con una parte en efectivo y otra en tarjeta.','cobrar'],
  ['Peso, metros y presentaciones','Vende por pieza, peso, importe o las presentaciones que hayas configurado. La venta por metro requiere su módulo.','Captura 250 g de un producto o 2.5 metros de cable en la unidad correspondiente.','granel'],
  ['Captura rápida','Busca por nombre o código y captura cantidad y código juntos cuando necesitas varias piezas.','Agrega cinco piezas con una sola captura, en lugar de escanear cinco veces.','buscar'],
  ['Dólares','Usa el tipo de cambio de la tienda y revisa la conversión. El cambio de la venta se entrega en pesos.','El cliente paga en dólares y el cajero comprueba los pesos equivalentes.','dolares'],
  ['Devolución de una venta','Abre el ticket original y elige lo que el cliente devuelve. Conserva cantidades, motivo y el movimiento resultante.','El cliente devuelve una pieza de un ticket con tres artículos.','devolver'],
  ['Recargas telefónicas','Registra las recargas que vendes y la comisión configurada para revisar esa parte de la caja.','Distingue el importe de la recarga de la comisión del negocio.','recargas'],
 ]],
 ['mercancia','Recibir y contar mercancía','Lo que entra, lo que hay y lo que necesita revisión.',[
  ['Entradas de mercancía','Agrega lo que realmente recibiste. Revisa cantidades, unidades y costo de compra.','Llegaron 24 botellas: registra las 24 recibidas.','inventario'],
  ['Conteos y diferencias','Cuenta físicamente y compara con lo registrado. Revisa faltantes y sobrantes antes de autorizar un ajuste.','POS indica 20 piezas, pero cuentas 17: hay una diferencia de 3.','conteos'],
  ['Inventario por producto o familia','Elige si cada artículo lleva su propia existencia, si comparte una existencia con su familia o si se revisa por variante.','Varios sabores pueden llevar existencias separadas o compartir el control configurado.','familias-inventario'],
  ['Mínimos e historial','Define cuándo un artículo necesita surtido y consulta por qué aumentó o disminuyó su existencia.','Revisa si un producto bajó por una venta, una merma o un ajuste.','inventario'],
  ['Existencias negativas y pendientes','Revisa los productos que necesitan un recuento. Un ajuste de inventario conserva las ventas ya registradas.','Una venta de otra caja dejó una diferencia: cuenta y comprueba antes de corregir.','inventario-revisar'],
 ]],
 ['perdidas','Mermas y cambios con proveedores','Distingue una pérdida de una mercancía que deben reponerte.',[
  ['MED · mermas','Registra producto, cantidad, motivo y fotografía. Una persona autorizada revisa y aprueba el desecho con su PIN. Al autorizar, se descuentan las existencias.','Una botella se rompió y no tiene cambio: solicita la baja como merma.','mermas'],
  ['MED · cambios con proveedor','Organiza los productos que el proveedor debe cambiar. Sigue los estados: por pedir, cambio pedido y realizado.','Llegó un paquete dañado: deja registrado a quién se le pidió la reposición.','proveedores-med'],
  ['Seguimiento separado','El cambio con proveedor conserva sus pendientes e historial. Cambiar su estado no agrega ni descuenta mercancía automáticamente.','Marcar un cambio como realizado deja constancia del seguimiento.','proveedores-med'],
 ]],
 ['catalogo','Organizar productos','Un catálogo fácil de encontrar y mantener.',[
  ['Altas y datos avanzados','Captura nombre, código, precio y unidad. Con las opciones avanzadas puedes añadir marca, mínimos y otros datos.','Da de alta una bolsa de arroz con su precio y código.','productos'],
  ['Categorías, familias y códigos','Agrupa los artículos y asocia los códigos que identifican el mismo producto. Evita crear existencias distintas para el mismo artículo.','El código anterior y el del proveedor pueden encontrar el mismo producto.','codigos'],
  ['Presentaciones','Indica el contenido del producto y configura las presentaciones de venta que corresponden.','Distingue una botella de 600 ml de una presentación de 1 litro.','presentaciones'],
  ['Importación de catálogos','Revisa archivos compatibles y agrega artículos nuevos. La importación de proveedor y el inicio desde Eleventa tienen recorridos propios.','Comprueba códigos, costos, precios y existencias antes de confirmar.','importar'],
 ]],
 ['precios','Cuidar precios y costos','Vender con reglas claras y entender lo que te cuesta la mercancía.',[
  ['Actualización de precios','Revisa costos y precios sugeridos. Los cambios por categoría o familia necesitan el alcance correspondiente.','Actualiza una familia cuando cambió su costo, sin ajustar toda la tienda.','promociones'],
  ['Mayoreo y precios especiales','Configura las condiciones para cobrar un precio distinto por cantidad o por cliente.','Un cliente frecuente tiene un precio acordado para cierto producto.','especiales'],
  ['Ofertas, combos y paquetes','Configura promociones. Los combos combinan productos distintos y requieren su módulo.','Dos productos que forman un paquete se cobran con el precio configurado.','promociones'],
  ['Inventario ponderado · costo promedio','Al recibir a otro costo, calcula un promedio con la mercancía anterior y la nueva. El precio de venta se revisa por separado.','10 piezas a $20 y otras 10 a $30 dejan un costo promedio de $25 por pieza.','ponderado'],
 ]],
 ['caja','Revisar caja y turnos','Cada movimiento de dinero tiene un motivo.',[
  ['Apertura y fondo inicial','Registra con cuánto dinero comienza el cajero y trabaja con el usuario correspondiente.','El turno inicia con $500 para dar cambio.','abrir'],
  ['Entradas, salidas y proveedores','Registra dinero agregado, retiros y pagos a proveedores para explicar lo que hay en el cajón.','Anota el pago de una entrega y su motivo.','caja'],
  ['Arqueo y corte','Cuenta el efectivo, compara lo esperado y revisa diferencias antes de cerrar.','Comprueba las ventas y los retiros del turno junto al efectivo contado.','corte'],
  ['Productos vigilados','Solicita el conteo de artículos importantes al cambiar de turno.','Cuenta los productos que el dueño eligió para revisar en el relevo.','vigilados'],
 ]],
 ['clientes','Dar seguimiento a clientes','Acuerdos y compras que continúan después del mostrador.',[
  ['Clientes, crédito y abonos','Relaciona compras con un cliente. Cuando está habilitado, registra crédito, límites y abonos.','Consulta cuánto debe una persona y registra su pago.','clientes'],
  ['Pedidos y cotizaciones','Prepara una propuesta y conserva sus artículos para convertirla en venta cuando se confirme.','Cotiza una compra completa antes de que el cliente decida.','cotizaciones'],
  ['Apartados','Registra el anticipo, los abonos y el saldo. Conserva el seguimiento de la mercancía reservada.','Un cliente aparta un artículo y termina de pagarlo después.','apartados'],
  ['Membresías','Configura planes y revisa su vigencia en la instalación que tenga este módulo.','Consulta cuándo termina o se renueva el plan de un cliente.','membresias'],
 ]],
 ['giros','Trabajar según tu negocio','Herramientas para mercancía y tareas particulares.',[
  ['Lotes y caducidades','Registra lotes, fechas y existencias de los productos que requieren ese control.','Revisa qué lote de un medicamento tiene la caducidad más cercana.','medicamentos'],
  ['Producción diaria','Registra cantidades elaboradas y su costo para dar entrada a lo que podrás vender.','La panadería registra las piezas que produjo durante el día.','produccion'],
  ['Configuración por tareas','Habilita lo que tu negocio utiliza. Las funciones disponibles dependen de tu edición, módulos, permisos y versión.','Una ferretería puede necesitar metros; una tienda de abarrotes, presentaciones.','antes'],
 ]],
 ['resultados','Entender resultados','Revisa lo ocurrido antes de tomar una decisión.',[
  ['Ventas y formas de pago','Consulta las ventas y distingue efectivo, tarjeta y otros pagos registrados.','Compara lo vendido con el efectivo del cajón, que también incluye otros movimientos.','reportes'],
  ['Reportes avanzados','Consulta utilidad, ventas por periodos y productos sin movimiento cuando tu edición los incluya.','Detecta mercancía que lleva tiempo sin venderse.','reportes'],
  ['Usuarios y permisos','Define qué puede hacer cada persona y qué acciones necesitan autorización.','El cajero cobra; el encargado revisa una baja de mercancía.','usuarios'],
  ['Respaldos y cambio de equipo','Conserva una copia utilizable y prepara la transferencia antes de cambiar de computadora.','Recupera tu tienda desde una copia y conserva los pendientes recientes.','respaldo'],
 ]],
 ['conectar','Ampliar tu tienda','Cada aplicación adicional resuelve una tarea concreta.',[
  ['Inventory','Prepara surtidos y conteos en el celular. Guarda mercancía sin señal y envía el lote al llegar a la tienda.','El dueño prepara la lista una vez; el encargado revisa sin volver a capturarla.','conexiones'],
  ['MultiPos y Resguard','MultiPos agrega cajas a la tienda. Resguard prepara otro dispositivo para una contingencia de la principal.','Atiende en paralelo o conserva ventas para conciliarlas al recuperar la principal.','conexiones'],
  ['Boss y Sync','Boss permite consultar y administrar. Sync distribuye cambios y reportes entre las sucursales conectadas.','Publica un precio y comprueba qué tiendas ya lo recibieron.','conexiones'],
 ]],
];
