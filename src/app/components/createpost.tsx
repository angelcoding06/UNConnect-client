'use client';
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });
const CREATE_POST = gql`
	mutation createPost($token: String!, $Content: String!, $Media: [String!]) {
		createPost(token: $token, Content: $Content, Media: $Media) {
			Id
			Content
			Media
			GroupId
			UserId
		}
	}
`;

const CreatePost = () => {
	const Token = cookies.get('token');
	const [createPostMutation, { data, loading, error }] =
		useMutation(CREATE_POST);

	const [content, setContent] = useState('');
	const [mediaFiles, setMediaFiles] = useState<File[]>([]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		let ids: string[] = [];
		if (mediaFiles.length > 0) {
			const formData = new FormData();
			for (let i = 0; i < mediaFiles.length; i++) {
				formData.append('files', mediaFiles[i]);
			}

			try {
				const response = await fetch(
					`http://localhost:81/upload-file/?token=${Token}`,
					{
						method: 'POST',
						body: formData,
					}
				);
				const data = await response.json();
				console.log('Response:', data);

				if (response.ok) {
					ids = data.ids;
				} else {
					console.error('Error uploading file:', data.message);
				}
			} catch (error) {
				console.error('Error uploading file:', error);
			}
		}

		try {
			await createPostMutation({
				variables: { token: Token, Content: content, Media: ids },
			});

			setContent('');
			setMediaFiles([]);
		} catch (error) {
			console.error('Error creating post:', error);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			setMediaFiles([...mediaFiles, ...Array.from(files)]);
		}
	};

	return (
		<div className='container mx-auto mt-8 px-24'>
			<h2 className='text-xl font-semibold mb-4'>Crear una publicación</h2>
			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<label htmlFor='content' className='block font-medium mb-1'>
						Contenido:
					</label>
					<textarea
						id='content'
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
					/>
				</div>
				<div className='mb-4'>
					<label htmlFor='file' className='block font-medium mb-1'>
						Multimedia
					</label>
					<input
						type='file'
						multiple
						id='file'
						onChange={handleFileChange}
						className='w-full'
					/>
				</div>
				<button
					type='submit'
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
				>
					Create Post
				</button>
			</form>
		</div>
	);
};

export default CreatePost;
