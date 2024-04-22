import React from 'react';

function GroupCard({ group }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md border border-green-200 bg-blue-300">
      <div className=''>
					<img
						src={`http://localhost:8000/get-file?file_id=${group.photo}`}
						alt='Foto de grupo'
						className='rounded-lg max-w-80'
					/>
			</div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
        <p className="text-gray-600">{group.description}</p>
      </div>
    </div>
  );
}

export default GroupCard;

