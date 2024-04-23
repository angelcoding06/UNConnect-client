import { gql, useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
const GET_LIKES_BY_POST = gql`
	query getLikebyPost($PostId: String!, $page: Int!) {
		getLikebyPost(PostId: $PostId, page: $page) {
			currentPage
			totalPages
			totalCount
			items {
				Id
				type
				UserId
				PostId
			}
		}
	}
`;

const CREATE_LIKE = gql`
	mutation CreateLike($token: String!, $postId: String!, $type: String!) {
		createLike(token: $token, PostId: $postId, type: $type) {
			Id
			type
			UserId
			PostId
		}
	}
`;
const DELETE_LIKE = gql`
	mutation DeleteLike($token: String!, $postId: String!) {
		deleteLike(token: $token, PostId: $postId)
	}
`;
const UPDATE_LIKE = gql`
	mutation UpdateLike($token: String!, $postId: String!, $type: String!) {
		updateLike(token: $token, PostId: $postId, type: $type) {
			Id
			type
			UserId
			PostId
		}
	}
`;
const LikesComponent = ({
	postId,
	token,
}: {
	token: string;
	postId: string;
}) => {
	const { data, loading, error } = useQuery(GET_LIKES_BY_POST, {
		variables: { PostId: postId, page: 0 },
	});

	const [interactionType, setInteractionType] = useState<
		'LIKE' | 'DISLIKE' | null
	>(null);

	const [createLikeMutation] = useMutation(CREATE_LIKE);
	const [deleteLikeMutation] = useMutation(DELETE_LIKE);
	const [updateLikeMutation] = useMutation(UPDATE_LIKE);

	const handleLike = async (type: 'LIKE' | 'DISLIKE') => {
		try {
			if (interactionType === null) {
				await createLikeMutation({ variables: { token, postId, type } });
				setInteractionType(type);
			} else {
				await updateLikeMutation({ variables: { token, postId, type } });
				setInteractionType(type);
			}
		} catch (error : any) {
			alert(error.message );
		}
	};

	const handleRemoveInteraction = async () => {
		try {
			await deleteLikeMutation({ variables: { token, postId } });
			setInteractionType(null); // Reset interaction type after removal
		} catch (error) {
			alert('Error removing interaction');
		}
	};

	if (loading) return <p>Loading likes...</p>;
	// if (error) return <p>Error: {error.message}</p>;

	return (
		<div className='border border-gray-300 p-4 rounded-lg'>
			<p className='mb-2'>
				Interacciones: {data?.getLikebyPost?.totalCount || 0}
			</p>
			<button
				className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
				onClick={() => handleLike('LIKE')}
			>
				Like
			</button>
			<button
				className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
				onClick={() => handleLike('DISLIKE')}
			>
				Dislike
			</button>
			<button
				className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
				onClick={handleRemoveInteraction}
			>
				Remove Like
			</button>
			<button
				className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
				onClick={handleRemoveInteraction}
			>
				Remove Dislike
			</button>
		</div>
	);
};

export default LikesComponent;
