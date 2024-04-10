/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_MY_POSTS = gql`
	query getMyPosts($token: String!, $page: Int!) {
		getMyPosts(token: $token, page: $page) {
			currentPage
			totalPages
			totalCount
			items {
				Id
				Content
				Media
			}
		}
	}
`;

const DELETE_POST = gql`
	mutation deletePost($token: String!, $PostId: String!) {
		deletePost(token: $token, PostId: $PostId)
	}
`;
const UPDATE_POST = gql`
	mutation updatePost($token: String!, $PostId: String!, $Content: String!) {
		updatePost(token: $token, PostId: $PostId, Content: $Content) {
			Id
			Content
			Media
		}
	}
`;

const MyPosts = ({ token }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState('');
	const [page, setPage] = useState(1);
	const [showFullText, setShowFullText] = useState(false);
	
	const [editedContent, setEditedContent] = useState('');
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [postIdToEdit, setPostIdToEdit] = useState(null);
	const [updatePostMutation] = useMutation(UPDATE_POST);
	const [deletePostMutation] = useMutation(DELETE_POST);
	const { loading, error, data, fetchMore } = useQuery(GET_MY_POSTS, {
		variables: { token, page },
	});


	const handleEditPost = async () => {
		try {
			await updatePostMutation({
				variables: { token, PostId: postIdToEdit, Content: editedContent },
			});
			fetchMore({
				variables: { token, page: 1 },
			});
			setIsEditModalOpen(false);
		} catch (error) {
			console.error('Error updating post:', error);
		}
	};


	const handleDeletePost = async (PostId:string) => {
		try {
			await deletePostMutation({
				variables: { token, PostId },
			});
			fetchMore({
				variables: { token, page: 1 },
			});
		} catch (error) {
			console.error('Error deleting post:', error);
		}
	};

	const handleLoadMore = () => {
		if (page + 1 <= data.getMyPosts.totalPages) {
			fetchMore({
				variables: { token, page: page + 1 },
				updateQuery: (prev, { fetchMoreResult }) => {
					if (!fetchMoreResult) return prev;
					return {
						getMyPosts: {
							...fetchMoreResult.getMyPosts,
							items: [
								...prev.getMyPosts.items,
								...fetchMoreResult.getMyPosts.items,
							],
						},
					};
				},
			});
			setPage(page + 1);
		}
	};

	return (
		<div className='container mx-auto mt-8 px-24'>
			<h2 className='text-xl font-semibold mb-4'>My Posts</h2>
			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<p>Error: {error.message}</p>
			) : (
				<div className='grid grid-cols-3 gap-4'>
					{data.getMyPosts.items.map((post) => (
						<div key={post.Id} className='bg-white shadow-md rounded-lg'>
							<div className='p-4'>
								<div>
									<p className='mb-2'>{post.Content.slice(0, 125)}</p>
									{post.Content.length > 125 && !showFullText && (
										<button
											onClick={() => setShowFullText(true)}
											className='text-blue-500 hover:underline focus:outline-none'
										>
											Ver más
										</button>
									)}
									{showFullText || post.Content.length <= 125 ? (
										<div>
											<p>{post.Content.slice(125, -1)}</p>
											{showFullText && post.Content.length >= 125 ? (
												<button
													onClick={() => setShowFullText(false)}
													className='text-blue-500 hover:underline focus:outline-none'
												>
													Ver menos
												</button>
											) : null}
										</div>
									) : null}
								</div>
								<div className='grid grid-cols-2 gap-4'>
									{post.Media.length > 0 &&
										post.Media.map((mediaId:string) => (
											<img
												key={mediaId}
												src={`http://localhost:8000/get-file?file_id=${mediaId}`}
												alt='Media'
												className='w-full rounded-lg cursor-pointer'
												style={{
													maxWidth: '200px',
													maxHeight: '200px',
													objectFit: 'cover',
												}}
												onClick={() => {
													setSelectedImage(
														`http://localhost:8000/get-file?file_id=${mediaId}`
													);
													setIsModalOpen(true);
												}}
											/>
										))}
									{isModalOpen && (
										<div className='fixed inset-0 z-50 flex items-center justify-center'>
											<div
												className='fixed inset-0 bg-black opacity-20'
												onClick={() => setIsModalOpen(false)}
											></div>
											<img
												src={selectedImage}
												alt='Selected Media'
												className='max-w-screen-xl max-h-screen'
											/>
										</div>
									)}
								</div>
							</div>
							<div className='flex justify-end p-4'>
								<button
									onClick={() => {
										setEditedContent(post.Content);
										setPostIdToEdit(post.Id);
										setIsEditModalOpen(true);
									}}
									className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
								>
									Edit
								</button>
								<button
									onClick={() => handleDeletePost(post.Id)}
									className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
								>
									Delete
								</button>
							</div>
						</div>
					))}
					{isEditModalOpen && (
						<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
							<div className='bg-white p-8 rounded-lg w-96'>
								<textarea
									value={editedContent}
									onChange={(e) => setEditedContent(e.target.value)}
									className='border p-2 mb-4 w-full h-40 resize-none'
								/>
								<div className='flex justify-end'>
									<button
										onClick={() => setIsEditModalOpen(false)}
										className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2'
									>
										Cancel
									</button>
									<button
										onClick={handleEditPost}
										className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
									>
										Confirm
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
			<button
				onClick={handleLoadMore}
				className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'
			>
				Load More
			</button>
		</div>
	);
};

export default MyPosts;
