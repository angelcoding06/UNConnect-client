/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import GroupCard from '../../components/groupcard';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import Header from '../../components/header';
const cookies = new Cookies(null, { path: '/' });

const GET_USER_PROFILE = gql`
	query getUserByAuthId($token: String!) {
		getUserByAuthId(token: $token) {
			Name
			LastName
			Birthday
			Campus
			Faculty
			Career
			MemberUNSince
			PhoneNumber
			Gender
			ProfilePhoto
			myGroups
		}
	}
`;

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

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
});




const MyGroupsPage = () => {
  const router = useRouter();
  const token = cookies.get('token');
  
  if (!token) {
    setTimeout(() => {
      router.replace('/login');
    }, 2000);
  }

  const { data, loading: usergloading, error: usergerror, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { token: token },
  });

  const [myGroups, setMyGroups] = useState<number[]>([]); // Cambiado a number[] para IDs de tipo int
  const [groupsData, setGroupsData] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.getUserByAuthId && data.getUserByAuthId.myGroups) {
      // Convertir IDs de grupo a int
      
      const groupIds = data.getUserByAuthId.myGroups.map((groupId:any) => parseInt(groupId, 10));
      console.log(groupIds)
      setMyGroups(groupIds);
      
      const fetchGroups = async () => {
        const groupsPromises = groupIds.map((groupId: number) => {
          return client.query({
            query: GET_GROUP_BY_ID ,
            variables: { groupId: groupId },
          });
        });

        const groupsDataResult = await Promise.all(groupsPromises);
        setGroupsData(groupsDataResult.map(result => result.data.getGroup));
      };

      fetchGroups();
    }
  }, [data]);

  if (usergloading) return <p>Cargando...</p>;
  if (usergerror) return <p>Error: {usergerror.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header><Header /></header>
      <h1 className="text-4xl font-extrabold text-center text-black mb-8">
        Tus Grupos
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupsData.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

export default MyGroupsPage;