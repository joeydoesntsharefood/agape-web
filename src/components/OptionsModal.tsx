import { Button, Modal } from 'antd'
import axios from 'axios'
import React, { useEffect } from 'react'

interface ILabelAndCode {
  label: string
  code: string
}

interface Props {
  visible: boolean
  onCancel: () => void
  data: ILabelAndCode[]
  service: string
}

function OptionsModal ({ visible, onCancel, data, service } : Props) {
  
  async function execOption (service: string, code: string) {
    try {
      const response = await axios.post(`http://192.168.0.34:5000/services/options/exec/?service=${service}?code=${code}`)
      console.log(response)
      onCancel()
    } catch (err: any) {
      if (err.message) console.log(err.message)
    }
  }
  
  return (
    <Modal
      visible={visible}
      onCancel={() => onCancel()}
      footer={null}
      title='Escolha a opcao'
    >
      {
        data.map((option: ILabelAndCode) => (
            <Button
              type='primary'
              onClick={() => execOption(service, option.code)}
            >
              {option.label}
            </Button>
          )
        )
      }
    </Modal>
  )
}

export default OptionsModal