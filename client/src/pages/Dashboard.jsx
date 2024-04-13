import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Importation du hook useLocation pour obtenir les informations de l'URL
import DashSidebar from '../components/DashSidebar'; // Importation du composant DashSidebar
import DashProfile from '../components/DashProfile'; // Importation du composant DashProfile

export default function Dashboard() { // Définition du composant Dashboard
  const location = useLocation(); // Récupération de l'objet location contenant les informations de l'URL
  const [tab, setTab] = useState(''); // Déclaration d'un état tab pour stocker l'onglet actif, initialisé à une chaîne vide
  useEffect(() => { // Utilisation du hook useEffect pour exécuter une action après le rendu du composant
    const urlParams = new URLSearchParams(location.search); // Extraction des paramètres de l'URL
    const tabFromUrl = urlParams.get('tab'); // Récupération de la valeur du paramètre 'tab' de l'URL
    if (tabFromUrl) { // Si la valeur du paramètre 'tab' existe
      setTab(tabFromUrl); // Mettre à jour l'état tab avec la valeur du paramètre 'tab' de l'URL
    }
  }, [location.search]); // useEffect sera réexécuté uniquement si location.search change

  return (
    <div className="min-h-screen flex flex-col md:flex-row"> {/* Div principale avec classe flex pour le positionnement */}
      <div className='md:w-56'> {/* Div pour la sidebar */}
        {/* Sidebar */}
        <DashSidebar /> {/* Rendu du composant DashSidebar */}
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />} {/* Rendu conditionnel du composant DashProfile si l'onglet actif est "profile" */}
    </div>
  );
}
