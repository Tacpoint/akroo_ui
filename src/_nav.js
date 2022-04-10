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
        name: 'renBTC',
        to: '/rbtcdeposit',
      },
      {
        component: CNavItem,
        name: 'WBTC',
        to: '/wbtcdeposit',
      },
      {
        component: CNavItem,
        name: 'Pub Keys / Secrets',
        to: '/pubkeys',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'My Loans',
    to: '/loans',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
]

export default _nav
