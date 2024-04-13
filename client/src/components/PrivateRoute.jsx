// Import des dépendances nécessaires depuis les bibliothèques React Redux et React Router
import { useSelector } from 'react-redux'; // Import de la fonction useSelector permettant d'accéder à l'état du magasin Redux
import { Outlet, Navigate } from 'react-router-dom'; // Import des composants Outlet et Navigate de React Router

// Définition du composant PrivateRoutei
export default function PrivateRoute() {
  // Utilisation de useSelector pour extraire la propriété currentUser de l'état global Redux
  const { currentUser } = useSelector((state) => state.user);

  // Rendu conditionnel basé sur la présence d'un utilisateur connecté
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />; // Si currentUser est vrai, affiche Outlet (les composants enfants des routes), sinon redirige vers la page de connexion
}
