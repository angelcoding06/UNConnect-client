'use client';
import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import GroupCard from '../../components/groupcard';
import Header from '../../components/header';

const cookies = new Cookies(null, { path: '/' });

const GET_PERSON_BY_AUTH_ID = gql`
	query GetPersonByAuthId($token: String!) {
		PersonByAuthID(token: $token) {
			id
			userId
		}
	}
`;

const CREATE_GROUP = gql`
	mutation CreateGroup(
		$name: String!
		$photo: String!
		$description: String!
		$isPrivate: Boolean!
		$ownerId: Int!
		$inRequests: [Int!]!
		$members: [Int!]!
		$admins: [Int!]!
	) {
		createGroup(
			name: $name
			photo: $photo
			description: $description
			isPrivate: $isPrivate
			ownerId: $ownerId
			inRequests: $inRequests
			members: $members
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

const CreateGroupPage = () => {
	const router = useRouter();
	const token = cookies.get('token');

	if (!token) {
		setTimeout(() => {
			router.replace('/login');
		}, 2000);
	}

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isPrivate, setIsPrivate] = useState(false);
	const [ownerId, setOwnerId] = useState<number | null>(null);
	const [inRequests, setInRequests] = useState<number[]>([]);
	const [members, setMembers] = useState<number[]>([]);
	const [admins, setAdmins] = useState<number[]>([]);

	const [photoFile, setPhotoFile] = useState<File | null>(null); // Almacena el archivo seleccionado
	const [uploadedPhoto, setUploadedPhoto] = useState<string>(''); // Almacena el string de la foto subida
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const [createGroupMutation, { loading, error }] = useMutation(CREATE_GROUP);
	const {
		loading: personLoading,
		error: personError,
		data: personData,
	} = useQuery(GET_PERSON_BY_AUTH_ID, {
		variables: { token: token },
	});

	const {
		data,
		loading: usergloading,
		error: usergerror,
		refetch,
	} = useQuery(GET_USER_PROFILE, {
		variables: { token: token },
	});
	const [isEditing, setIsEditing] = useState(false);
	const [
		updateProfile,
		{ data: mutationData, loading: mutationLoading, error: mutationError },
	] = useMutation(UPDATE_PROFILE);

	const [myGroups, setMyGroups] = useState<string[]>([]);
	const [
		updateProfileMutation,
		{ loading: updateLoading, error: updateError },
	] = useMutation(UPDATE_PROFILE);

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

	if (usergloading) {
		return <div>Cargando...</div>;
	}
	if (usergerror) console.log('Error: ', error);
	if (mutationError) console.log('mutationError: ', mutationError);

	if (loading) {
		return <div>Cargando...</div>;
	}
	if (error) console.log('Error: ', error);
	if (personLoading) return <div>Cargando propietario...</div>;
	if (personError) console.log('Error obteniendo propietario:', personError);
	if (updateLoading) return <div>Cargando...</div>;
	if (updateError) {
		console.log('Error al actualizar perfil:', updateError);
	}

	const user = data.getUserByAuthId;

	const handlePhotoChange = async (e: any) => {
		const file = e.target.files[0];
		setPhotoFile(file);
		const objectUrl = URL.createObjectURL(file); // Crear URL para la previsualización
		setPreviewUrl(objectUrl); // Actualizar el estado de la previsualización

		const formData = new FormData();
		formData.append('files', file);

		try {
			const response = await fetch(
				`http://localhost:81/upload-file/?token=${token}`,
				{
					method: 'POST',
					body: formData,
				}
			);
			const data = await response.json();
			console.log('Response:', data);

			if (response.ok && data.ids && data.ids.length > 0) {
				setUploadedPhoto(data.ids[0]);
			} else {
				console.error('Error uploading file:', data.message);
			}
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const { data } = await createGroupMutation({
				variables: {
					name: name,
					photo: uploadedPhoto,
					description: description,
					isPrivate: isPrivate,
					ownerId: ownerId ? parseInt(ownerId.toString(), 10) : null,
					inRequests: inRequests,
					members: members,
					admins: admins,
				},
			});

			const groupId = data?.createGroup?.id?.toString();

			if (groupId) {
				const updatedMyGroups = [...(user?.myGroups || []), groupId];
				console.log(updatedMyGroups);

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
			}

			setName('');
			setDescription('');
			setIsPrivate(false);
			setOwnerId(0);
			setInRequests([]);
			setMembers([]);
			setAdmins([]);

			if (data && data.createGroup && data.createGroup.id) {
				const groupId = data.createGroup.id;
			}
		} catch (error) {
			console.error('Error creating group:', error);
		}
	};

	return (
		<div>
			<header>
				<Header />
			</header>
			<div className='container mx-auto mt-8 px-8'>
				<h2 className='text-xl font-semibold mb-4'>Crear un grupo</h2>
				<form onSubmit={handleSubmit} className='space-y-4'>
					{/* Nombre */}
					<div>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-gray-600'
						>
							Nombre:
						</label>
						<input
							type='text'
							id='name'
							value={name}
							onChange={(e) => setName(e.target.value)}
							className='mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
						/>
					</div>
					{/* Foto */}
					<div>
						<label
							htmlFor='photo'
							className='block text-sm font-medium text-gray-600'
						>
							Foto:
						</label>
						<input
							type='file'
							id='photo'
							accept='image/*'
							onChange={handlePhotoChange}
							className='mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
						/>
					</div>
					<div>
						{/* Previsualización de la foto */}
						{previewUrl && (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={previewUrl}
								alt='Preview'
								className='mt-4 max-w-xs rounded-lg'
							/>
						)}
					</div>
					{/* Descripción */}
					<div>
						<label
							htmlFor='description'
							className='block text-sm font-medium text-gray-600'
						>
							Descripción:
						</label>
						<textarea
							id='description'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className='mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
						></textarea>
					</div>
					{/* Es privado */}
					<div>
						<label htmlFor='isPrivate' className='flex items-center'>
							<input
								type='checkbox'
								id='isPrivate'
								checked={isPrivate}
								onChange={(e) => setIsPrivate(e.target.checked)}
								className='mr-2 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded'
							/>
							<span className='text-sm font-medium text-gray-600'>
								¿Es privado?
							</span>
						</label>
					</div>
					{/* Botón de enviar */}
					<div className='flex justify-center'>
						<button
							type='submit'
							className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
						>
							Crear Grupo
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateGroupPage;
