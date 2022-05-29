import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { message as messageAntd } from 'antd'
import OptionsModal from '../components/OptionsModal'

interface IService {
  label: string
  code: string
  disabled: boolean
  justRequest: boolean
}


function Content () {
  const [services, setServices] = useState<any[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [dataOptions, setDataOptions] = useState<any>()
  const [service, setService] = useState<string>(``)

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

  return (
    <>
      {/* <OptionsModal
        data={dataOptions}
        onCancel={() => setVisible(false)}
        service={service}
        visible={visible}
      /> */}
      {
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
      }
    </>
  )
}

export default Content
