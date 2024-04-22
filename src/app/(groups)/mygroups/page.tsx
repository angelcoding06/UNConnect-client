/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import GroupCard from '../../components/groupcard';
import Header from '../../components/header';
const cookies = new Cookies(null, { path: '/' });

const GET_GROUPS = gql`
  query {
    getGroups {
      groups {
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
  }
`;



const AllGroupsPage = () => {
  const [limit, setLimit] = useState(10); // Número de grupos por página
  const [offset, setOffset] = useState(0); // Desplazamiento

  const router = useRouter();
  const token = cookies.get('token');
  
  if (!token) {
    setTimeout(() => {
      router.replace('/login');
    }, 2000);
  }

  const { loading, error, data, fetchMore } = useQuery(GET_GROUPS, {
    variables: { limit, offset },
  });

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        offset: offset + limit,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getGroups: {
            groups: [...prev.getGroups.groups, ...fetchMoreResult.getGroups.groups],
          },
        };
      },
    });
    setOffset(offset + limit);
  };

  if (loading && offset === 0) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header><Header /></header>
      <h1 className="text-4xl font-extrabold text-center text-black mb-8">
        Lista de Grupos
      </h1>
      {data && data.getGroups && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.getGroups.groups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
          <button
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleLoadMore}
          >
            Cargar más
          </button>
        </>
      )}
    </div>
  );
};


export default AllGroupsPage;