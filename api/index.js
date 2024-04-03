// Importation du framework Express pour la gestion des routes et des requêtes HTTP
import express from 'express';
// Importation de la bibliothèque Mongoose pour la connexion à la base de données MongoDB
import mongoose from 'mongoose';
// Importation de la bibliothèque dotenv pour charger les variables d'environnement à partir du fichier .env
import dotenv from 'dotenv';
// Importation des routes utilisateur depuis le fichier user.route.js
import userRoutes from './routes/user.route.js';
// Importation des routes d'authentification depuis le fichier auth.route.js
import authRoutes from './routes/auth.route.js';

// Chargement des variables d'environnement à partir du fichier .env
dotenv.config();
// Connexion à la base de données MongoDB en utilisant l'URL spécifiée dans la variable d'environnement MONGO
mongoose.connect(process.env.MONGO).then(() => {
  console.log('MongoDb is connected');
})
.catch((err) => {
  console.log(err);
});

// Création d'une instance de l'application Express
const app = express();

// Middleware pour traiter les corps des requêtes au format JSON
app.use(express.json());

// Démarrage du serveur HTTP sur le port 3000 et affichage d'un message dans la console
app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

// Utilisation des routes utilisateur sous le préfixe '/api/user'
app.use('/api/user', userRoutes);
// Utilisation des routes d'authentification sous le préfixe '/api/auth'
app.use('/api/auth', authRoutes);

// Middleware de gestion des erreurs : intercepte les erreurs survenues dans les routes précédentes
app.use((err, req, res, next) => {
  // Extraction du code d'état de l'erreur ou définition par défaut à 500
  const statusCode = err.statusCode || 500;
  // Extraction du message d'erreur ou définition par défaut à 'Internal Server Error'
  const message = err.message || 'Internal Server Error';
  // Envoi d'une réponse JSON avec le code d'état et le message d'erreur
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
