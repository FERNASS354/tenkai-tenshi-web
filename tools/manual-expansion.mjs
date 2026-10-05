// Ampliación de explicaciones para usuarios nuevos, con recorridos de producción.
export function expandManuals(manuals){
 const replace=(app,id,entry)=>{const i=manuals[app].findIndex(c=>c[0]===id);if(i<0)throw new Error('Capítulo ausente: '+app+'/'+id);manuals[app][i]=entry;};
 const insert=(app,after,entries)=>{const i=manuals[app].findIndex(c=>c[0]===after);if(i<0)throw new Error('Capítulo ausente: '+after);manuals[app].splice(i+1,0,...entries);};
 replace('pos','mermas',['mermas','MED: registrar y autorizar una merma','Una merma es mercancía que ya no se venderá y que no tiene cambio con proveedor. Ejemplo: una botella rota.',[
  'En Gestión, abre MED y elige Nuevo Registro MED. Selecciona Merma.',
  'Busca el producto, captura la cantidad y el motivo y adjunta la fotografía solicitada.',
  'Conserva el registro pendiente para que lo revise el encargado, administrador o dueño autorizado.',
  'La persona autorizada revisa la evidencia y usa Autorizar Desecho con su PIN, o rechaza la solicitud.',
  'Comprueba el estado y el historial. Solo la merma autorizada descuenta las existencias; conservar una solicitud pendiente no equivale a aprobarla.',
 ],'Separa la mercancía dañada mientras se revisa. El registro conserva quién autorizó la baja. No registres el mismo desecho otra vez.']);
 insert('pos','mermas',[[ 'proveedores-med','MED: pedir y recibir un cambio de proveedor','Este recorrido sirve para mercancía que el proveedor debe reponer. No es la devolución de una compra hecha por un cliente.',[
  'En MED, crea un registro de Devolución o Cambio a Proveedor.',
  'Selecciona el proveedor, el producto y la cantidad que debe cambiarse. Añade el motivo y la evidencia disponible.',
  'Conserva el estado por pedir mientras todavía no solicitas la reposición.',
  'Marca Cambio pedido cuando ya lo solicitaste. Revisa los pendientes por proveedor.',
  'Cuando el cambio se complete, registra el estado realizado y conserva el historial.',
 ],'Estos estados organizan el seguimiento: no agregan ni descuentan inventario por sí solos. Comprueba la mercancía físicamente y usa la entrada o ajuste que corresponda a la entrega real.']]);
 insert('pos','inventario',[
  ['conteos','Contar y comparar lo registrado','Un conteo dice cuánto hay físicamente. Una entrada dice cuánto acaba de llegar. Ejemplo: POS indica 20 piezas, pero cuentas 17.',[
   'Elige los productos que revisarás y confirma si se cuentan por pieza, kilogramo, metro o lote.',
   'Cuenta físicamente y conserva el resultado. Si hay dudas, repite el conteo antes de cambiar las existencias.',
   'En POS, abre Inventario y busca o escanea el producto. Revisa la existencia que muestra.',
   'Si usas Inventory, captura el conteo y abre Auditoría para revisar faltantes y sobrantes.',
   'Aplica el ajuste únicamente después de revisar el resultado y con un usuario autorizado. Conserva el motivo y el historial.',
  ],'En el ejemplo faltan 3 piezas respecto a lo registrado. El conteo no determina por sí solo por qué faltan: revisa entregas, ventas y movimientos antes de concluir.'],
  ['diferencias','Agregar, quitar o fijar una existencia','Las tres opciones cumplen trabajos diferentes. Elige la que describe lo ocurrido.',[
   'Agregar suma una entrega: si había 20 piezas y recibiste 5, la existencia llega a 25.',
   'Quitar registra una salida o ajuste autorizado: si había 20 y debes retirar 3, queda en 17. Una merma debe seguir su autorización en MED.',
   'Fijar Fijo establece el total contado: si contaste 17 piezas, captura 17 como existencia final; no lo uses como una entrada de 17.',
   'Revisa la cantidad, la unidad y el motivo antes de confirmar. No cambies la unidad para resolver una diferencia.',
   'Comprueba el resultado y el movimiento guardado. Si otra caja siguió vendiendo mientras contabas, revisa los movimientos recientes antes de aplicar una corrección.',
  ],'Recibir, contar y desechar son tareas distintas. Tener un permiso para una de ellas no significa que el usuario pueda hacer las demás.'],
  ['familias-inventario','Inventario individual, compartido y detallado','Una familia reúne productos relacionados. La forma de contar sus existencias depende de cómo la configures.',[
   'Individual: cada artículo conserva su propia existencia. Úsalo cuando necesitas distinguir cada producto.',
   'Compartido: los artículos de la familia usan una existencia común. Revisa ese total en lugar de darlo de alta otra vez en cada artículo.',
   'Detallado: conserva el detalle de los artículos vinculados y revisa también el total de la familia.',
   'Define el modo antes de operar y comprueba qué productos pertenecen a la familia.',
   'Haz las entradas y los conteos en la unidad correspondiente. Si vas a cambiar el modo de una familia que ya tiene mercancía, revisa sus existencias antes y después.',
  ],'Agrupar por categoría ayuda a organizar. Compartir inventario cambia cómo se controla la mercancía; confirma que esa elección corresponde a tu tienda.'],
  ['ponderado','Inventario ponderado: entender el costo promedio','Este módulo combina el costo de la mercancía que ya tenías con el de la nueva entrega. No cambia automáticamente la cantidad que contaste.',[
   'Confirma que Inventario ponderado esté habilitado en tu instalación.',
   'Al recibir mercancía, captura la cantidad y el precio de compra nuevo.',
   'POS calcula el promedio tomando en cuenta lo que había y lo recibido.',
   'Ejemplo: 10 piezas a $20 y 10 nuevas a $30 dejan 20 piezas con un costo promedio de $25.',
   'Revisa el costo resultante y, por separado, el precio al que quieres vender. Confirma antes de guardar.',
  ],'Cantidad, costo y precio de venta son datos diferentes. El promedio ayuda a revisar costos; no sustituye el conteo físico.'],
  ['inventario-revisar','Resolver existencias negativas o pendientes','Una venta conservada puede requerir revisar cómo quedó aplicada la mercancía. Primero cuenta; después corrige con permiso.',[
   'Consulta los productos con existencias negativas y las entradas de Inventario por revisar disponibles en tu instalación.',
   'Revisa el folio, el producto, su unidad y los movimientos recientes.',
   'Cuenta físicamente. En productos con lotes, revisa el conteo de cada lote.',
   'Captura el resultado y el motivo en el recorrido de revisión. Confirma con un usuario autorizado.',
   'Consulta el historial y comprueba el estado resuelto. Conserva los cobros y los comprobantes originales.',
  ],'Restablecer un negativo a cero es un ajuste administrativo: no agrega mercancía física ni borra ventas. Úsalo solo cuando la revisión justifique ese resultado.'],
 ]);
 insert('pos','dolares',[[ 'recargas','Registrar recargas telefónicas','Este módulo organiza la venta de recargas y la comisión que corresponde al negocio.',[
  'Configura los productos o compañías y las comisiones que utilizarás en tu instalación.',
  'Abre el acceso de Recargas desde Ventas y selecciona la opción correspondiente.',
  'Revisa el importe y registra el cobro con la forma de pago correcta.',
  'Comprueba la recarga con el servicio que utilizas y conserva el registro de la venta.',
  'Revisa los importes y comisiones al consultar la caja.',
 ],'Registrar una venta en POS y entregar una recarga con tu proveedor son partes diferentes del recorrido. Confirma la preparación del servicio antes de ofrecerlo.']]);
 replace('pos','devolver',['devolver','Devolver productos de una venta','Parte del ticket original para saber qué se vendió y cuánto se ha devuelto. Ejemplo: el cliente devuelve una de las tres piezas que compró.',[
  'Abre el historial de ventas y selecciona el comprobante correspondiente.',
  'Elige Procesar devolución o el renglón que se devolverá, según la pantalla de tu instalación.',
  'Captura únicamente las cantidades que regresan y escribe el motivo. No puedes devolver más de lo que queda disponible en esa venta.',
  'Revisa el importe y la autorización solicitada. Si la venta tuvo dólares, confirma la opción de reembolso que muestra POS.',
  'Confirma, comprueba el resultado y conserva el comprobante. Revisa cómo quedaron inventario y caja.',
 ],'Si el artículo devuelto está dañado y no debe venderse, sepáralo y sigue el recorrido de MED. Una devolución del cliente no equivale a autorizar su desecho.']);
 replace('inventory','auditoria',['auditoria','Conteos, faltantes y sobrantes','Cuenta lo que hay físicamente y revisa la diferencia con POS antes de cambiar el inventario.',[
  'Abre Inventarios y busca o escanea el producto. Confirma la unidad en que lo cuentas.',
  'Captura lo contado y revisa el renglón antes de seguir con otro artículo.',
  'Termina el recorrido y abre Auditoría. Revisa las diferencias positivas y negativas.',
  'Ejemplo: se registraron 20 piezas y contaste 17; hay un faltante de 3. Si contaste 22, hay un sobrante de 2.',
  'Comprueba el reporte de valor: usa el precio de compra de la mercancía, no el precio al que la vendes.',
  'Se aplica la diferencia del conteo. Ejemplo: POS marcaba 20 y contaste 17; el ajuste quita 3. Si después vendiste 2, las 18 registradas pasan a 15 al aplicar. Las ventas nuevas se conservan.',
  'Conecta con POS y aplica únicamente la auditoría revisada y autorizada. Comprueba la confirmación y el historial del teléfono.',
 ],'No confundas un faltante con una entrega. Cancelar una auditoría no descuenta mercancía. Si POS siguió registrando movimientos durante el conteo, revisa que la comparación siga vigente.']);
 insert('inventory','auditoria',[[ 'tipos-inventario','Elegir entre recepción y conteo','Usa el recorrido que corresponde a lo que estás haciendo.',[
  'Mercancías: prepara y envía una entrega nueva. La cantidad enviada se suma a la tienda al confirmar la recepción.',
  'Inventarios: captura cuánto hay físicamente de un producto para compararlo con lo registrado.',
  'Auditoría: reúne y revisa diferencias del conteo antes de aplicar ajustes.',
  'Productos vigilados: captura la revisión que el dueño solicita para el cambio de turno.',
  'MED: registra una merma o un cambio con proveedor y sigue su autorización o su estado.',
 ],'Ejemplo: recibir 12 piezas no es lo mismo que contar 12 piezas. Elegir el recorrido correcto evita sumar un conteo como si fuera mercancía nueva.']]);
}
