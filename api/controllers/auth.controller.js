// Importation du modèle User depuis le chemin spécifié
import User from '../models/user.model.js';
// Importation de la bibliothèque bcryptjs pour le hachage des mots de passe
import bcryptjs from 'bcryptjs';
// Importation de la fonction errorHandler depuis le chemin spécifié
import { errorHandler } from '../utils/error.js';
// Importation de la bibliothèque jsonwebtoken pour la génération de jetons JWT
import jwt from 'jsonwebtoken';

// Définition d'une fonction nommée signup qui gère l'inscription de l'utilisateur
export const signup = async (req, res, next) => {
  // Extraction du nom d'utilisateur, de l'e-mail et du mot de passe du corps de la requête
  const { username, email, password } = req.body;

  // Vérification si l'un des champs requis est manquant ou vide
  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    // Si l'un des champs requis est manquant ou vide, invocation de la fonction errorHandler en passant un code d'état 400 et un message d'erreur
    next(errorHandler(400, 'Tous les champs sont requis'));
  }

  // Hachage du mot de passe à l'aide de la bibliothèque bcryptjs avec un sel de 10 tours
  const hashedPassword = bcryptjs.hashSync(password, 10);
  // Création d'une nouvelle instance du modèle User avec le nom d'utilisateur, l'e-mail et le mot de passe haché fournis
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    // Enregistrement du nouvel utilisateur dans la base de données
    await newUser.save();
    // Envoi d'une réponse JSON indiquant une inscription réussie
    res.json('Inscription réussie');
  } catch (error) {
    // Si une erreur se produit lors de l'enregistrement, passage de l'erreur à la prochaine fonction middleware
    next(error);
  }
};

// Définition d'une fonction nommée signin qui gère la connexion de l'utilisateur
export const signin = async (req, res, next) => {
  // Extraction de l'e-mail et du mot de passe du corps de la requête
  const { email, password } = req.body;

  // Vérification si l'e-mail ou le mot de passe est manquant ou vide
  if (!email || !password || email === '' || password === '') {
    // Si l'un des champs requis est manquant ou vide, invocation de la fonction errorHandler en passant un code d'état 400 et un message d'erreur
    next(errorHandler(400, 'Tous les champs sont requis'));
  }

  try {
    // Recherche d'un utilisateur avec l'e-mail fourni dans la base de données
    const validUser = await User.findOne({ email });
    // Si aucun utilisateur n'est trouvé avec l'e-mail fourni, invocation de la fonction errorHandler en passant un code d'état 404 et un message d'erreur
    if (!validUser) {
      return next(errorHandler(404, 'Utilisateur non trouvé'));
    }
    // Comparaison du mot de passe fourni avec le mot de passe haché stocké dans la base de données
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    // Si le mot de passe fourni est invalide, invocation de la fonction errorHandler en passant un code d'état 400 et un message d'erreur
    if (!validPassword) {
      return next(errorHandler(400, 'Mot de passe invalide'));
    }
    // Génération d'un jeton JSON avec l'identifiant de l'utilisateur et le statut isAdmin, signé avec la variable d'environnement JWT_SECRET
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    // Destructuration du champ mot de passe du document utilisateur
    const { password: pass, ...rest } = validUser._doc;

    // Envoi d'une réponse avec un code d'état 200, définition d'un cookie nommé 'access_token' avec le jeton généré, et envoi des données utilisateur restantes en tant que réponse JSON
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    // Si une erreur se produit lors du processus de connexion, passage de l'erreur à la prochaine fonction middleware
    next(error);
  }
};

// Définition d'une fonction nommée google qui gère l'authentification via Google
export const google = async (req, res, next) => {
  // Extraction de l'e-mail, du nom et de l'URL de la photo de profil Google à partir du corps de la requête
  const { email, name, googlePhotoUrl } = req.body;
  try {
    // Recherche d'un utilisateur avec l'e-mail fourni dans la base de données
    const user = await User.findOne({ email });
    // Si un utilisateur est trouvé avec l'e-mail fourni
    if (user) {
      // Génération d'un jeton JSON avec l'identifiant de l'utilisateur et le statut isAdmin, signé avec la variable d'environnement JWT_SECRET
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      // Destructuration du champ mot de passe du document utilisateur
      const { password, ...rest } = user._doc;
      // Envoi d'une réponse avec un code d'état 200, définition d'un cookie nommé 'access_token' avec le jeton généré, et envoi des données utilisateur restantes en tant que réponse JSON
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      // Si aucun utilisateur n'est trouvé avec l'e-mail fourni, créer un nouvel utilisateur
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        // Générer un nom d'utilisateur unique basé sur le nom fourni et des caractères aléatoires
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      // Enregistrer le nouvel utilisateur dans la base de données
      await newUser.save();
      // Génération d'un jeton JSON avec l'identifiant du nouvel utilisateur et le statut isAdmin, signé avec la variable d'environnement JWT_SECRET
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      // Destructuration du champ mot de passe du document nouvel utilisateur
      const { password, ...rest } = newUser._doc;
      // Envoi d'une réponse avec un code d'état 200, définition d'un cookie nommé 'access_token' avec le jeton généré, et envoi des données utilisateur restantes en tant que réponse JSON
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    // Si une erreur se produit lors du processus d'authentification Google, passage de l'erreur à la prochaine fonction middleware
    next(error);
  }
};
