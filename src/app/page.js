'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  
  const [currentList, setCurrentList] = useState([]);
  const [subtotalOfList, setSubtotalOfList] = useState({});
  
  useEffect(() => {
    if(!localStorage.getItem('list')){
      localStorage.setItem('list', JSON.stringify([]));
    }
    
    const list = localStorage.getItem('list');
    
    setCurrentList(JSON.parse(list));
  }, []);
  
  function createList() {
    const newList = prompt("Digite o nome da nova lista:");
    if (newList) {
      const listDetails = {
        id: Math.random().toString(36).substr(2, 9),
        name: newList,
        createdAt: new Date(),
        products: []
      }

      const updatedList = [...currentList, listDetails];
      setCurrentList(updatedList);
      localStorage.setItem('list', JSON.stringify(updatedList));
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-1xl font-bold text-center bg-slate-200">Lista de Compras</h1>
      <div className="flex justify-center mt-5">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
          onClick={createList}
        >
          Criar Nova Lista
        </button>
      </div>

      {currentList.length <=0 && <p className="text-center mt-5">Você não possui listas</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {currentList.map((list, index) => (
          <div className="bg-white shadow-md rounded p-4 cursor-pointer" key={index} onClick={() => router.push(`/list/${list.id}`)}>
            <p className="text-xs text-gray-500">{new Date(list.createdAt).toLocaleString()}</p>
            <h2 className="text-lg font-bold">{list.name}</h2>
            <p className="text-sm text-gray-500">Produtos: {list.products.length}</p>
          </div>
        ))}
        </div>
    </div>
  );
}
