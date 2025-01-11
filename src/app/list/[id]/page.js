"use client";

import { useRouter, useParams  } from 'next/navigation'
import { useEffect, useState } from 'react';
 
export default function Page({}) {
  const router = useRouter()
  const {id} = useParams();

  const [currentList, setCurrentList] = useState(null);
  const [totals, setTotals] = useState({qtd: 0, subtotal: 0});

  if(!id){
    return router.push('/');
  }

  useEffect(() => {
    const list = localStorage.getItem('list');
    
    const listDetails = JSON.parse(list).find(list => list.id === id);
    if(!listDetails){
      return router.push('/');
    }

    setCurrentList(listDetails);
  }, []);
  
  function quantityManager({target}, type) {
    if(type == -1){
      const input = target.closest('.qtd-area').querySelector('input');
      if(input.value > 1){
        input.value = parseInt(input.value) - 1;
      }
    }

    if(type == 1){
      const input = target.closest('.qtd-area').querySelector('input');
      input.value = parseInt(input.value) + 1;
    }
  }

  function saveProduct(e) {
    e.preventDefault();

    const form = e.target;
    const inputs = form.querySelectorAll('input');

    if(!inputs[0].value || !inputs[1].value || !inputs[2].value){
      return alert('Preencha todos os campos');
    }

    const product = {
      id: Math.random().toString(36).substr(2, 9),
      name: inputs[0].value,
      qtd: parseInt(inputs[1].value),
      price: parseFloat(inputs[2].value.replace(",", "."))
    }

    currentList.products.push(product);
    currentList.products.reverse();
    setCurrentList(currentList);
  
    //busca index e atualiza
    const list = JSON.parse(localStorage.getItem('list'));
    const index = list.findIndex(list => list.id === currentList.id);
    list[index] = currentList;
    localStorage.setItem('list', JSON.stringify(list));

    updateTotals();

    // Reset form
    inputs[0].value = '';
    inputs[1].value = 1;
    inputs[2].value = '';
  }

  function deleteProduct(id) {
    const findProduct = currentList.products.findIndex(product => product.id === id);
    currentList.products.splice(findProduct, 1);
    console.log(currentList)
    currentList.products.reverse();
    setCurrentList(currentList);

    //busca index e atualiza
    const list = JSON.parse(localStorage.getItem('list'));
    const index = list.findIndex(list => list.id === currentList.id);
    list[index] = currentList;
    localStorage.setItem('list', JSON.stringify(list));

    

    updateTotals();
    
  }

  function updateTotals(){
    let qtd = 0;
    let subtotal = 0;

    currentList.products.forEach(product => {
      qtd += product.qtd;
      subtotal += product.price * product.qtd;
    });

    setTotals({qtd, subtotal});
  }

  function ListProducts(){
    console.log(currentList)
    if (!currentList || !currentList.products) {
      return (<p className="text-center mt-5">Carregando...</p>)
    }

    return (
      <>
        {currentList.products.length >0 && <h2 className="text-1xl font-bold text-center mb-2">Produtos</h2>}
        {currentList.products.map((product, index) => (
          <li className="p-2 mb-2 shadow-md bg-white" key={index} data-product-id={product.id}>
          <div className="flex items-center justify-between gap-1 leading-none">
          <span className="flex-1">{product.name}</span>
           
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">{product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' })}</span>
            <span className="text-xs text-gray-500">Quantidade: {product.qtd}</span>
            <span className="text-xs text-gray-500">{(product.price * product.qtd).toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' })}</span>

            <button type='button' className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteProduct(product.id)}>Remover</button>
          </div>
        </li>
        ))}
      </>
    )
  }

  function Loading(){
    return (
      <p className="text-center mt-5">Carregando...</p>
    )
  }


  return (
    
    <div className="container mx-auto container-height">
      {currentList === null && <Loading />}


      {currentList && (
        <>
          <h1 className="text-1xl font-bold text-center bg-slate-200">
            <button className="text-blue-500 hover:text-blue-700 absolute left-3" onClick={() => router.push('/')}>
              {'<'} Voltar
            </button>
            {currentList && currentList.name}
          </h1>

          <form className="p-2 mt-2 mb-2 border mb-2 bg-white" onSubmit={(e) => saveProduct(e)}>
            <div className="flex items-center justify-between gap-1 leading-none">
              <input type="text" name='name' className="flex-1 p-1 border rounded" placeholder="Nome do produto" />
              
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="qtd-area">
                <button type='button' onClick={(e) => quantityManager(e, -1)}>-</button>
                <input readOnly type="number" name='qtd' min="1" className="w-16 p-1 border rounded text-center" placeholder="Qtd" value={1} />
                <button type='button' onClick={(e) => quantityManager(e, +1)}>+</button>
              </div>
              
              <div className="price-area">
                <span className="cifra">R$</span>
                <input type="text" name='price' min="1" className="w-16 p-1 border rounded border-left" placeholder="" />
              </div>

              <button type='submit' className="bg-green-500 text-white px-2 py-1 rounded">Salvar</button>

            </div>
          </form>

          <ul className="p2 mt-2 mb-1 shadow-md">
            {currentList && <ListProducts />}
          </ul>

          <div className="bars-mobile fixed bottom-0 left-0 right-0 p-2 bg-white shadow-md">
            <div className="bar flex items-center justify-between gap-1 leading-none">
              <span className="text-xs text-gray-500 text-xl">Produtos: {totals.qtd}</span>
              <span className="text-xs text-gray-500 text-xl">Subtotal: {totals.subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
        </>
      )}

    </div>
  )
}