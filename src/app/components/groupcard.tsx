import React from 'react';
import Link from 'next/link';

function GroupCard({ group } : { group: any }) {
  return (
    <Link href={`/group/${group?.id}`} passHref>
      <div className="rounded-lg overflow-hidden shadow-md border border-green-200 bg-gray-800 flex flex-col justify-center items-center p-4 hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer">
        <div className='mb-4'>
          <img
            src={`http://localhost:8000/get-file?file_id=${group?.photo}`}
            alt='Foto de grupo'
            className='rounded-full w-48 h-48 object-cover'
          />
        </div>
        <div className="p-4 text-center">
          <h2 className="text-xl font-semibold mb-2 text-white">{group?.name}</h2>
          <p className="text-gray-400">{group?.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default GroupCard;
