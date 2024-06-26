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
    
  
  const router = useRouter();
	const token = cookies.get('token');
	if (!token) {
		setTimeout(() => {
			router.replace('/login');
		}, 2000);
	}
    const { loading, error, data } = useQuery(GET_GROUPS);
    
    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;
	
	

	if (loading) {
		return <div>Cargando...</div>;
	}
	if (error) console.log('Error: ', error);


	return (
		<div className="container mx-auto px-4 py-8">
            <header><Header /></header>
            <h1 className="text-4xl font-extrabold text-center text-black mb-8">
            Lista de Grupos
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.getGroups.groups.map((group: any) => (
                <GroupCard key={group.id} group={group} />
                ))}
            </div>
        </div>
	);
};

export default AllGroupsPage;