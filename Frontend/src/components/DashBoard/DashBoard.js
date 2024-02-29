import React from 'react'

const DashBoard = () => {
  const tokenCookie = document.cookie;
  console.log(tokenCookie);
  return (
    <div>
      <div className="container">
        Hello World
      </div>
    </div>
  )
}

export default DashBoard