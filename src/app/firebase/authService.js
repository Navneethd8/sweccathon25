import { auth, db, storage } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Sign up a new user and create Firestore document
 */
export async function signUp(email, password, file, router) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Upload profile picture if file exists
    let profilePictureURL = '';
    if (file) {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      profilePictureURL = await getDownloadURL(storageRef);
    }

    await sendEmailVerification(user);

    // Create Firestore document
    await setDoc(doc(db, 'Users', user.uid), {
      uid: user.uid,
      email: user.email,
      profilePicture: profilePictureURL,
      createdAt: new Date(),
    });

    alert(`User Signed Up! Check Email for verification: ${user.email}`);
    console.log('Signed up, uploaded profile picture, and added user to Firestore');

    router.push('/');
    return user;
  } catch (error) {
    console.error('Signup error:', error.message);
    throw error;
  }
}

/**
 * Log in an existing user
 */
export async function login(email, password, router) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Logged In:', user.uid);

    router.push('/dashboard');
    return user;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function forgotPassword(email, router) {
  try {
    await sendPasswordResetEmail(auth, email);

    alert('Password reset email sent');
    router.push('/');
  } catch (error) {
    console.error('Password reset error:', error.message);
    throw error;
  }
}
