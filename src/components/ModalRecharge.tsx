'use client'

// React Imports
import { useState } from 'react'

import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

interface ModalRechargeProps {
  open: boolean
  handleClose: () => void
  supplierId: { id: string; name: string }
}

interface RechargeFormData {
  cellPhone: string
  value: number
}

const ModalRecharge = ({ open, handleClose, supplierId }: ModalRechargeProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RechargeFormData>()

  const [submited, setSubmited] = useState(false)
  const [resultTransaction, setResultTransaction] = useState<any>(null)

  const handleRecharge: SubmitHandler<RechargeFormData> = async data => {
    try {
      const token = localStorage.getItem('token')

      if (!token) throw new Error('No se encontró el token en el localStorage')

      const response = await fetch('http://89.117.147.134:8000/api/recharge/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ cellPhone: data.cellPhone, value: Number(data.value), supplierId: supplierId.id })
      })

      if (!response.ok) throw new Error('Error en la recarga')

      const result = await response.json()

      console.log('Recarga exitosa:', result)
      setResultTransaction(result)
      setSubmited(true)
    } catch (error) {
      console.error('Error en la recarga:', error)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>Recarga Celular {supplierId.name}</DialogTitle>
      <DialogContent>
        {!submited && (
          <>
            <DialogContentText className='mbe-3'>
              Por favor, ingresa tu número de celular y el valor para recargar.
            </DialogContentText>

            <form onSubmit={handleSubmit(handleRecharge)}>
              <CustomTextField
                id='cellPhone'
                fullWidth
                type='text'
                label='Número de Celular'
                {...register('cellPhone', {
                  required: 'El número de celular es obligatorio',
                  pattern: {
                    value: /^3\d{9}$/,
                    message: 'El número de celular debe comenzar con 3 y tener 10 dígitos'
                  }
                })}
                error={!!errors.cellPhone}
                helperText={errors.cellPhone ? errors.cellPhone.message : ''}
              />

              <CustomTextField
                id='value'
                fullWidth
                type='number'
                label='Valor'
                {...register('value', {
                  required: 'El valor es obligatorio',
                  min: {
                    value: 1000,
                    message: 'El valor debe ser mayor a 1000'
                  },
                  max: {
                    value: 1000,
                    message: 'El valor debe ser mmenor a 10000'
                  }
                })}
                error={!!errors.value}
                helperText={errors.value ? errors.value.message : ''}
              />

              <DialogActions className='dialog-actions-dense'>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button type='submit' variant='contained' color='primary'>
                  Confirmar Recarga
                </Button>
              </DialogActions>
            </form>
          </>
        )}

        {submited && resultTransaction && (
          <div className='text-center'>
            <h2>Resultado de la transaccion</h2>
            <p>{resultTransaction.message}</p>
            <br />
            <p>
              <b>Id transacción:</b> {resultTransaction.transactionalID}
            </p>
            <p>
              <b>Numero de celular:</b> {resultTransaction.cellPhone}
            </p>
            <p>
              <b>Valor recarga:</b> ${resultTransaction.value}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ModalRecharge
