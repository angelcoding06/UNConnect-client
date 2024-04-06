'use client';
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Logo from '../../../public/logo.jpeg';

import Image from 'next/image';
const LandingPage = () => {
	return (
		<div className='bg-gray-100 min-h-screen flex flex-col'>
			<header className='bg-white shadow-md p-4 flex justify-between items-center'>
				<h1 className='text-2xl font-bold'>Unconnect</h1>
				<nav>
					<a
						href='#features'
						className='text-gray-700 hover:text-blue-500 mr-4'
					>
						Características
					</a>
					<a href='#about' className='text-gray-700 hover:text-blue-500 mr-4'>
						Acerca de
					</a>
					<a
						href='/login'
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					>
						Iniciar sesión
					</a>
					<a
						href='/register'
						className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4'
					>
						Registrarse
					</a>
				</nav>
			</header>
			<section className='bg-white p-8 flex items-center h-full px-'>
				<div className='w-1/2'>
					<Image src={Logo} alt='Logo' width={500} />
				</div>
				<div>
					<h1 className='text-4xl font-bold mb-4'>UNconnect</h1>
					<p className='text-lg mb-8'>
						¡Conéctate con tus compañeros y comparte experiencias!
					</p>
					<a
						href='/login'
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					>
						Iniciar sesión
					</a>
					<a
						href='/register'
						className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4'
					>
						Registrarse
					</a>
				</div>
			</section>
			<div className='flex-1 overflow-y-auto'>
				<section className='bg-white p-8 flex items-center'>
					<div className='flex-1'>
						<h2 className='text-3xl font-bold mb-4'>Conecta con tus amigos</h2>
						<p className='text-lg mb-8'>
							Encuentra a tus amigos de la universidad y mantente en contacto
							con ellos.
						</p>
					</div>
					<div className='w-1/2'>
						<img
							src='https://via.placeholder.com/400'
							alt='Conecta con tus amigos'
							className='rounded-lg'
						/>
					</div>
				</section>
				<section className='bg-gray-200 p-8 flex items-center'>
					<div className='w-1/2'>
						<img
							src='https://via.placeholder.com/400'
							alt='Cuenta tus anécdotas académicas'
							className='rounded-lg'
						/>
					</div>
					<div className='flex-1'>
						<h2 className='text-3xl font-bold mb-4'>
							Cuenta tus anécdotas académicas
						</h2>
						<p className='text-lg mb-8'>
							Comparte tus experiencias divertidas o interesantes en la
							universidad con otros estudiantes.
						</p>
					</div>
				</section>
				<section className='bg-white p-8 flex items-center'>
					<div className='flex-1'>
						<h2 className='text-3xl font-bold mb-4'>Recomienda profesores</h2>
						<p className='text-lg mb-8'>
							Califica y comparte tus opiniones sobre los profesores de la
							universidad para ayudar a otros estudiantes a elegir.
						</p>
					</div>
					<div className='w-1/2'>
						<img
							src='https://via.placeholder.com/400'
							alt='Recomienda profesores'
							className='rounded-lg'
						/>
					</div>
				</section>
				<section className='bg-gray-200 p-8 flex items-center'>
					<div className='w-1/2'>
						<img
							src='https://via.placeholder.com/400'
							alt='Solicita apoyo académico'
							className='rounded-lg'
						/>
					</div>
					<div className='flex-1'>
						<h2 className='text-3xl font-bold mb-4'>
							Solicita apoyo académico
						</h2>
						<p className='text-lg mb-8'>
							Pide ayuda con tus estudios y trabajos académicos a otros
							estudiantes o profesores.
						</p>
					</div>
				</section>
			</div>
			<footer className='bg-white shadow-md p-4 text-center'>
				<p className='text-gray-700'>
					© 2024 Unconnect. Todos los derechos reservados.
				</p>
			</footer>
		</div>
	);
};

export default LandingPage;
