'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { Button } from '@mui/material'

import ModalRecharge from '@/components/ModalRecharge'

export default function Page() {
  const [suppliers, setSuppliers] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [supplierSelect, setSupplierSelect] = useState(null)

  const handleOpenModal = item => {
    setSupplierSelect(item)

    setModalOpen(true)
  }

  const handleCloseModal = () => setModalOpen(false)

  useEffect(() => {
    const getSuppliers = async () => {
      try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token')

        if (!token) throw new Error('No se encontró el token en el localStorage')

        const response = await fetch('http://18.224.110.162:8000/api/recharge/suppliers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Error al obtener los proveedores')

        const data = await response.json()

        setSuppliers(data)
      } catch (error) {
        console.error('Error fetching suppliers:', error)
      }
    }

    getSuppliers()
  }, [])

  const getImage = (name: string) => {
    if (name === 'Movistar') {
      return '/images/suppliers/movistar.jpg'
    }

    if (name === 'Claro') {
      return '/images/suppliers/claro.jpg'
    }

    if (name === 'Tigo') {
      return '/images/suppliers/tigo.jpg'
    }

    if (name === 'wom') {
      return '/images/suppliers/wom.jpg'
    }
  }

  return (
    <>
      <h1>Recargar linea celular</h1>

      <div className='recharge flex'>
        {suppliers.length > 0 ? (
          suppliers.map((item, index) => (
            <div className='supplier py-2 border mx-2 text-center w-250' key={index}>
              <Image
                src={getImage(item.name)} // Reemplaza 'your-image.png' con el nombre de tu imagen
                alt='Descripción de la imagen'
                width={100}
                height={100}
                className='mb-4'
              />

              <h3>{item.name}</h3>
              <Button onClick={() => handleOpenModal(item)}>Recargar</Button>
            </div>
          ))
        ) : (
          <p>No hay proveedores disponibles.</p>
        )}
      </div>

      {supplierSelect && <ModalRecharge supplierId={supplierSelect} open={modalOpen} handleClose={handleCloseModal} />}
    </>
  )
}
