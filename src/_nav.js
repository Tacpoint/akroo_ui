import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Marketplace',
  },
  {
    component: CNavItem,
    name: 'Borrow',
    to: '/requestloan',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Lend',
    to: '/buttons',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'renBTC Deposit',
        to: '/rbtcdeposit',
      },
      {
        component: CNavItem,
        name: 'WBTC Deposit',
        to: '/wbtcdeposit',
      },
      {
        component: CNavItem,
        name: 'Pub Keys / Secrets',
        to: '/buttons/buttons',
      },
      {
        component: CNavItem,
        name: 'Withdrawl',
        to: '/buttons/buttons',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'My Loans',
    to: '/charts',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
]

export default _nav
