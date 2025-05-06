"use client"
import AdminLayOut from '@/component/adminLayOut/AdminLayOut'
import Team from '@/component/team/Team'
import React from 'react'
import { useAuth } from '../context/AuthContext'
import Product from '@/component/product/Product'

function pagee() {
  const {user}= useAuth();
  return (
    <AdminLayOut>
      {user.role=="Admin"?<Team/>:<Product/>}
    </AdminLayOut>
  )
}

export default pagee