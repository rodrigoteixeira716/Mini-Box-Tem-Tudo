const APP_VERSION='13.5.4';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?event.data.json():{};}catch(e){try{data={body:event.data?.text()||''};}catch(_){} }
  const title=data.title||'Mini Box Tem Tudo';
  const options={
    body:data.body||'Lembrete do Mini Box.',
    icon:'./icon-192.png',
    badge:'./icon-192.png',
    tag:data.tag||'mini-box-caixa',
    renotify:true,
    silent:false,
    vibrate:[250,120,250,120,350],
    data:{url:data.url||'./'}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const alvo=new URL(event.notification.data?.url||'./',self.registration.scope).href;
  event.waitUntil((async()=>{
    const lista=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of lista){
      if('navigate' in c){try{await c.navigate(alvo);}catch(e){}}
      if('focus' in c)return c.focus();
    }
    return self.clients.openWindow?self.clients.openWindow(alvo):undefined;
  })());
});
