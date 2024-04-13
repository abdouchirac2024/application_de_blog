import jwt from 'jsonwebtoken'; // Importation du module JSON Web Token (JWT) pour gérer les tokens d'authentification.
import { errorHandler } from './error.js'; // Importation de la fonction errorHandler depuis le fichier error.js pour gérer les erreurs.

// Définition d'une fonction middleware nommée verifyToken qui vérifie l'authenticité d'un token d'accès.
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // Récupération du token d'accès à partir des cookies de la requête.
  
  // Vérification si le token existe.
  if (!token) {
    return next(errorHandler(401, 'Unauthorized')); // Si le token n'existe pas, renvoyer une erreur 401 Unauthorized avec la fonction errorHandler.
  }

  // Vérification de la validité du token en utilisant la méthode verify du module jwt.
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized')); // Si une erreur se produit lors de la vérification du token, renvoyer une erreur 401 Unauthorized avec la fonction errorHandler.
    }
    req.user = user; // Si le token est valide, ajouter les informations de l'utilisateur extraites du token à l'objet req pour une utilisation ultérieure.
    next(); // Passer au middleware suivant.
  });
};
