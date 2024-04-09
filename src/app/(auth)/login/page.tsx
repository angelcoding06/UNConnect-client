'use client';
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
const cookies = new Cookies(null, { path: '/' });

const LOGIN = gql`
	mutation LoginAuthUser($email: String!, $password: String!) {
		loginAuthUser(email: $email, password: $password) {
			token
		}
	}
`;
const Login = () => {
	const [createAuthUser, { data, loading, error }] = useMutation(LOGIN);
	const router = useRouter();

	const dataloaded = data;
	console.log('DataLoaded: ', dataloaded?.loginAuthUser.token);
	const token = dataloaded?.loginAuthUser.token;
	if (token) {
		cookies.set('token', token);
		setTimeout(() => {
			router.push('/profile');
		}, 2000);
	}

	if (loading) console.log('Loading');
	if (error) return <p>Error: {error.message}</p>;

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		createAuthUser({ variables: { email: email, password: password } });
	};
	return (
		<div className='flex justify-center items-center h-screen bg-gray-100'>
			<div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full mx-4'>
				<h2 className='text-center text-2xl font-bold mb-6'>Iniciar sesión</h2>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label
							htmlFor='email'
							className='block text-gray-700 text-sm font-bold mb-2'
						>
							Correo electrónico:
						</label>
						<input
							type='email'
							id='email'
							name='email'
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							required
						/>
					</div>
					<div className='mb-6'>
						<label
							htmlFor='password'
							className='block text-gray-700 text-sm font-bold mb-2'
						>
							Contraseña:
						</label>
						<input
							type='password'
							id='password'
							name='password'
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							required
						/>
					</div>
					<button
						type='submit'
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					>
						Iniciar sesión
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
