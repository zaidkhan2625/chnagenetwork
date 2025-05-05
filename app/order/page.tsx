import AdminLayOut from '@/component/adminLayOut/AdminLayOut'
import Order from '@/component/order/Order'
import React from 'react'

function page() {
  return (
    <AdminLayOut>
       <Order/>
    </AdminLayOut>
  )
}

export default page