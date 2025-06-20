import React, { useEffect, useRef, useState } from 'react';

// Accordéon React
function Accordion({ id, title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="accordion-group" id={id}>
      <div className="accordion-header" onClick={() => setOpen(o => !o)}>
        <h2 className="accordion-title flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <svg className="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className={`accordion-content${open ? ' active' : ''}`} style={{ maxHeight: open ? 1000 : 0 }}>
        <div className="accordion-body">{children}</div>
      </div>
    </div>
  );
}

// Bulles animées React
function Bubbles() {
  const ref = useRef();
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = '';
    const bubbleCount = 15;
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = Math.random() * 60 + 20;
      const startX = Math.random() * window.innerWidth;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 10;
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = startX + 'px';
      bubble.style.animationDuration = duration + 's';
      bubble.style.animationDelay = delay + 's';
      container.appendChild(bubble);
    }
  }, []);
  return <div className="bubbles-container" ref={ref} aria-hidden />;
}

export default function Home() {
  // Toast state
  const [toast, setToast] = useState(null);
  // Form state
  const [form, setForm] = useState({ nom: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  // Toast helpers
  function showToast(title, message, type = 'info') {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 5000);
  }

  // Form submit
  async function handleSubmit(e) {
    e.preventDefault();
    const { nom, email, message } = form;
    if (!nom || !email || !message) {
      showToast('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Erreur', 'Veuillez entrer une adresse email valide.', 'error');
      return;
    }
    setSending(true);
    // Ici, tu peux brancher EmailJS ou autre API
    setTimeout(() => {
      setSending(false);
      setForm({ nom: '', email: '', message: '' });
      showToast('Merci', 'Votre message a bien été envoyé !', 'success');
    }, 1200);
  }

  return (
    <div className="relative min-h-screen bg-black text-white fadein-appear">
      <Bubbles />
      {/* Spline background */}
      <div className="spline-container pointer-events-none">
        <iframe src="https://my.spline.design/glassmorphlandingpage-nyOS3MRrg0GCft1x8mCtqPwk/" width="100%" height="100%" frameBorder="0" title="Spline 3D" />
      </div>
      <div className="main-content relative z-10">
        {/* Navigation */}
        <nav className="px-6 py-8 pointer-events-auto" aria-label="Navigation principale">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img src="/images/LR.png" alt="Logo LR" className="h-32 w-auto animate-logo-fade" style={{ display: 'block', background: 'none' }} />
            </div>
            <div className="hidden md:flex space-x-6 text-white/80 text-sm">
              <a href="#accueil" className="hover:text-white transition-colors focus:text-white">Accueil</a>
              <a href="#prestations" className="hover:text-white transition-colors focus:text-white">Prestations</a>
              <a href="#location" className="hover:text-white transition-colors focus:text-white">Location</a>
              <a href="formations.html" className="hover:text-white transition-colors focus:text-white">Formation</a>
              <a href="#contact" className="hover:text-white transition-colors focus:text-white">Contact</a>
            </div>
            <a href="#contact" className="text-white text-sm border border-white/20 rounded-full px-5 py-2 hover:bg-white/10 transition-all pointer-events-auto focus:bg-white/10">
              Nous joindre
            </a>
          </div>
        </nav>
        {/* Hero section */}
        <section className="px-6 max-w-6xl mx-auto mt-20 md:mt-32 fade-in delay-1 text-center flex flex-col items-center justify-center bg-glass border-glass-yellow rounded-2xl shadow-lg" id="accueil" aria-label="Section d'introduction">
          <div className="md:max-w-2xl w-full flex flex-col items-center justify-center mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight text-center w-full mx-auto mb-8">Louna Rail TP</h1>
            <p className="text-glass-gray mt-6 text-lg text-center w-full mx-auto">
              Découvrez nos services rail-route, nos prestations sur-mesure et nos solutions de location adaptées à vos besoins terrain.
            </p>
            {/* Images pelles */}
            <div className="relative flex flex-col items-center justify-center mt-12 mb-8 w-full">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 w-full">
                <img src="/images/Pelle Mecala 216 M.png" alt="Pelle Mecalac 216M" className="w-40 md:w-56 drop-shadow-2xl transition-transform hover:scale-105" style={{ filter: 'drop-shadow(0 0 32px #fde047)' }} loading="lazy" />
                <img src="/images/Mecalac remorque.png" alt="Mecalac avec remorque" className="w-40 md:w-56 drop-shadow-2xl transition-transform hover:scale-105" style={{ filter: 'drop-shadow(0 0 32px #fde047)' }} loading="lazy" />
                <img src="/images/CAT 323.png" alt="Pelle CAT 323M" className="w-40 md:w-56 drop-shadow-2xl transition-transform hover:scale-105" style={{ filter: 'drop-shadow(0 0 32px #fde047)' }} loading="lazy" />
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-4 justify-center w-full">
              <a href="#contact" className="bg-yellow-400/80 text-black rounded-full px-7 py-3 text-sm font-medium hover:bg-yellow-300 transition-all pointer-events-auto focus:bg-yellow-300 shadow">Demander un devis</a>
              <a href="#prestations" className="bg-transparent border border-white/20 text-white rounded-full px-7 py-3 text-sm font-medium hover:bg-white/10 transition-all pointer-events-auto focus:bg-white/10">Voir nos prestations</a>
              <a href="formations.html" className="bg-transparent border border-white/20 text-white rounded-full px-7 py-3 text-sm font-medium hover:bg-white/10 transition-all pointer-events-auto focus:bg-white/10">Voir les formations</a>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-20 text-white fade-in delay-2 w-full justify-center">
              <div className="text-center">
                <p className="text-2xl font-light">+10 ans</p>
                <p className="text-white/50 text-sm mt-1">d'expérience terrain</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-light">+280</p>
                <p className="text-white/50 text-sm mt-1">chantiers ferroviaires</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-light">+5</p>
                <p className="text-white/50 text-sm mt-1">étoiles</p>
              </div>
            </div>
          </div>
        </section>
        {/* Accordéons */}
        <section className="px-6 max-w-4xl mx-auto mt-32 py-12 fade-in delay-2">
          <Accordion id="prestations" title="Nos Prestations" icon={
            <svg className="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          }>
            <p className="text-lg mb-6">Découvrez notre gamme complète de prestations spécialisées dans le domaine ferroviaire.</p>
            <ul className="space-y-4 text-lg">
              <li><span className="font-bold text-yellow-400">Interventions rail-route</span> : Opérations de maintenance, travaux de voie, assistance technique.</li>
              <li><span className="font-bold text-yellow-400">Sécurité ferroviaire</span> : Mise en place de protocoles, audits, accompagnement sécurité sur chantier.</li>
              <li><span className="font-bold text-yellow-400">Expertise & conseil</span> : Diagnostic, planification, pilotage de projets ferroviaires.</li>
              <li><span className="font-bold text-yellow-400">Formation terrain</span> : Initiation et perfectionnement à la conduite d'engins rail-route.</li>
            </ul>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4"><p className="text-sm text-white/60 mb-2">Photo à ajouter</p><div className="h-32 bg-white/10 rounded-lg flex items-center justify-center"><span className="text-white/40">Image prestation</span></div></div>
              <div className="bg-white/5 rounded-lg p-4"><p className="text-sm text-white/60 mb-2">Photo à ajouter</p><div className="h-32 bg-white/10 rounded-lg flex items-center justify-center"><span className="text-white/40">Image prestation</span></div></div>
            </div>
          </Accordion>
          <Accordion id="location" title="Location" icon={
            <svg className="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          }>
            <p className="text-lg mb-6">Solutions de location flexibles et adaptées à tous vos besoins ferroviaires.</p>
            <ul className="space-y-4 text-lg">
              <li><span className="font-bold text-yellow-400">Engins rail-route</span> : Location de pelles rail-route, accessoires et équipements spécialisés.</li>
              <li><span className="font-bold text-yellow-400">Matériel de chantier</span> : Location de petits matériels, outils et équipements ferroviaires.</li>
              <li><span className="font-bold text-yellow-400">Solutions flexibles</span> : Location courte ou longue durée, avec ou sans opérateur.</li>
              <li><span className="font-bold text-yellow-400">Assistance & support</span> : Livraison, mise en service, support technique sur site.</li>
            </ul>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4"><p className="text-sm text-white/60 mb-2">Photo à ajouter</p><div className="h-32 bg-white/10 rounded-lg flex items-center justify-center"><span className="text-white/40">Image location</span></div></div>
              <div className="bg-white/5 rounded-lg p-4"><p className="text-sm text-white/60 mb-2">Photo à ajouter</p><div className="h-32 bg-white/10 rounded-lg flex items-center justify-center"><span className="text-white/40">Image location</span></div></div>
            </div>
          </Accordion>
          <Accordion id="formation" title="Formation" icon={
            <svg className="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          }>
            <p className="text-lg mb-6">Parcours de formation spécialisés pour la montée en compétence sur les engins rail-route.</p>
            <p className="text-lg mb-6">Découvrez nos parcours de formation spécialisés pour la montée en compétence sur les engins rail-route, l'utilisation d'outillages spécifiques (Engcon, Tinbin TC2, etc.) et la sécurité ferroviaire. Nos formateurs experts vous accompagnent sur le terrain et en centre, pour des résultats concrets et certifiants.</p>
            <ul className="space-y-4 text-lg">
              <li><span className="font-bold text-yellow-400">Formation pratique sur machines réelles</span> : prise en main, sécurité, efficacité.</li>
              <li><span className="font-bold text-yellow-400">Modules Engcon & Tinbin</span> : expertise sur les équipements spécifiques.</li>
              <li><span className="font-bold text-yellow-400">Certifications & attestations</span> : valorisez vos compétences auprès des employeurs.</li>
              <li><span className="font-bold text-yellow-400">Accompagnement personnalisé</span> : progression adaptée à chaque profil.</li>
            </ul>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white/5 rounded-xl p-6 flex flex-col items-center shadow-lg">
                <img src="/images/Pack Engcon.png" alt="Pack Engcon" className="w-40 h-32 object-contain mb-4 rounded-lg shadow" loading="lazy" />
                <h3 className="text-xl font-bold mb-2 text-center text-yellow-400">Pack Engcon</h3>
                <p className="text-yellow-300 font-bold italic mb-2 text-center">"La sécurité, c'est l'affaire de tous !"</p>
                <ul className="text-white/90 text-base mb-2 text-left list-disc list-inside">
                  <li>Prise en main sur chantier réel</li>
                  <li>Formation par des pros du terrain</li>
                  <li>Attestation reconnue</li>
                </ul>
                <blockquote className="bg-black/30 border-l-4 border-yellow-400 p-4 italic mt-4 text-white/80">"Grâce à cette formation, j'ai pu évoluer rapidement sur les chantiers."<br /><span className="text-xs text-gray-400">— Extrait PowerPoint</span></blockquote>
              </div>
              <div className="bg-white/5 rounded-xl p-6 flex flex-col items-center shadow-lg">
                <img src="/images/Tinbin TC.png" alt="Tinbin TC2" className="w-40 h-32 object-contain mb-4 rounded-lg shadow" loading="lazy" />
                <h3 className="text-xl font-bold mb-2 text-center text-yellow-400">Tinbin TC2</h3>
                <p className="text-white/70 text-center text-base">Aspirateur hydraulique ballast Tinbin TC2 : formation, expertise approfondie et prestations sur mesure pour l'entretien et la gestion du ballast ferroviaire.</p>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <a href="formations.html" className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-full px-6 py-2 shadow transition-all text-sm" style={{ boxShadow: '0 2px 12px #facc15aa' }}>
                N'attendez pas, découvrez nos formations !
              </a>
            </div>
          </Accordion>
          <Accordion id="contact" title="Contact" icon={
            <svg className="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          }>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img src="/images/interrogation 1.png" alt="Décor interrogation" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '60%', maxWidth: 420, opacity: 0.18, filter: 'blur(2px)', zIndex: 0, pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p className="text-lg mb-6">Contactez-nous pour vos projets ferroviaires. Notre équipe d'experts est à votre disposition.</p>
                <form className="space-y-6 max-w-xl mx-auto" autoComplete="off" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="nom" className="block mb-2 text-white/80">Nom</label>
                    <input id="nom" name="nom" type="text" className="w-full rounded-lg px-4 py-3 bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" required value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-white/80">Email</label>
                    <input id="email" name="email" type="email" placeholder="lounarailtp@gmail.com" className="w-full rounded-lg px-4 py-3 bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label htmlFor="message" className="block mb-2 text-white/80">Message</label>
                    <textarea id="message" name="message" rows={4} className="w-full rounded-lg px-4 py-3 bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  <button type="submit" className="bg-yellow-400 text-black rounded-full px-8 py-3 text-sm font-medium hover:bg-yellow-300 transition-all focus:bg-yellow-300 w-full" disabled={sending}>
                    {sending ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                  <p className="text-xs text-gray-400 mt-2">En soumettant ce formulaire, vous acceptez que vos données soient utilisées pour vous recontacter. Aucune donnée n'est transmise à des tiers. <a href="politique-confidentialite.html" className="underline hover:text-yellow-400">En savoir plus</a>.</p>
                </form>
                <div className="flex justify-center mt-10">
                  <img src="/images/Grey Simple Business Email Signature.png" alt="Carte de visite LRTP" style={{ maxWidth: 340, width: '100%', borderRadius: 16, boxShadow: '0 4px 24px #0002' }} loading="lazy" />
                </div>
              </div>
            </div>
          </Accordion>
        </section>
        {/* Toast notification */}
        {toast && (
          <div className={`toast fixed top-6 right-6 z-[1000] bg-white/95 text-black px-6 py-4 rounded-xl shadow-lg border-l-4 ${toast.type === 'success' ? 'border-green-400' : toast.type === 'error' ? 'border-red-400' : 'border-yellow-400'}`}>
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="font-bold">{toast.title}</div>
                <div className="text-sm">{toast.message}</div>
              </div>
              <button onClick={() => setToast(null)} className="ml-4 text-gray-500 hover:text-black text-xl font-bold">&times;</button>
            </div>
          </div>
        )}
        {/* Footer */}
        <footer className="w-full px-6 pointer-events-auto text-center mt-12" aria-label="Pied de page">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-2">
            <p className="text-white/40 text-xs">© 2025 Louna Rail TP. Tous droits réservés.</p>
            <div className="flex space-x-4 justify-center">
              <a href="#" className="text-white/40 hover:text-white transition-colors pointer-events-auto" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors pointer-events-auto" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
              </a>
              <a href="politique-confidentialite.html" className="text-white/40 hover:text-white transition-colors pointer-events-auto">Politique de confidentialité</a>
              <a href="mentions-legales.html" className="text-white/40 hover:text-white transition-colors pointer-events-auto">Mentions légales</a>
            </div>
          </div>
        </footer>
      </div>
      {/* Styles additionnels pour animations et glassmorphisme */}
      <style>{`
        .bubbles-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: hidden; }
        .bubble { position: absolute; border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05)); box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 193, 7, 0.1); animation: float 15s infinite linear; }
        @keyframes float { 0% { transform: translateY(100vh) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-100px) rotate(360deg); opacity: 0; } }
        .fadein-appear { animation: fadeInBody 1.2s cubic-bezier(.4,0,.2,1); }
        @keyframes fadeInBody { from { opacity: 0; } to { opacity: 1; } }
        .bg-glass { background: rgba(0,0,0,0.3); backdrop-filter: blur(8px); }
        .border-glass-yellow { border: 1.5px solid rgba(250,204,21,0.3); }
        .text-glass-yellow { color: #fde047; }
        .text-glass-gray { color: #e5e7eb; }
        .animate-logo-fade { animation: logo-fade 1.2s cubic-bezier(.4,0,.2,1); }
        @keyframes logo-fade { 0% { opacity: 0; transform: scale(0.8); } 60% { opacity: 1; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
} 