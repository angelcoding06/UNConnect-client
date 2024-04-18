'use client';
import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import GroupCard from '../../components/groupcard';
import Header from '../../components/header';

const cookies = new Cookies(null, { path: '/' });

const CREATE_GROUP = gql`
  mutation CreateGroup(
    $name: String!,
    $photo: String!,
    $description: String!,
    $isPrivate: Boolean!,
    $ownerId: Int!,
    $inRequests: [Int!]!,
    $members: [Int!]!,
    $admins: [Int!]!
  ) {
    createGroup(
      name: $name,
      photo: $photo,
      description: $description,
      isPrivate: $isPrivate,
      ownerId: $ownerId,
      inRequests: $inRequests,
      members: $members,
      admins: $admins
    ) {
      id
      name
      photo
      description
      isPrivate
      ownerId
      inRequests
      members
      admins
    }
  }
`;





const CreateGroupPage = () => {
    const router = useRouter();
    const token = cookies.get('token');
    const [createGroupMutation, { loading, error }] = useMutation(CREATE_GROUP);
    
	
	if (!token) {
		setTimeout(() => {
			router.replace('/login');
		}, 2000);
	}


	if (loading) {
		return <div>Cargando...</div>;
	}
	if (error) console.log('Error: ', error);
    
  
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [ownerId, setOwnerId] = useState<number | null>(null);
    const [inRequests, setInRequests] = useState<number[]>([]);
    const [members, setMembers] = useState<number[]>([]);
    const [admins, setAdmins] = useState<number[]>([]);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      try {
        await createGroupMutation({
          variables: {
            name: name,
            photo: photo,
            description: description,
            isPrivate: isPrivate,
            ownerId: ownerId,
            inRequests: inRequests,
            members: members,
            admins: admins,
          },
        });
  
        setName('');
        setPhoto('');
        setDescription('');
        setIsPrivate(false);
        setOwnerId(0);
        setInRequests([]);
        setMembers([]);
        setAdmins([]);
      } catch (error) {
        console.error('Error creating group:', error);
      }
    };
  
    return (
        <div>
            <header><Header /></header>
        <div className='container mx-auto mt-8 px-24'>
        
        <h2 className='text-xl font-semibold mb-4'>Crear un grupo</h2>
        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className='mb-4'>
            <label htmlFor='name' className='block font-medium mb-1'>
              Nombre:
            </label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
            />
          </div>
          {/* Photo */}
          <div className='mb-4'>
            <label htmlFor='photo' className='block font-medium mb-1'>
              Foto (URL):
            </label>
            <input
              type='text'
              id='photo'
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
            />
          </div>
          {/* Descripción */}
          <div className='mb-4'>
            <label htmlFor='description' className='block font-medium mb-1'>
              Descripción:
            </label>
            <textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
            ></textarea>
          </div>
          {/* Es privado */}
          <div className='mb-4'>
            <label htmlFor='isPrivate' className='block font-medium mb-1'>
              ¿Es privado?
            </label>
            <input
              type='checkbox'
              id='isPrivate'
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          </div>
          {/* OwnerId */}
          <div className='mb-4'>
            <label htmlFor='ownerId' className='block font-medium mb-1'>
              ID del propietario:
            </label>
            <input
              type='number'
              id='ownerId'
              value={ownerId || ''}
              onChange={(e) => setOwnerId(e.target.value ? parseInt(e.target.value, 10) : null)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
            />
          </div>

          
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Crear Grupo
          </button>
        </form>
      </div>
      </div>
    );
  };
  
  export default CreateGroupPage;