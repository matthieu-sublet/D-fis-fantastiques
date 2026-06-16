/* ══════════════════════════════════════════
   main.js — Point d'entrée de l'application
   Initialise l'app au chargement de la page
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const result = initState();

  if (result === 'loaded' || result === 'migrated') {
    document.getElementById('wizard').style.display = 'none';
    render();
    if (result === 'migrated') toast('🔄 Ancienne sauvegarde récupérée !');
    checkLegacySlots();
  } else {
    // Nouvelle partie — afficher le wizard
    wizGo(0);
    initWizardUI();
  }
});
