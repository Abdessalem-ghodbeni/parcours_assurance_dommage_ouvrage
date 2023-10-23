import React from 'react'
import svg from '../../assets/notfound.svg'
function NotFound() {
  return (
    <div className="notfound">
        {" "}
        <img src={svg} alt="404" height={925} width={925} />{" "}
      </div>
  )
}

export default NotFound