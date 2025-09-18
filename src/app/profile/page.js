'use client';

import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { locations } from "../data/locations"; // Make sure path is correct
import { useRouter } from "next/navigation";
import { deleteDoc } from "firebase/firestore"; // import deleteDoc at the top
import LoadingScreen from "../components/Loading"; // Import LoadingScreen component

const Profile = () => {
  const [profilePic, setProfilePic] = useState("");
  const [checkedInLocations, setCheckedInLocations] = useState([]);
  const [uncheckedLocations, setUncheckedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfileData = async () => {
      const currentUser = auth.currentUser;
      setUser(currentUser);

      if (currentUser) {
        const userDocRef = doc(db, "Users", currentUser.uid);
        try {
          const userData = await getDoc(userDocRef);
          if (userData.exists()) {
            const data = userData.data();
            setProfilePic(data.profilePicture);
            const checkedInIds = data.checkedInLocations || [];
            const selectedLocationsIds = data.selectedLocations || [];

            const checkedIn = locations.filter((loc) => checkedInIds.includes(loc.id));
            const unchecked = locations.filter((loc) => (!checkedInIds.includes(loc.id) && selectedLocationsIds.includes(loc.id))); // Not Checked in and in Selected

            setCheckedInLocations(checkedIn);
            setUncheckedLocations(unchecked);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Error fetching user data.");
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, []);

  const handleSignOut = () => {
    auth.signOut();
    alert('Signed Out!')
    router.replace('/')
  };

  const handleGoBack = () =>{
    router.replace('/dashboard')
  }

  const handleDeleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      const userDocRef = doc(db, "Users", currentUser.uid);
  
      await deleteDoc(userDocRef);
  
      await currentUser.delete();
    
      alert("Account Deleted!")
      router.replace('/')
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Error deleting account.");
    }
  };
  
  const handleProfilePicEdit = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    setIsUploading(true);

    const storageRef = ref(storage, `profilePictures/${user.uid}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          setError("Error uploading image.");
          console.error("Error during upload:", error);
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); // 🛠️ <-- no parentheses
      
      
          const userDocRef = doc(db, "Users", auth.currentUser.uid);
          try {
            await updateDoc(userDocRef, {
              profilePicture: downloadURL,
            });
      
            setProfilePic(downloadURL);
            setIsUploading(false);
            setIsEditing(false);
          } catch (error) {
            setError("Error updating Firestore with new image URL.");
            console.error("Error updating Firestore:", error);
            setIsUploading(false);
          }
        }
      );
};

  if (loading) return <LoadingScreen />; // Display LoadingScreen while data is loading
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-[var(--page-background)] flex flex-col items-center">
      <div className="bg-[#4A8D5E] backdrop-blur-md rounded-3xl p-8 md:p-10 w-[90%] max-w-4xl shadow-lg mt-8 flex flex-col items-center">
        {/* Profile Picture */}
        <title>Profile</title>
        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
          {profilePic && !isEditing ? (
            <Image
              src={profilePic}
              alt="Profile Picture"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="bg-gray-300 w-full h-full flex items-center justify-center text-xl text-gray-600">
              ?
            </div>
          )}
        </div>

        {/* Edit Button */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#BEDFC8] text-black rounded-full p-2 px-6 hover:bg-[#7DC091] transition mb-6"
          >
            Edit Profile Picture
          </button>
        ) : (
          <div className="flex flex-col items-center mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicEdit}
              className="block text-sm text-black file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-[#BEDFC8] file:text-black
              hover:file:bg-[#7DC091]"
            />
            {isUploading && <span className="mt-2 text-[#DFEFE3]">Uploading...</span>}
          </div>
        )}

        <div className="flex flex-wrap w-full justify-between mb-6">
          <div className="w-full md:w-[48%]">
            <h2 className="text-2xl font-bold text-[var(--background)] mb-4 text-center">Checked-In Locations</h2>
            <ul>
              {checkedInLocations.map((location) => (
                <li key={location.id} className="mb-2 font-semibold text-center text-[#DFEFE3]">
                  {location.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-[48%]">
            <h2 className="text-2xl font-bold text-[var(--background)] mb-4 text-center">Check them Out!</h2>
            <ul>
              {uncheckedLocations.map((location) => (
                <li key={location.id} className="mb-2 font-semibold text-center text-[#DFEFE3]">
                  {location.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 sm:justify-center">
          <button
            onClick={handleSignOut}
            className="bg-[#BEDFC8] text-black rounded-full py-3 px-8 hover:bg-[#7DC091] transition w-full sm:w-auto"
          >
            Sign Out
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-[#BEDFC8] text-black rounded-full py-3 px-8 hover:bg-[#7DC091] transition w-full sm:w-auto"
          >
            Delete Account
          </button>
          <button
            onClick={handleGoBack}
            className="bg-[#BEDFC8] text-black rounded-full py-3 px-8 hover:bg-[#7DC091] transition w-full sm:w-auto"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
