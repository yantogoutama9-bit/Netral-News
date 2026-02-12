const feeds=[
 {name:'Kompas',url:'https://rss.kompas.com/'},
 {name:'CNN Indonesia',url:'https://www.cnnindonesia.com/rss'},
 {name:'KBR',url:'https://kbr.id/rss'}
];

const container=document.getElementById('news');

feeds.forEach(f=>{
 fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(f.url)}`)
 .then(r=>r.json())
 .then(d=>{
  const xml=new DOMParser().parseFromString(d.contents,'text/xml');
  [...xml.querySelectorAll('item')].slice(0,6).forEach(i=>{
    const div=document.createElement('div');
    div.className='card';
    div.innerHTML=`<b>${i.querySelector('title').textContent}</b>
    <br><small>${f.name}</small>
    <p>${i.querySelector('description')?.textContent || ''}</p>
    <a href="${i.querySelector('link').textContent}" target="_blank">Baca sumber</a>`;
    container.appendChild(div);
  });
 });
});