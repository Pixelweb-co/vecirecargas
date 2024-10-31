// TransactionTable.tsx
'use client'

import { useState, useEffect } from 'react'

export default function TransactionTable() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await fetch('http://18.224.110.162:8000/api/transactions', {
          headers: { Authorization: token }
        })

        if (!response.ok) throw new Error('Failed to fetch transactions')

        const data = await response.json()

        setTransactions(data)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }

    fetchTransactions()
  }, [])

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full text-sm bg-white rounded-lg shadow-md'>
        <thead>
          <tr className='text-left border-b bg-gray-200'>
            <th className='px-4 py-2'>Transaction ID</th>
            <th className='px-4 py-2'>Mensaje</th>
            <th className='px-4 py-2'>Celular</th>
            <th className='px-4 py-2'>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className='border-b'>
              <td className='px-4 py-2'>{transaction.transactionalID}</td>
              <td className='px-4 py-2'>{transaction.message}</td>
              <td className='px-4 py-2'>{transaction.cellPhone}</td>
              <td className='px-4 py-2'>{transaction.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}