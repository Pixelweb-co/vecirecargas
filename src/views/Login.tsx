'use client'

import type { FC, FormEvent } from 'react'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

import CustomTextField from '@core/components/mui/TextField'
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

// Styled Components
interface LoginProps {
  mode: string // or replace `string` with a more specific type if needed
}

const LoginV2: FC<LoginProps> = ({ mode }) => {
  const router = useRouter()

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('http://89.117.147.134:8000/api/recharge/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const token = await response.text() // Recibimos el token en texto plano

        localStorage.setItem('token', token.replace('Bearer ', '')) // Guardamos el token en localStorage
        router.push('/home') // Redirigimos a /home
      } else {
        console.error('Error en el inicio de sesión')
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
    }
  }

  const handleClickShowPassword = () => setIsPasswordShown(!isPasswordShown)

  return (
    <div className='flex bs-full justify-center'>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>¡Bienvenido! 👋🏻</Typography>
            <Typography>Inicia sesión para continuar</Typography>
          </div>
          <form onSubmit={handleLogin} className='flex flex-col gap-5'>
            <CustomTextField
              autoFocus
              fullWidth
              label='Correo o Usuario'
              placeholder='Ingresa tu correo o usuario'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <CustomTextField
              fullWidth
              label='Contraseña'
              placeholder='············'
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <FormControlLabel control={<Checkbox />} label='Recuérdame' />
            <Button fullWidth variant='contained' type='submit'>
              Iniciar Sesión
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginV2
