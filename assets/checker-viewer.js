/* Visor publico: solo exterior cerrado; sin dependencias ni controles CAD. */
(() => {
  const root = document.querySelector('[data-checker-viewer]');
  if (!root) return;
  const canvas = root.querySelector('canvas');
  const status = root.querySelector('[role="status"]');
  const views = root.querySelectorAll('[data-view]');
  const buttons = root.querySelectorAll('button');
  const allowed = new Set(['cuerpo','tapa','vidrio','area_pantalla','cara_lector','aro_optico','lente','tapa_usb','cassette_lector','junta_bisel','junta_optica','seguro_pared']);
  const palette = {shell:[.29,.33,.39],glass:[.055,.09,.13],display:[.13,.21,.28],metal:[.44,.49,.56],foam:[.07,.09,.12]};
  let yaw=2.55, pitch=.25, zoom=1.42, frame=0, render=null, gl=null;
  const norm=v=>{const n=Math.hypot(...v)||1;return v.map(x=>x/n);};
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
  const mul=(a,b)=>{const c=new Float32Array(16);for(let j=0;j<4;j++)for(let i=0;i<4;i++)for(let k=0;k<4;k++)c[j*4+i]+=a[k*4+i]*b[j*4+k];return c;};
  function camera(){
    const eye=[Math.sin(yaw)*Math.cos(pitch)*5,Math.sin(pitch)*5,Math.cos(yaw)*Math.cos(pitch)*5];
    const z=norm(eye),x=norm(cross([0,1,0],z)),y=cross(z,x);
    const view=new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);
    const aspect=canvas.width/canvas.height,h=zoom*Math.max(1,.95/aspect),w=h*aspect;
    return mul(new Float32Array([1/w,0,0,0,0,1/h,0,0,0,0,-2/19,0,0,0,-21/19,1]),view);
  }
  function draw(){if(render&&!frame)frame=requestAnimationFrame(()=>{frame=0;render();});}
  function view(name){
    [yaw,pitch]=({oblicua:[2.55,.25],frente:[Math.PI,.035],perfil:[Math.PI/2,.035],detras:[0,.035]})[name];
    views.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));
    status.textContent='Vista '+({oblicua:'en tres cuartos',frente:'frontal',perfil:'lateral',detras:'posterior'})[name]+'.';
    draw();
  }
  function magnify(factor){zoom=Math.max(1.08,Math.min(2.25,zoom*factor));draw();}
  function failed(message){
    root.dataset.ready='fallback';buttons.forEach(b=>b.disabled=true);
    status.classList.remove('sr-only');status.textContent=message;
    root.querySelector('.checker-help').textContent='Vista previa estática del diseño 2.0.';
  }
  async function start(){
    try {
      gl=canvas.getContext('webgl',{antialias:true,alpha:true,preserveDrawingBuffer:true});
      if(!gl){failed('El visor 3D no está disponible en este navegador. Puedes ver la imagen del diseño.');return;}
      const response=await fetch(root.dataset.model);
      if(!response.ok)throw new Error('No se pudo cargar el modelo');
      const data=await response.json();
      if(data.version!=='2.0'||!Array.isArray(data.parts)||data.parts.length!==allowed.size)throw new Error('Modelo inesperado');
      const uint=gl.getExtension('OES_element_index_uint');
      function bytes(s){if(typeof s!=='string')throw new Error('Geometría inválida');const raw=atob(s),b=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)b[i]=raw.charCodeAt(i);return b;}
      function buffer(kind,b){const v=gl.createBuffer();gl.bindBuffer(kind,v);gl.bufferData(kind,b,gl.STATIC_DRAW);return v;}
      const meshes=data.parts.map(m=>{
        if(!allowed.has(m.name)||!palette[m.material]||!Number.isInteger(m.count)||m.count<1||m.count>200000||![2,4].includes(m.indexBytes)||(m.indexBytes===4&&!uint))throw new Error('Geometría no compatible');
        const p=bytes(m.v),n=bytes(m.n),i=bytes(m.i);
        if(p.length%6||n.length!==p.length/2||i.length!==m.count*m.indexBytes)throw new Error('Buffers incompletos');
        return {...m,pb:buffer(gl.ARRAY_BUFFER,p),nb:buffer(gl.ARRAY_BUFFER,n),ib:buffer(gl.ELEMENT_ARRAY_BUFFER,i)};
      });
      if(new Set(meshes.map(m=>m.name)).size!==allowed.size)throw new Error('Piezas duplicadas');
      const vs='attribute vec3 aPosition;attribute vec3 aNormal;uniform mat4 uMatrix;varying vec3 vNormal;void main(){vec3 p=aPosition*0.0001-vec3(0.0,0.0,0.49);vNormal=aNormal;gl_Position=uMatrix*vec4(p,1.0);}';
      const fs='precision mediump float;varying vec3 vNormal;uniform vec3 uColor;void main(){vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;float l=.48+.48*max(0.0,dot(n,normalize(vec3(-.6,.9,-.7))))+.28*max(0.0,dot(n,normalize(vec3(.7,.35,.7))));gl_FragColor=vec4(uColor*l,1.0);}';
      function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('No se pudo preparar el visor');return s;}
      const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('No se pudo iniciar el visor');
      const p=gl.getAttribLocation(program,'aPosition'),n=gl.getAttribLocation(program,'aNormal'),matrix=gl.getUniformLocation(program,'uMatrix'),color=gl.getUniformLocation(program,'uColor');
      render=()=>{
        const ratio=Math.min(devicePixelRatio||1,2),w=Math.round(canvas.clientWidth*ratio),h=Math.round(canvas.clientHeight*ratio);
        if(!w||!h)return;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
        gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.useProgram(program);gl.uniformMatrix4fv(matrix,false,camera());
        for(const m of meshes){
          gl.bindBuffer(gl.ARRAY_BUFFER,m.pb);gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,3,gl.SHORT,false,0,0);
          gl.bindBuffer(gl.ARRAY_BUFFER,m.nb);gl.enableVertexAttribArray(n);gl.vertexAttribPointer(n,3,gl.BYTE,true,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.ib);
          gl.uniform3fv(color,palette[m.material]);gl.drawElements(gl.TRIANGLES,m.count,m.indexBytes===4?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT,0);
        }
        if(gl.getError()!==gl.NO_ERROR)throw new Error('Error de dibujo 3D');
        root.dataset.ready='true';root.dataset.frames=String(Number(root.dataset.frames||0)+1);
      };
      new ResizeObserver(draw).observe(canvas);
      root.dataset.parts=String(meshes.length);status.textContent='Modelo exterior 2.0 listo. Puedes girarlo con el ratón, el dedo o el teclado.';
      draw();
    } catch(error){failed('No fue posible cargar la vista 3D. La imagen muestra el diseño exterior 2.0.');}
  }
  views.forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));
  root.querySelectorAll('[data-zoom]').forEach(b=>b.addEventListener('click',()=>magnify(b.dataset.zoom==='in'?.88:1.13)));
  root.querySelector('[data-reset]').addEventListener('click',()=>{zoom=1.42;view('oblicua');});
  let drag=null;
  canvas.addEventListener('pointerdown',e=>{if(!render||e.button!==0)return;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;yaw-=dx*.009;pitch=Math.max(-.75,Math.min(.85,pitch+dy*.007));drag={x:e.clientX,y:e.clientY};views.forEach(b=>b.setAttribute('aria-pressed','false'));draw();});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>drag=null);
  canvas.addEventListener('keydown',e=>{
    const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'];if(!render||!keys.includes(e.key))return;e.preventDefault();
    if(e.key==='Home'){zoom=1.42;view('frente');return;}
    if(e.key==='+'||e.key==='=')magnify(.88);else if(e.key==='-')magnify(1.13);
    else{yaw+=(e.key==='ArrowLeft'?.16:e.key==='ArrowRight'?-.16:0);pitch=Math.max(-.75,Math.min(.85,pitch+(e.key==='ArrowUp'?.12:e.key==='ArrowDown'?-.12:0)));views.forEach(b=>b.setAttribute('aria-pressed','false'));draw();}
  });
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();render=null;failed('La vista 3D se interrumpió. La imagen conserva la vista exterior del diseño.');});
  start();
})();
