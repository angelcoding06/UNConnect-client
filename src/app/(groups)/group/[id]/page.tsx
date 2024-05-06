/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { url } from 'inspector';
import Header from '../../../components/header';
import Cookies from 'universal-cookie';
import CreatePostGroup from '../../../components/createpostgroup';
import GroupPosts from '@/app/components/grouposts';

const cookies = new Cookies(null, { path: '/' });

function useNavigationEvent() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	useEffect(() => {
		const url = pathname + searchParams.toString();
	}, [pathname, searchParams]);
}

const GET_PERSON_BY_AUTH_ID = gql`
	query GetPersonByAuthId($token: String!) {
		PersonByAuthID(token: $token) {
			id
			userId
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

const EDIT_GROUP = gql`
	mutation EditGroup(
		$groupId: Int!
		$name: String!
		$photo: String!
		$description: String!
		$isPrivate: Boolean!
		$ownerId: Int!
	) {
		editGroup(
			groupId: $groupId
			name: $name
			photo: $photo
			description: $description
			isPrivate: $isPrivate
			ownerId: $ownerId
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

const UPDATE_PROFILE = gql`
	mutation UpdateProfile(
		$token: String!
		$Name: String
		$LastName: String
		$Birthday: String
		$Campus: String
		$Faculty: String
		$Career: String
		$MemberUNSince: Int
		$PhoneNumber: String
		$Gender: String
		$ProfilePhoto: String
		$myGroups: [String]
	) {
		editUser(
			token: $token
			Name: $Name
			LastName: $LastName
			Birthday: $Birthday
			Campus: $Campus
			Faculty: $Faculty
			Career: $Career
			MemberUNSince: $MemberUNSince
			PhoneNumber: $PhoneNumber
			Gender: $Gender
			ProfilePhoto: $ProfilePhoto
			myGroups: $myGroups
		) {
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

const ADD_IN_REQUEST = gql`
	mutation AddInRequest($userId: Int!, $groupId: Int!) {
		addInRequest(userId: $userId, groupId: $groupId) {
			id
			name
			members
		}
	}
`;

const ADD_USER_TO_GROUP = gql`
	mutation AddUserToGroup($groupId: Int!, $userId: Int!) {
		addUserToGroup(groupId: $groupId, userId: $userId) {
			id
			name
		}
	}
`;

const GroupDetailsPage = () => {
	const router = useRouter();
	const token = cookies.get('token');

	const pathname = usePathname();
	const searchParams = useSearchParams();
	const url = pathname + searchParams.toString();
	const id = Number(pathname.split('/').pop());
	const idstr = pathname.split('/').pop();

	const [addInRequestMutation] = useMutation(ADD_IN_REQUEST);
	const [addUserToGroupMutation] = useMutation(ADD_USER_TO_GROUP);

	const [ownerId, setOwnerId] = useState<number | null>(null);
	const [userId, setUserId] = useState<number | null>(null);
	const [isEditing, setIsEditing] = useState(false);

	const { data, loading, error, refetch } = useQuery(GET_GROUP_BY_ID, {
		variables: { groupId: id },
		skip: isNaN(id),
	});

	const {
		loading: personLoading,
		error: personError,
		data: personData,
	} = useQuery(GET_PERSON_BY_AUTH_ID, {
		variables: { token: token },
	});

	const [
		editGroup,
		{ data: mutationData, loading: mutationLoading, error: mutationError },
	] = useMutation(EDIT_GROUP);

	const handleCancelEdit = () => {
		setIsEditing(false);
	};

	const group = data?.getGroup;

	const handlePhotoChange = async (e: any) => {
		const file = e.target.files;
		const formData = new FormData();

		for (let i = 0; i < file.length; i++) {
			formData.append('files', file[i]);
		}

		try {
			const response = await fetch(
				`http://localhost:81/upload-file/?token=${token}`,
				{
					method: 'POST',
					body: formData,
				}
			);
			const data = await response.json();

			if (response.ok) {
				if (group.photo != '') {
					await fetch(
						`http://localhost:81/delete-file?file_id=${group.photo}&token=${token}`,
						{
							method: 'DELETE',
						}
					);
				}

				await editGroup({
					variables: {
						id: group.id,
						name: group.name,
						photo: data.ids[0],
						description: group.description,
						isPrivate: group.isPrivate,
						ownerId: group.ownerId,
					},
				});
				refetch();
			} else {
				console.error('Error uploading file:', data.message);
			}
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};

	const {
		data: userdata,
		loading: usergloading,
		error: usergerror,
	} = useQuery(GET_USER_PROFILE, {
		variables: { token: token },
	});

	const [
		updateProfile,
		{ data: mmutationData, loading: mmutationLoading, error: mmutationError },
	] = useMutation(UPDATE_PROFILE);

	const [myGroups, setMyGroups] = useState<string[]>([]);
	const [
		updateProfileMutation,
		{ loading: updateLoading, error: updateError },
	] = useMutation(UPDATE_PROFILE);

	useEffect(() => {
		if (personData && personData.PersonByAuthID) {
			const ownerId = personData.PersonByAuthID.id
				? parseInt(personData.PersonByAuthID.id, 10)
				: null;
			setOwnerId(ownerId);
		}
	}, [personData]);

	useEffect(() => {
		if (ownerId !== null && !isNaN(ownerId)) {
			refetch();
		}
	}, [ownerId, refetch]);

	useEffect(() => {
		if (data && data.getGroup) {
			setUserId(data.getGroup.ownerId);
		}
	}, [data]);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		if (personData && personData.PersonByAuthID) {
			setOwnerId(
				personData.PersonByAuthID.id
					? parseInt(personData.PersonByAuthID.id, 10)
					: null
			);
		}
	}, [personData]);

	const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;

		if (!name || !description) {
			console.error('Name and description are required');
			return;
		}

		await editGroup({
			variables: {
				groupId: group.id,
				name: name,
				photo: group.photo || '',
				description: description,
				isPrivate: group.isPrivate || false,
				ownerId: group.ownerId || 0,
				inRequests: group.inRequests || [],
				members: group.members || [],
				admins: group.admins || [],
			},
		});
	};

	const isMemberOrRequested = () => {
		return user?.myGroups.includes(idstr);
	};

	const handleJoinGroup = async () => {
		try {
			if (group) {
				if (!group.isPrivate) {
					const updatedMyGroups = [...(user?.myGroups || []), idstr];
					console.log('esta es la lista de grupos', updatedMyGroups);
					await updateProfileMutation({
						variables: {
							token: token,
							Name: user.Name,
							LastName: user.LastName,
							Birthday: user.Birthday,
							Campus: user.Campus,
							Faculty: user.Faculty,
							Career: user.Career,
							MemberUNSince: user.MemberUNSinceInt,
							PhoneNumber: user.PhoneNumber,
							Gender: user.Gender,
							myGroups: updatedMyGroups,
							ProfilePhoto: user.ProfilePhoto,
						},
					});
				} else {
					await addInRequestMutation({
						variables: {
							userId: userId,
							groupId: group.id,
						},
					});
				}
				refetch();
			}
		} catch (error) {
			console.error('Error al unirse al grupo:', error);
		}
	};

	console.log('UserID', userId);
	console.log('GroupID', id);

	if (mutationLoading) {
		return <div>Cargando mutacion...</div>;
	}

	if (personLoading) return <div>Cargando propietario...</div>;
	if (personError) console.log('Error obteniendo propietario:', personError);
	if (isNaN(id)) return <p>Cargando...</p>;
	if (loading) return <p>Cargando...</p>;
	if (error) return <p>Error: {error.message}</p>;
	if (usergloading) {
		return <div>Cargando...</div>;
	}
	if (usergerror) console.log('Error: ', error);

	if (!group) return <p>No se encontró el grupo</p>;

	const user = userdata.getUserByAuthId;

	return (
		<div className='bg-slate-300 min-h-screen'>
			<header>
				<Header />
			</header>
			<div className='container mx-auto px-6 py-10 '>
				<div className=' rounded-lg overflow-hidden shadow-md border  bg-gray-800 p-8 '>
					<div className='flex items-center justify-between mb-6'>
						<div className='flex items-center'>
							<img
								src={`http://localhost:81/get-file?file_id=${group.photo}`}
								alt='Foto de grupo'
								className='rounded-full w-24 h-24 object-cover mr-6'
							/>
							{isEditing ? (
								<form
									className='flex flex-col items-start space-y-4'
									onSubmit={handleSaveChanges}
								>
									<input
										type='text'
										name='name'
										placeholder='Nombre del grupo'
										defaultValue={group.name}
									/>
									<input
										type='text'
										name='description'
										placeholder='description'
										defaultValue={group.description}
									/>
									<div className='space-x-2'>
										<button
											type='submit'
											className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
											// onClick={}
										>
											Guardar cambios
										</button>
										<button
											type='button'
											className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
											onClick={handleCancelEdit}
										>
											Cancelar
										</button>
									</div>
								</form>
							) : (
								<>
									<div>
										<h2 className='text-xl font-semibold text-white'>
											{group.name}
										</h2>
										<p className='mb-6 text-lg text-gray-400 '>
											{group.description}
										</p>
										{userId === ownerId && (
											<div className='flex space-x-4'>
												<button
													type='button'
													className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
													onClick={() => setIsEditing(true)}
												>
													Editar
												</button>
											</div>
										)}
									</div>
								</>
							)}
						</div>
						<button
							className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg ${
								isMemberOrRequested() || userId === ownerId ? 'hidden' : ''
							}`}
							onClick={handleJoinGroup}
						>
							Unirse
						</button>
					</div>
					<div className='text-white mb-6'></div>
				</div>
				<div className='flex flex-col items-center'>
					<h1 className='flex text-3xl font-bold mb-4 items-center'>
						Creación de publicaciones
					</h1>
					<CreatePostGroup groupId={idstr} />
					<GroupPosts token={token} groupId={idstr} />
				</div>
			</div>
		</div>
	);
};

export default GroupDetailsPage;
