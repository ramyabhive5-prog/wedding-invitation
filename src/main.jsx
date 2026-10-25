import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Heart, Music2, Volume2, VolumeX, Sparkles, CalendarDays, Clock3,
  MapPin, ArrowLeft, ArrowRight, Download, MessageCircle, ExternalLink,
  Flower2, PartyPopper, RotateCcw, Copy, Check, Mail, Stars
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './styles.css';
import { supabase } from './supabase';

/* Update the WhatsApp number and add public/wedding-song.mp3 before publishing. */
const WEDDING = {
  groom: 'D. Sowndhararajan',
  groomQualification: 'B.E.',
  bride: 'R. Vanitha',
  brideQualification: 'B.Sc.',
  groomParents: 'Mr. P. Devaraj & Mrs. D. Venkateswari @ Eswari',
  brideParents: 'Mr. V. Ravichandran & Mrs. R. Dhanalakshmi',
  receptionDate: '2026-11-21T18:00:00+05:30',
  receptionDateLabel: 'Saturday, 21 November 2026',
  receptionTime: '6:00 PM – 9:00 PM',
  muhurthamDate: '2026-11-22T06:00:00+05:30',
  muhurthamDateLabel: 'Sunday, 22 November 2026',
  muhurthamTime: '6:00 AM – 7:30 AM',
  venue: 'Subramaniyar Thirumana Mandapam',
  address: 'Chennimalai Palayam Pirivu, Chennimalai – Kangayam Road',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Subramaniyar+Thirumana+Mandapam+Chennimalai+Palayam+Pirivu',
  whatsapp: '91XXXXXXXXXX',
  blessing: 'With the blessings of our families, we joyfully invite you to celebrate our wedding and bless us as we begin our journey together.',
  tamilBlessing: 'தங்களின் அன்பான வருகையையும், வாழ்த்துகளையும் அன்புடன் எதிர்பார்க்கிறோம்.'
};

const slides = [
  { label: 'Welcome', eyebrow: 'A LOVE WRITTEN IN THE STARS', title: 'Wedding Invitation' },
  { label: 'Our Story', eyebrow: 'TWO HEARTS · ONE PROMISE', title: 'Together Forever' },
  { label: 'Reception', eyebrow: 'CELEBRATE WITH US', title: 'Wedding Reception' },
  { label: 'Muhurtham', eyebrow: 'A SACRED NEW BEGINNING', title: 'Muhurtham' },
  { label: 'Venue', eyebrow: 'WE SAVED YOU A PLACE', title: 'The Venue' },
  { label: 'Wishes', eyebrow: 'YOUR BLESSINGS MEAN EVERYTHING', title: 'Send Your Wishes' }
];

function Ornament({ children = '✦' }) {
  return <div className="ornament" aria-hidden="true"><span />{children}<span /></div>;
}

function FloatingDecor() {
  const bits = useMemo(() => Array.from({ length: 27 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 7) % 97}%`,
    delay: `${(i % 9) * -1.7}s`,
    duration: `${9 + (i % 7) * 1.5}s`,
    size: `${11 + (i % 4) * 5}px`,
    type: i % 3
  })), []);
  return <div className="floating-decor" aria-hidden="true">
    {bits.map(bit => <span key={bit.id} className={`float-bit float-${bit.type}`} style={{ left: bit.left, animationDelay: bit.delay, animationDuration: bit.duration, fontSize: bit.size }}>{bit.type === 0 ? '♥' : bit.type === 1 ? '✿' : '♡'}</span>)}
  </div>;
}

function Countdown({ target }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return <div className="countdown-ended">The special day is here. Let love bloom! <Heart size={16} fill="currentColor" /></div>;
  const values = [
    ['Days', Math.floor(diff / 86400000)],
    ['Hours', Math.floor((diff % 86400000) / 3600000)],
    ['Mins', Math.floor((diff % 3600000) / 60000)],
    ['Secs', Math.floor((diff % 60000) / 1000)]
  ];
  return <div className="countdown">{values.map(([label, value]) => <div className="count-box" key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>;
}

function App() {
  const saveWish = async (wish) => {
  const { error } = await supabase
    .from('wedding_wishes')
    .insert([
      {
        name: wish.name,
        relationship: wish.relationship,
        message: wish.message,
      },
    ]);

  if (error) {
    console.error('Error saving wish:', error.message);
    alert('Wish save ஆகவில்லை!');
    return false;
  }

  return true;
};
  const [opened, setOpened] = useState(false);
  const [slide, setSlide] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [wish, setWish] = useState('Wishing you a life filled with prosperity and happiness! May D. Sowndhararajan & R. Vanitha be blessed with a beautiful life filled with endless love, joy, and togetherness. 💗');
  const [copied, setCopied] = useState(false);
  const [musicMessage, setMusicMessage] = useState('');
  const [printedCardOpen, setPrintedCardOpen] = useState(false);
  const [wishModalOpen, setWishModalOpen] = useState(false);
  const [wishName, setWishName] = useState('');
  const [wishRelation, setWishRelation] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [wishes, setWishes] = useState([]);
const [wishesLoading, setWishesLoading] = useState(true);

useEffect(() => {
  const fetchWishes = async () => {
    const { data, error } = await supabase
      .from("wedding_wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching wishes:", error.message);
    } else {
      setWishes(data || []);
    }

    setWishesLoading(false);
  };

  fetchWishes();
}, []);

useEffect(() => {
  localStorage.setItem(
    "wedding-wishes",
    JSON.stringify(wishes)
  );
}, [wishes]);



  const next = () => setSlide(current => Math.min(current + 1, slides.length - 1));
  const previous = () => setSlide(current => Math.max(current - 1, 0));

  

useEffect(() => {
  const audio = document.getElementById('wedding-audio');

  if (!audio) return;

  audio.volume = 0.5;

  audio.play()
    .then(() => {
      setMusicOn(true);
      setMusicMessage('Music playing');
    })
    .catch(() => {
      setMusicOn(false);
      setMusicMessage('Click Music to start');
    });
}, []);

  


const toggleMusic = async () => {
  const audio = document.getElementById('wedding-audio');

  if (!audio) return;

  if (!audio.paused) {
    audio.pause();
    setMusicOn(false);
    setMusicMessage('Music paused');
  } else {
    try {
      await audio.play();
      setMusicOn(true);
      setMusicMessage('Music playing');
    } catch (error) {
      console.log('Browser blocked autoplay:', error);
      setMusicOn(false);
      setMusicMessage('Click Music to start');
    }
  }
};



  const downloadPDF = async () => {
    const node = document.getElementById('pdf-invitation');
    if (!node) return;
    const button = document.getElementById('download-btn');
    if (button) { button.disabled = true; button.dataset.oldText = button.innerText; button.innerText = 'Preparing PDF…'; }
    try {
      const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#fff8fc', logging: false });
      const image = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const pageW = 210, pageH = 297;
      const ratio = Math.min(pageW / (canvas.width / 2), pageH / (canvas.height / 2));
      const w = (canvas.width / 2) * ratio;
      const h = (canvas.height / 2) * ratio;
      pdf.addImage(image, 'PNG', (pageW - w) / 2, (pageH - h) / 2, w, h, undefined, 'FAST');
      pdf.save('D-Sowndhararajan-R-Vanitha-Wedding-Invitation.pdf');
    } catch (error) {
      console.error(error);
      alert('PDF download failed. Please try again.');
    } finally {
      if (button) { button.disabled = false; button.innerText = button.dataset.oldText || 'Download Invitation'; }
    }
  };

  const submitWish = async (event) => {
    event.preventDefault();
    const name = wishName.trim();
    const message = wishMessage.trim();
    if (!name || !message) return;

    const { data, error } = await supabase
  .from("wedding_wishes")
  .insert([
    {
      name: name,
      relationship: wishRelation.trim() || "Family & Friends",
      message: message,
    },
  ])
  .select()
  .single();

if (error) {
  console.error("Error saving wish:", error.message);
  alert("Message save ஆகவில்லை. மீண்டும் முயற்சி செய்யுங்கள்.");
  return;
}

setWishes((current) => [data, ...current]);

setWish("");
setWishName("");
setWishRelation("");
setWishMessage("");
setWishModalOpen(false);
    
  };

  const sendWish = (message = wish) => {
    const number = '919345862145';
    const text = message.trim() || 'Wishing D. Sowndhararajan & R. Vanitha a life filled with prosperity, love, and happiness. May their journey together be blessed with endless joy and togetherness! ❤️.';
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const copyAddress = async () => {
    try { await navigator.clipboard.writeText(`${WEDDING.venue}, ${WEDDING.address}`); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { alert(`${WEDDING.venue}, ${WEDDING.address}`); }
  };

  return <main className="app-shell">
    <FloatingDecor />
    <div className="ambient-orbit orbit-left" aria-hidden="true" />
    <div className="ambient-orbit orbit-right" aria-hidden="true" />
    <audio
  id="wedding-audio"
  src="/wedding-song.mp3"
  loop
  preload="auto"
/>

    {!opened ? <section className="cover-stage">
      <div className="cover-card">
        <div className="cover-topline"><span>✦</span><span>♡</span><span>✦</span><span>♡</span><span>✦</span></div>
        <div className="cover-glow" />
        <div className="cover-emblem"><Heart size={30} fill="currentColor" /><span>D <i>&</i> V</span></div>
        <p className="eyebrow">WITH THE BLESSINGS OF OUR FAMILIES</p>
        <h1 className="cover-title">Wedding<br /><em>Invitation</em></h1>
        <div className="cover-names"><span>{WEDDING.groom}</span><b>&</b><span>{WEDDING.bride}</span></div>
        <Ornament>♡</Ornament>
        <p className="cover-subtitle">Two hearts, one beautiful forever.</p>
        {/* <div className="envelope-scene" role="img" aria-label="Decorative 3D invitation envelope">
          <div className="envelope-shadow" />
          <div className="envelope-back" />
          <div className="envelope-letter"><Heart size={24} fill="currentColor" /><span>YOU ARE<br />INVITED</span></div>
          <div className="envelope-left" /><div className="envelope-right" /><div className="envelope-flap" />
          <div className="wax-seal"><Heart size={21} fill="currentColor" /><span>D♥V</span></div>
        </div> */}
        <button className="open-button" onClick={() => { setOpened(true); setSlide(0); }}><Sparkles size={17} /> Open Invitation <ArrowRight size={17} /></button>
        <p className="cover-hint">TAP THE SEAL TO OPEN YOUR INVITATION</p>
      </div>
      <button className={`floating-music ${musicOn ? 'is-playing' : ''}`} onClick={toggleMusic} aria-label="Toggle wedding music">{musicOn ? <Volume2 /> : <Music2 />}<span>{musicOn ? 'Music On' : 'Music'}</span></button>
    </section> : <section className="opened-stage">
      <div className="invitation-card">
        <div className="card-ornate-top"><div className="top-garland">✦　♡　✦　♡　✦　♡　✦　♡　✦</div><div className="top-scallop" /></div>
        <div className="card-controls">
          <button className={`icon-button music-toggle ${musicOn ? 'is-playing' : ''}`} onClick={toggleMusic} title={musicOn ? 'Pause music' : 'Play music'}>{musicOn ? <Volume2 size={19} /> : <Music2 size={19} />}</button>
          <button className="icon-button" onClick={() => { setOpened(false); setSlide(0); }} title="Close invitation"><RotateCcw size={18} /></button>
        </div>
        <div className="card-inner" key={slide}>
          <div className="slide-count">Wedding Invitation ♡♡ <span>{String(slide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span></div>
          {slide === 0 && <section className="view welcome-view">
            <div className="mini-emblem"><Heart size={27} fill="currentColor" /><span>D <i>&</i> V</span></div>
            <p className="eyebrow">{slides[0].eyebrow}</p>
            <h2 className="script-heading">Wedding<br /><em>Invitation</em></h2>
            <div className="name-stack"><span>{WEDDING.groom}</span><b>&</b><span>{WEDDING.bride}</span></div>
            <Ornament>♡</Ornament>
            <p className="intro-copy">{WEDDING.blessing}</p>
            <div className="highlight-date"><CalendarDays size={19} /><span>{WEDDING.muhurthamDateLabel}</span></div>
            <div className="tamil-blessing" lang="ta">{WEDDING.tamilBlessing}</div>
            <button className="printed-card-trigger" onClick={() => setPrintedCardOpen(true)}>
              <Mail size={17} /> Printed Wedding Card <ArrowRight size={16} />
            </button>
            <button className="primary-action" onClick={next}>Discover the celebration <ArrowRight size={17} /></button>
          </section>}

          {slide === 1 && <section className="view story-view">
            <div className="heart-crown"><Heart size={35} fill="currentColor" /><Sparkles size={17} /></div>
            <p className="eyebrow">{slides[1].eyebrow}</p><h2>{slides[1].title}</h2><Ornament>❦</Ornament>
            <div className="story-names"><div><span className="role-label">THE GROOM</span><h3>{WEDDING.groom}</h3><small>{WEDDING.groomQualification}</small></div><div className="heart-divider"><Heart fill="currentColor" size={25} /></div><div><span className="role-label">THE BRIDE</span><h3>{WEDDING.bride}</h3><small>{WEDDING.brideQualification}</small></div></div>
            <div className="family-box"><p><Flower2 size={15} /> With the blessings of</p><strong>{WEDDING.groomParents}</strong><span className="family-and">and</span><strong>{WEDDING.brideParents}</strong></div>
            <blockquote>“May our days be filled with love, laughter and a thousand little reasons to smile.”</blockquote>
            <p className="tamil-blessing" lang="ta">இரு இல்லங்களின் அன்பும் ஆசியும் இணையும் இனிய நாள்.</p>
          </section>}

          {slide === 2 && <section className="view event-view">
            <div className="round-icon"><PartyPopper size={25} /></div><p className="eyebrow">{slides[2].eyebrow}</p><h2>{slides[2].title}</h2><Ornament>✦</Ornament>
            <div className="event-panel"><div className="event-icon"><CalendarDays size={22} /></div><span className="role-label">DATE</span><h3>{WEDDING.receptionDateLabel}</h3><div className="event-time"><Clock3 size={16} /> {WEDDING.receptionTime}</div><p className="event-note">An evening of smiles, blessings and celebration.</p></div>
            <div className="tamil-event" lang="ta"><strong>திருமண வரவேற்பு விழா</strong><span>சனிக்கிழமை, 21 நவம்பர் 2026</span><span>மாலை 6.00 மணி முதல் இரவு 9.00 மணி வரை</span></div>
          </section>}

          {slide === 3 && <section className="view event-view muhurtham-view">
            <div className="round-icon"><Stars size={25} /></div><p className="eyebrow">{slides[3].eyebrow}</p><h2>{slides[3].title}</h2><Ornament>❦</Ornament>
            <div className="muhurtham-badge"><span>THE AUSPICIOUS MOMENT</span><strong>Subha Muhurtham</strong><Heart size={18} fill="currentColor" /></div>
            <div className="event-panel"><div className="event-icon"><CalendarDays size={22} /></div><span className="role-label">DATE</span><h3>{WEDDING.muhurthamDateLabel}</h3><div className="event-time"><Clock3 size={16} /> {WEDDING.muhurthamTime}</div></div>
            <div className="tamil-event" lang="ta"><strong>திருமண மங்கள நிகழ்வு</strong><span>ஞாயிற்றுக்கிழமை, 22 நவம்பர் 2026</span><span>காலை 6.00 மணி முதல் 7.30 மணி வரை</span></div>
            <div className="countdown-area"><p className="role-label">COUNTING DOWN TO OUR FOREVER</p><Countdown target={WEDDING.muhurthamDate} /></div>
          </section>}

          {slide === 4 && <section className="view venue-view">
            <div className="round-icon"><MapPin size={25} /></div><p className="eyebrow">{slides[4].eyebrow}</p><h2>{slides[4].title}</h2><Ornament>✦</Ornament>
            <div className="venue-illustration"><div className="venue-arch"><Heart size={22} fill="currentColor" /><span>WITH LOVE</span></div><div className="venue-lamps"><span>🪔</span><span>✿</span><span>🪔</span></div></div>
            <div className="venue-details"><span className="role-label">WEDDING VENUE</span><h3>{WEDDING.venue}</h3><p>{WEDDING.address}</p><div className="venue-actions"><a href={WEDDING.mapUrl} target="_blank" rel="noreferrer" className="soft-button">Open in Maps <ExternalLink size={15} /></a><button className="soft-button" onClick={copyAddress}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy Address'}</button></div></div>
            <div className="tamil-blessing" lang="ta">தங்கள் வருகையால் எங்கள் மகிழ்ச்சியைப் பகிர்ந்து கொள்ள அன்புடன் அழைக்கிறோம்.</div>
          </section>}

          {slide === 5 && <section className="view wishes-view">
            <div className="wish-heart"><Heart size={32} fill="currentColor" /></div><p className="eyebrow">{slides[5].eyebrow}</p><h2>{slides[5].title}</h2><Ornament>♡</Ornament>
            <p className="intro-copy">Your presence is a gift; your blessings are a treasure. Leave a heartfelt message for the couple.</p>
            <button className="whatsapp-action share-wishes-trigger" onClick={() => setWishModalOpen(true)}><MessageCircle size={18} /> Share Your Wishes 💌</button>
            <div className="blessings-heading"><span>✦</span><p>BLESSINGS FROM LOVED ONES</p><span>✦</span></div>
            {wishes.length > 0 ? <div className="blessings-list" aria-live="polite">
              {wishes.map(item => <article className="blessing-card" key={item.id}>
                <div className="blessing-card-head"><div className="blessing-avatar"><Heart size={18} fill="currentColor" /></div><div className="blessing-person"><strong>{item.name}</strong><span>{item.relation}</span></div><Heart className="blessing-heart" size={17} fill="currentColor" /></div>
                <p className="blessing-message">{item.message}</p><div className="blessing-card-foot"><span>With love & blessings ✨</span><button type="button" onClick={() => sendWish(item.message)} aria-label={`Share ${item.name}'s wish on WhatsApp`}><MessageCircle size={14} /> Share</button></div>
              </article>)}
            </div> : <div className="blessings-empty"><Heart size={21} /><p>Be the first to leave a loving blessing for the couple.</p></div>}
            <div className="closing-names">{WEDDING.groom} <span>&</span> {WEDDING.bride}</div>
          </section>}
        </div>
        <div className="card-navigation">
          <button className="nav-button" onClick={previous} disabled={slide === 0}><ArrowLeft size={15} /> Previous</button>
          <div className="slide-dots">{slides.map((item, index) => <button key={item.label} className={index === slide ? 'active' : ''} onClick={() => setSlide(index)} aria-label={`Open ${item.label}`} title={item.label} />)}</div>
          {slide < slides.length - 1 ? <button className="nav-button next" onClick={next}>Next <ArrowRight size={15} /></button> : <button className="nav-button next" onClick={() => setSlide(0)}>Start again <Heart size={15} /></button>}
        </div>
      </div>
      <div className="side-actions"></div>
      {musicMessage && <div className="music-status" role="status">{musicMessage}</div>}
    </section>}

    {wishModalOpen && <div className="wish-modal-backdrop" role="presentation" onClick={() => setWishModalOpen(false)}>
      <section className="wish-modal" role="dialog" aria-modal="true" aria-labelledby="wish-modal-title" onClick={event => event.stopPropagation()}>
        <button type="button" className="wish-modal-close" onClick={() => setWishModalOpen(false)} aria-label="Close wishes form">×</button>
        <div className="wish-modal-icon"><Heart size={23} fill="currentColor" /></div>
        <p className="eyebrow">A LITTLE NOTE FULL OF LOVE</p>
        <h2 id="wish-modal-title">Share Your Blessings</h2>
        <p className="wish-modal-intro">Leave your warm wishes and prayers for D. Sowndhararajan & R. Vanitha.</p>
        <form onSubmit={submitWish} className="wish-form">
          <label htmlFor="wish-sender-name">Your Name <span>*</span></label>
          <input id="wish-sender-name" value={wishName} onChange={event => setWishName(event.target.value)} placeholder="e.g. Name & Family" maxLength={70} required />
          <label htmlFor="wish-sender-relation">Relationship <span className="optional-label">(Optional)</span></label>
          <input id="wish-sender-relation" value={wishRelation} onChange={event => setWishRelation(event.target.value)} placeholder="e.g. Friend / Relative / Colleague" maxLength={60} />
          <label htmlFor="wish-sender-message">Your Blessings / Message <span>*</span></label>
          <textarea id="wish-sender-message" value={wishMessage} onChange={event => setWishMessage(event.target.value)} placeholder="Write your heartfelt blessing..." rows={4} maxLength={500} required />
          <button type="submit" className="wish-submit-button"><Heart size={17} fill="currentColor" /> Send Wishes & Blessings</button>
          <button type="button" className="wish-whatsapp-button" onClick={() => sendWish(wishMessage)}><MessageCircle size={17} /> Continue on WhatsApp</button>
        </form>
        <p className="wish-modal-note">Your wish will appear below on this page. WhatsApp sharing is optional.</p>
      </section>
    </div>}

    {printedCardOpen && <div className="printed-modal-backdrop" role="presentation" onClick={() => setPrintedCardOpen(false)}>
      <section className="printed-modal" role="dialog" aria-modal="true" aria-labelledby="printed-card-title" onClick={event => event.stopPropagation()}>
        <div className="printed-modal-heading">
          <div>
            <p className="eyebrow">THE ORIGINAL PRINTED DESIGN</p>
            <h2 id="printed-card-title">Printed Wedding Card</h2>
          </div>
          <button className="printed-close" onClick={() => setPrintedCardOpen(false)} aria-label="Close printed invitation">×</button>
        </div>
        
        <div className="printed-card-preview">
          <img src="/printed-wedding-card.jpg" alt="D. Sowndhararajan and R. Vanitha printed wedding invitation, English and Tamil sides" />
        </div>
        <a className="printed-download" href="/printed-wedding-card.pdf" download="D-Sowndhararajan-R-Vanitha-Printed-Wedding-Card.pdf">
          <Download size={18} /> Download Printed Invitation PDF
        </a>
        <p className="printed-download-note">PDF நேரடியாக download ஆகும். Print window திறக்காது.</p>
      </section>
    </div>}

    {/* Full invitation sheet used for direct PDF export; no print dialog. */}
    <div className="pdf-stage" aria-hidden="true"><article id="pdf-invitation" className="pdf-sheet">
      <div className="pdf-border"><div className="pdf-emblem"><Heart fill="currentColor" size={25} /><span>D & V</span></div><p className="pdf-kicker">WITH THE BLESSINGS OF OUR FAMILIES</p><h1>Wedding Invitation</h1><div className="pdf-names">{WEDDING.groom}<span>&</span>{WEDDING.bride}</div><p className="pdf-blessing">{WEDDING.blessing}</p><div className="pdf-rule">❦</div>
        <div className="pdf-family-grid"><div><small>GROOM'S FAMILY</small><p>{WEDDING.groomParents}</p></div><div><small>BRIDE'S FAMILY</small><p>{WEDDING.brideParents}</p></div></div>
        <h2>Wedding Reception</h2><p className="pdf-date">{WEDDING.receptionDateLabel}</p><p>{WEDDING.receptionTime}</p><div className="pdf-rule">✦</div><h2>Muhurtham</h2><p className="pdf-date">{WEDDING.muhurthamDateLabel}</p><p>{WEDDING.muhurthamTime}</p><div className="pdf-venue"><MapPin size={18} /><h3>{WEDDING.venue}</h3><p>{WEDDING.address}</p></div><p className="pdf-tamil" lang="ta">திருமண வரவேற்பு விழா மற்றும் திருமண மங்கள நிகழ்விற்கு தங்களை அன்புடன் அழைக்கிறோம்.</p><p className="pdf-tamil" lang="ta">தங்களின் அன்பான வருகையையும், வாழ்த்துகளையும் எதிர்பார்க்கிறோம்.</p><div className="pdf-bottom">WITH LOVE, {WEDDING.groom} & {WEDDING.bride} ♡</div></div>
    </article></div>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
