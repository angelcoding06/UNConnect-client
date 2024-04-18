import React from 'react';

function GroupCard({ group }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
      <img src={group.photo} alt={group.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
        <p className="text-gray-600">{group.description}</p>
        {/* Puedes agregar más detalles del grupo si lo necesitas */}
      </div>
    </div>
  );
}

export default GroupCard;

