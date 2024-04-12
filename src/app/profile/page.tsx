/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import CreatePost from '../components/createpost';
import MyPosts from '@/app/components/myposts';
import Header from '../components/header';
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

const ProfilePage = () => {
	const router = useRouter();
	const token = cookies.get('token');
	if (!token) {
		setTimeout(() => {
			router.replace('/login');
		}, 2000);
	}
	const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
		variables: { token: token },
	});
	const [isEditing, setIsEditing] = useState(false);
	const [
		updateProfile,
		{ data: mutationData, loading: mutationLoading, error: mutationError },
	] = useMutation(UPDATE_PROFILE);

	if (loading) {
		return <div>Cargando...</div>;
	}
	if (error) console.log('Error: ', error);
	if (mutationError) console.log('mutationError: ', mutationError);
	const user = data.getUserByAuthId;

	const handleCancelEdit = () => {
		setIsEditing(false);
	};

	const handlePhotoChange = async (e: any) => {
		const file = e.target.files;
		const formData = new FormData();

		for (let i = 0; i < file.length; i++) {
			formData.append('files', file[i]);
		}

		try {
			const response = await fetch(
				`http://localhost:8000/upload-file/?token=${token}`,
				{
					method: 'POST',
					body: formData,
				}
			);
			const data = await response.json();
			console.log('Response:', data);

			if (response.ok) {
				if (user.ProfilePhoto != '') {
					await fetch(
						`http://localhost:8000/delete-file?file_id=${user.ProfilePhoto}&token=${token}`,
						{
							method: 'DELETE',
						}
					);
				}

				await updateProfile({
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
						myGroups: user.myGroups,
						ProfilePhoto: data.ids[0],
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

	const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const Name = formData.get('Name') as string;
		const LastName = formData.get('LastName') as string;
		const Birthday = formData.get('Birthday');
		const Campus = formData.get('Campus') as string;
		const Faculty = formData.get('Faculty') as string;
		const Career = formData.get('Career') as string;
		const Gender = formData.get('Gender') as string;
		const MemberUNSince = formData.get('MemberUNSince') as string;
		const MemberUNSinceInt = MemberUNSince ? parseInt(MemberUNSince, 10) : 0;
		const PhoneNumber = formData.get('PhoneNumber') as string;

		await updateProfile({
			variables: {
				token: token,
				Name: Name,
				LastName: LastName,
				Birthday: Birthday,
				Campus: Campus,
				Faculty: Faculty,
				Career: Career,
				MemberUNSince: MemberUNSinceInt,
				PhoneNumber: PhoneNumber,
				Gender: Gender,
				ProfilePhoto: user.ProfilePhoto,
				myGroups: user.myGroups,
			},
		});
		setIsEditing(false);
		refetch();
	};

	if (mutationLoading) {
		return <div>Cargando mutacion...</div>;
	}

	return (
		<div className='container mx-auto mt-8 px-24'>
			<Header />
			<h1 className='text-3xl font-bold mb-4'>Perfil</h1>
			<div className='grid grid-cols-3 md:grid-cols-2 gap-8'>
				<div className='bg-white shadow-md p-4 rounded-lg '>
					<h2 className='text-xl font-bold mb-2'>Información personal</h2>
					{isEditing ? (
						<form className='space-y-4 space-x-0' onSubmit={handleSaveChanges}>
							<input
								type='text'
								name='Name'
								placeholder='Nombre'
								defaultValue={user.Name}
							/>
							<input
								type='text'
								name='LastName'
								placeholder='Apellido'
								defaultValue={user.LastName}
							/>
							<input type='date' name='Birthday' defaultValue={user.Birthday} />
							<input
								type='text'
								name='Campus'
								placeholder='Sede'
								defaultValue={user.Campus}
							/>
							<input
								type='text'
								name='Career'
								placeholder='Carrera'
								defaultValue={user.Career}
							/>
							<input
								type='text'
								name='Faculty'
								placeholder='Facultad'
								defaultValue={user.Faculty}
							/>
							<input
								type='text'
								name='Gender'
								placeholder='Genero'
								defaultValue={user.Gender}
							/>
							<input
								type='number'
								name='MemberUNSince'
								defaultValue={user.MemberUNSince}
							/>
							<input
								type='tel'
								name='PhoneNumber'
								defaultValue={user.PhoneNumber}
								placeholder='+573013055820'
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
							<p>
								<span className='font-bold'>Nombre:</span>
								{user.Name}
							</p>
							<p>
								<span className='font-bold'>Apellido:</span>
								{user.LastName}
							</p>
							<p>
								<span className='font-bold'>Fecha de nacimiento:</span>
								{user.Birthday}
							</p>
							<p>
								<span className='font-bold'>Campus:</span>
								{user.Campus}
							</p>
							<p>
								<span className='font-bold'>Carrera:</span>
								{user.Career}
							</p>
							<p>
								<span className='font-bold'>Facultad:</span>
								{user.Faculty}
							</p>
							<p>
								<span className='font-bold'>Genero:</span>
								{user.Gender}
							</p>
							<p>
								<span className='font-bold'>Miembro de la UN desde:</span>
								{user.MemberUNSince}
							</p>
							<p>
								<span className='font-bold'>Número de teléfono:</span>
								{user.PhoneNumber}
							</p>
							<div>
								<button
									type='button'
									className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
									onClick={() => setIsEditing(true)}
								>
									Editar perfil
								</button>
							</div>
						</>
					)}
				</div>
				<div className='bg-white shadow-md p-4 rounded-lg'>
					<h2 className='text-xl font-bold mb-2'>Foto de perfil</h2>
					<img
						src={`http://localhost:8000/get-file?file_id=${user.ProfilePhoto}`}
						alt='Foto de perfil'
						className='rounded-lg max-w-80'
					/>
					<input type='file' onChange={handlePhotoChange} />
				</div>
			</div>
			<h1 className='text-3xl font-bold mb-4'>Creación de publicaciones</h1>
			<CreatePost />
			<MyPosts token={token}/>
		</div>
	);
};

export default ProfilePage;
