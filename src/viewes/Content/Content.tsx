import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, message as messageAntd } from 'antd'
import './Content.css'
import { SearchButton } from '../../components/SearchButton'

interface IService {
  label: string
  code: string
  disabled: boolean
  justRequest: boolean
}

interface ICodeAndLabel {
  code: string
  label: string
}


function Content () {
  const [services, setServices] = useState<any[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [dataOptions, setDataOptions] = useState<any>()
  const [service, setService] = useState<string>(``)
  const [search, setSearch] = useState<string>(``)

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await axios.get('http://192.168.0.34:5000/services/list')
        if (!response.data.data) throw new Error('N consegui fazer a listagem')
        setServices(response.data.data)
      } catch(err: any) {
        const message = err.message
        if (message) console.log(message)
      }
    }
    getList()
  }, [])

  async function execServices (service: string) {
    try {
      const response = await axios.post('http://192.168.0.34:5000/services', { service })
      const message = response.data.message
      if (message) messageAntd.info({ content:message })
    } catch (err: any) {
      const message = err.message
      if (message) console.log(message)
    }
  }

  async function getOptions (service: string) {
    try {
      const response = await axios.get(`http://192.168.0.34:5000/services/options/?service=${service}`)
      setService(service)
      setDataOptions(response.data.data)
      setVisible(true)
    } catch (err: any) {
      const message = err.message
      if (message) console.log(message)
    }
  }

  async function execOption (service: string, code: string) {
    try {
      const response = await axios.post(`http://192.168.0.34:5000/services/options/exec?service=${service}&code=${code}`)
      console.log(response)
    } catch (err: any) {
      const message = err.message
      if (message) console.log(message)
    }
  }

  async function execOptionWithSearch (service: string, code: string, search: string) {
    const body = {
      service,
      code,
      search
    }
    try {
      const response = await axios.post(`http://192.168.0.34:5000/services/options/exec/search`, body)
      console.log(response)
    } catch (err: any) {
      const message = err.message
      if (message) console.log(message)
    }
  }

  return (
    <>
      { !visible && (
          services.map((service: IService) => {
              if (service.justRequest) return (
                <button 
                  className={`services-button${service.disabled ? ' button-disabled' : ''}`}
                  onClick={() => execServices(service.code)}
                  disabled={service.disabled}
                >
                  {service.label}
                </button>
              )
              return (
                <button 
                  className={`services-button${service.disabled ? ' button-disabled' : ''}`}
                  onClick={() => getOptions(service.code)}
                  disabled={service.disabled}
                >
                  {service.label}
                </button>
              )
            }
          )
        )
      }
      { visible && 
        (
          <>
            <h1 className='option-label' >{service}</h1>
            {
              dataOptions.map((option: ICodeAndLabel) => {
                if (option.code !== 'search') return (
                  <button 
                    className={`services-button`}
                    onClick={() => execOption(service, option.code)}
                  >
                    {option.label}
                  </button>
                )
                return (
                  <SearchButton
                    onChange={value => setSearch(value)}
                    onClick={() => {
                      execOptionWithSearch(service, option.code, search)
                      setVisible(prev => !prev)
                    }}
                  >
                    {option.label}
                  </SearchButton>
                )
              })
            }
            <Button
              className='services-button'
              onClick={() => setVisible(false)}
            >
              Return
            </Button>
          </>            
        )
      }
    </>
  )
}

export default Content
