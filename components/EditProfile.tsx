import { signOut, useSession } from 'next-auth/react';
import router from 'next/router';
import { useMemo, useState } from 'react';
import styles from '/styles/petProfile.module.css';
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import PlacesAutocomplete from './PlaceAutoComplete';
import { PetProfile } from '@prisma/client';

const EditPetProfile = (props: { petProfile: any }) => {
  const [imageToDisplay, setImageToDisplay] = useState('/img/petpicture.png');
  const [description, setDescription] = useState(props.petProfile.description);
  const [species, setSpecies] = useState(props.petProfile.species);
  const [userProfile] = useState<PetProfile>(props.petProfile);
  const [name, setName] = useState(props.petProfile.name);
  const [imageUploaded, setImageUploaded] = useState();

  const [lat, setLat] = useState(27.672932021393862);
  const [lng, setLng] = useState(85.31184012689732);

  const { status: sesh, data: data } = useSession();

  const handleChange = (e: any) => {
    if (e.target.files === null || e.target.files === undefined) {
      return;
    }

    setImageUploaded(e.target.files[0]);
    setImageToDisplay(URL.createObjectURL(e.target.files[0]));
  };

  const submitProfile = async (petProfile: {
    userEmail: string | undefined | null;
    description: string | undefined | null;
    species: string | undefined | null;
    name: string | undefined | null;
    // imageData: any;
  }) => {
    try {
      console.log(petProfile);
      const response = await fetch('/api/petProfileEdit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petProfile),
      });

      if (response.ok) {
        // Handle successful petProfile creation
        alert('PetProfile edited successfully!');
        router.push('/Dashboard');
      } else {
        // Handle HTTP errors if any
        alert('Error editing petProfile');
      }
    } catch (error) {
      // Handle other potential errors
      console.error('Error editing petProfile', error);
    }
  };

  const deleteProfile = async (petProfile: {
    userEmail: string | undefined | null;
    description: string | undefined | null;
    species: string | undefined | null;
    name: string | undefined | null;
    // imageData: any;
  }) => {
    try {
      console.log(petProfile);
      const response = await fetch('/api/petProfileDelete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petProfile),
      });

      if (response.ok) {
        // Handle successful petProfile creation
        alert('PetProfile deleted successfully!');
        router.push('/Dashboard');
      } else {
        // Handle HTTP errors if any
        alert('Error deleting petProfile');
      }
    } catch (error) {
      // Handle other potential errors
      console.error('Error deleting petProfile', error);
    }
  };

  //   const submitImage = async (image: { imageUploaded: any }) => {
  //     try {
  //       const formData = new FormData();
  //       formData.append('file', imageUploaded!);
  //       formData.append('upload_preset', 'ifs1rfae');

  //       const data = await fetch(process.env.NEXT_PUBLIC_CLOUD_URL!, {
  //         method: 'POST',
  //         body: formData,
  //       }).then((r) => r.json());

  //       return data;
  //     } catch (error) {
  //       console.error('Error Uploading Image', error);
  //     }
  //   };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const image = {
      imageUploaded,
    };

    // const imageData = await submitImage(image);
    const userEmail = data?.user?.email;

    const petProfile = {
      userEmail,
      description,
      species,
      name,
      //   imageData,
    };

    await submitProfile(petProfile);

    window.location.reload();
  };

  const handleDelete = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const image = {
      imageUploaded,
    };

    // const imageData = await submitImage(image);
    const userEmail = data?.user?.email;

    const petProfile = {
      userEmail,
      description,
      species,
      name,
      //   imageData,
    };

    await deleteProfile(petProfile);

    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit}>
        {/* <div
          className="mt-8 mb-8"
          style={{
            position: 'relative',
            width: '250px',
            height: '250px',
            marginLeft: '50px', // Adjust the value as needed
          }}
        >
          <label htmlFor="fileInput">
            <Image
              src={imageToDisplay}
              alt=""
              sizes="500px"
              fill
              style={{
                objectFit: 'contain',
                border: '3px solid #000000',
              }}
            />
          </label>

          <input
            id="fileInput"
            onChange={handleChange}
            accept=".jpg, .png, .gif, .jpeg"
            type="file"
            hidden
            required
          />
        </div> */}

        <div className="mb-6">
          <img src="/img/name.png" className={styles.nameImage} alt="Name" />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block appearance-none w-full 
          border rounded py-2 px-3 text-gray-700 
          leading-tight focus:outline-none 
          focus:shadow-outline"
            maxLength={200}
          />
        </div>

        <div className="mb-4">
          <img
            src="/img/description.png"
            className={styles.descriptionImage}
            alt="Description"
          />
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={7}
            className="block appearance-none w-full 
          border rounded py-2 px-3 text-gray-700 
          leading-tight focus:outline-none 
          focus:shadow-outline"
            maxLength={322}
          ></textarea>
        </div>

        <div className="mb-6">
          <img
            src="/img/species.png"
            className={styles.speciesImage}
            alt="species"
          />
          <input
            id="species"
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
            className="block appearance-none w-full 
          border rounded py-2 px-3 text-gray-700 
          leading-tight focus:outline-none 
          focus:shadow-outline"
            maxLength={200}
          />
        </div>

        <div className="mb-6">
          <img
            src="/img/location.png"
            className={styles.locationImage}
            alt="Location"
          />
          <PlacesAutocomplete
            onAddressSelect={(address: any) => {
              getGeocode({ address: address }).then((results) => {
                const { lat, lng } = getLatLng(results[0]);
                setLat(lat);
                setLng(lng);
              });
            }}
          />
        </div>

        <div className="mb-6"></div>
        <div className="flex items-center justify-between">
          <button type="submit">Submit</button>
        </div>
      </form>
      {/* <form onSubmit={handleDelete}>
        <div className="mb-6"></div>
        <div className="flex items-center justify-between">
          <button type="submit">Delete</button>
        </div>
      </form> */}
      <button onClick={() => signOut({ callbackUrl: '/' })}>Sign-Out</button>
    </div>
  );
};

export default EditPetProfile;
