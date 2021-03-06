import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


const config =  {
    apiKey: "AIzaSyAXha-4DXpXxjJGLLTKS8MG8sB8o4Iye4w",
    authDomain: "crwn-clothing-d2f6d.firebaseapp.com",
    databaseURL: "https://crwn-clothing-d2f6d.firebaseio.com",
    projectId: "crwn-clothing-d2f6d",
    storageBucket: "crwn-clothing-d2f6d.appspot.com",
    messagingSenderId: "955549424577",
    appId: "1:955549424577:web:02bc864fbf667ac8122d40",
    measurementId: "G-JGVSMHR87B"
  };

  firebase.initializeApp(config);

  export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();
   

   if(!snapShot.exists) {
     const { displayName, email } = userAuth;
     const createAt = new Date();

     try {
       await userRef.set({
         displayName,
         email,
         createAt,
         ...additionalData
       });
     } catch (error) {
     console.log('error creating user', error.message);
     }
   }

   return userRef;
  };

  export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = firestore.collection(collectionKey);
  

    const batch = firestore.batch();
    objectsToAdd.forEach(obj => {
      const newDocRef = collectionRef.doc();
      batch.set(newDocRef, obj);
    });

    return await batch.commit();

  };

export const convertCollectionsSnapshotToMap = collections => {
  const transformedCollection = collections.docs.map(doc => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items  
    }
  });
  return transformedCollection.reduce( (accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};


  export const auth = firebase.auth();
  export const firestore = firebase.firestore();

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  export const signInWithGoogle = () => auth.signInWithPopup(provider);

  export default firebase;
  
  