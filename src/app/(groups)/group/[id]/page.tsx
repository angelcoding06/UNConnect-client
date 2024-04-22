'use client';
import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { url } from 'inspector';
import Header from '../../../components/header';

function useNavigationEvent() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    useEffect(() => {
       const url = pathname + searchParams.toString()
    }, [pathname, searchParams])
 }

const GET_GROUP_BY_ID = gql`
  query GetGroup($groupId: Int!) {
    getGroup(groupId: $groupId) {
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

const GroupDetailsPage = () => {
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const url = pathname + searchParams.toString()
  const id = Number(pathname.split('/').pop());


  const { data, loading, error, refetch } = useQuery(GET_GROUP_BY_ID, {
    variables: { groupId: id },
    skip: isNaN(id)
  });

  useEffect(() => {
    if (!isNaN(id)) {
      refetch();
    }
  }, [id, refetch]);

  if (isNaN(id)) return <p>Cargando...</p>;
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const group = data?.getGroup;

  if (!group) return <p>No se encontró el grupo</p>;

  return (
    <div className="container mx-auto px-6 py-10">
        <header><Header /></header>
        <div className=" rounded-lg overflow-hidden shadow-md border  bg-gray-800 p-8 ">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src={`http://localhost:8000/get-file?file_id=${group.photo}`}
              alt='Foto de grupo'
              className='rounded-full w-24 h-24 object-cover mr-6'
            />
            <div>
              <h2 className="text-xl font-semibold text-white">{group.name}</h2>
              <p className="text-gray-400 text-base">Grupo público • {group.members.length} miembros</p>
            </div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-lg">
            Unirse
          </button>
        </div>
        <div className="text-white">
          <p className="mb-6 text-lg">{group.description}</p>
          <div className="flex space-x-6">
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default GroupDetailsPage
