import { Button, Input } from 'antd'
import React, { useState } from 'react'

interface Props {
  onChange: (value: string) => void
  onClick: (status: boolean) => void
  children: string
}

function SearchButton ({ onChange, onClick, children } : Props ) {
  const [visible, setVisible] = useState<boolean>(false)
  return (
    <>
      { visible &&
        (
          <>
            <Input onChange={change => onChange(change.target.value)} />
            <Button
              onClick={() => {onClick(true)}}
            >
              Pesquisar
            </Button>
          </>  
        )
      }
      { !visible &&
        (
          <Button
            onClick={() => setVisible(prev => !prev)}
          >
            {children}
          </Button>
        )
      }
    </>
  )
}

export { SearchButton }