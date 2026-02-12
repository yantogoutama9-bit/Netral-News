const feeds=[
 {name:'Kompas',url:'https://rss.kompas.com/news'},
 {name:'CNN Indonesia',url:'https://www.cnnindonesia.com/rss'},
 {name:'KBR',url:'https://kbr.id/rss'}
];

const container=document.getElementById('news');
container.innerHTML='';

feeds.forEach(f=>{
 fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(f.url)}`)
 .then(res=>res.text())
 .then(str=>{
   const xml=new DOMParser().parseFromString(str,'text/xml');
   const items=[...xml.querySelectorAll('item')].slice(0,5);
   items.forEach(i=>{
     const div=document.createElement('div');
     div.className='card';
     div.innerHTML=`
       <b>${i.querySelector('title')?.textContent || ''}</b><br>
       <small>${f.name}</small>
       <p>${i.querySelector('description')?.textContent || ''}</p>
       <a href="${i.querySelector('link')?.textContent || '#'}" target="_blank">Baca sumber</a>
     `;
     container.appendChild(div);
   });
 })
 .catch(err=>{
   console.error(f.name, err);
 });
});