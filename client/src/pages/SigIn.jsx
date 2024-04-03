//import React from 'react'
import { Link, useNavigate } from 'react-router-dom'; // Import des modules nécessaires depuis react-router-dom
import { Alert, Label, Spinner, TextInput, Button } from 'flowbite-react'; // Import des composants nécessaires depuis flowbite-react
import { useState } from 'react'; // Import de la fonction useState depuis React
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

export default function SingIn() {

 // Déclaration des états du formulaire et des messages d'erreur
 const [formData, setFormData] = useState({}); // État du formulaire pour stocker les données des champs
 const { loading, error: errorMessage } = useSelector((state) => state.user);
 const navigate = useNavigate();
 const dispatch = useDispatch();

 // Fonction pour gérer le changement dans les champs du formulaire
 const handleChange = async (e) => {
   setFormData({ ...formData, [e.target.id]: e.target.value.trim() }); // Met à jour l'état du formulaire avec les nouvelles données entrées
 };

 // Fonction pour gérer la soumission du formulaire
 const handleSumbit = async (e) => {
   e.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire

   // Vérification de la saisie des champs obligatoires
   if (!formData.email || !formData.password) {
    return dispatch(signInFailure('Please fill all the fields'));
   }

   try {
    dispatch(signInStart());
     const res = await fetch('/api/auth/signin', { // Appel à l'API pour s'inscrire
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData),
     });
     const data = await res.json(); // Conversion de la réponse en JSON

     if (data.success === false) { // Vérification si l'inscription a échoué
      dispatch(signInFailure(data.message));
     }
     if (res.ok) { // Vérification si la réponse est OK
      dispatch(signInSuccess(data));
       navigate('/'); // Redirection vers la page de connexion
     }
   } catch (error) {

    dispatch(signInFailure(error.message));
   }
 };

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
          This is a demo project. You can sign in with your email and password
            or with Google.
          </p>
        </div>
        {/* Contenu à droite */}
        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSumbit}>
      
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
                placeholder='*******'
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
                'Sign in'
              )}
            </Button>
            <OAuth />
          </form>
          {/* Lien vers la page de connexion */}
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sigin-up' className='text-blue-500'>
              Sign up
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
