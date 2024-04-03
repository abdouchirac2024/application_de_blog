import { Link, useNavigate } from 'react-router-dom'; // Import des modules nécessaires depuis react-router-dom
import { Alert, Label, Spinner, TextInput, Button } from 'flowbite-react'; // Import des composants nécessaires depuis flowbite-react
import { useState } from 'react'; // Import de la fonction useState depuis React
import OAuth from '../components/OAuth';


export default function SignUp() {
  // Déclaration des états du formulaire et des messages d'erreur
  const [formData, setFormData] = useState({}); // État du formulaire pour stocker les données des champs
  const [errorMessage, setErrorMessage] = useState(null); // État pour stocker les messages d'erreur
  const [loading, setLoading] = useState(false); // État pour gérer l'état de chargement lors de la soumission du formulaire

  // Utilisation du hook useNavigate pour la navigation
  const navigate = useNavigate();

  // Fonction pour gérer le changement dans les champs du formulaire
  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() }); // Met à jour l'état du formulaire avec les nouvelles données entrées
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSumbit = async (e) => {
    e.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire

    // Vérification de la saisie des champs obligatoires
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.'); // Affichage d'un message d'erreur si tous les champs ne sont pas remplis
    }

    try {
      setLoading(true); // Active l'état de chargement
      setErrorMessage(null); // Réinitialise les messages d'erreur
      const res = await fetch('/api/auth/signup', { // Appel à l'API pour s'inscrire
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json(); // Conversion de la réponse en JSON

      if (data.success === false) { // Vérification si l'inscription a échoué
        return setErrorMessage(data.message); // Affichage du message d'erreur renvoyé par l'API
      }

      setLoading(false); // Désactive l'état de chargement
      if (res.ok) { // Vérification si la réponse est OK
        navigate('/sigin-in'); // Redirection vers la page de connexion
      }
    } catch (error) {
      setErrorMessage(error.message); // Affichage du message d'erreur en cas d'erreur de requête
      setLoading(false); // Désactive l'état de chargement
    }
  };

  // Rendu du composant SignUp
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/*  Contenu à gauche */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              ISTAMA
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        {/* Contenu à droite */}
        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSumbit}>
            <div>
              <Label value='Your username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='abdouchirac@gmail.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />
            </div>
            {/* Bouton de soumission du formulaire */}
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <OAuth />
          </form>
          {/* Lien vers la page de connexion */}
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sigin-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>
          {/* Affichage du message d'erreur */}
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
