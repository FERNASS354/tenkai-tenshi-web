// Precios regulares y de lanzamiento del catálogo publicado.
export const editions = [
 {id:'starter',name:'Starter',regular:899,promotion:499,text:'Venta, caja e inventario base; familias, granel, clientes, pedidos, mayoreo e importación de catálogo.'},
 {id:'professional',name:'Professional',regular:1499,promotion:999,text:'Herramientas de Starter más combos, lotes y caducidades, costo ponderado, producción, apartados, membresías y reportes avanzados.'},
 {id:'distribution',name:'Distribution',regular:1899,promotion:1499,text:'Herramientas de Professional más inventario móvil, recepción, conteos, productos vigilados e importación de proveedor.'},
 {id:'business',name:'Business',regular:3999,text:'Operación ampliada y cinco cajas remotas incluidas. Confirma los módulos y servicios de tu instalación al contratar.'},
];
export const additions = [
 {id:'multicaja',name:'MultiCaja',regular:799,promotion:499,text:'Módulo con una caja adicional para ampliar el mostrador.',extra:{regular:299,promotion:199,unit:'MXN · por caja posterior'}},
 {id:'resguardo',name:'Resguardo',regular:799,promotion:499,text:'Módulo de contingencia. Requiere preparar y autorizar el dispositivo.'},
 {id:'care',name:'Tenkai Care',regular:499,promotion:299,unit:'MXN · al año',text:'Soporte por WhatsApp y hasta dos cambios de PC asistidos por año.'},
 {id:'sync-boss',name:'Sync + Boss',regular:1499,unit:'MXN · al año',label:'Precio del piloto',text:'Care incluido durante el piloto. Consulta disponibilidad y condiciones.'},
];
