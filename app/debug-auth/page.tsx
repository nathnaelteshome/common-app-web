"use client"

import { useEffect, useState } from 'react'
import { authService } from '@/lib/auth-service'

export default function DebugAuthPage() {
  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const [cookieToken, setCookieToken] = useState<string>('')

  useEffect(() => {
    // Get token from cookie
    const cookies = document.cookie.split(';')
    console.log('All cookies:', cookies)
    const authCookie = cookies.find(c => c.trim().startsWith('auth_token='))
    console.log('Auth cookie found:', authCookie)
    const token = authCookie ? authCookie.split('=')[1] : ''
    console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'none')
    setCookieToken(token)

    // Try to decode JWT
    if (token && token.includes('.')) {
      try {
        const parts = token.split('.')
        if (parts.length === 3) {
          const payload = parts[1]
          const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)
          const decodedPayload = JSON.parse(atob(paddedPayload))
          setTokenInfo(decodedPayload)
        }
      } catch (error) {
        console.error('Failed to decode token:', error)
        setTokenInfo({ error: error.message })
      }
    }
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Information</h1>
      
      <div className="space-y-6">
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Authentication Status</h2>
          <p>Is Authenticated: {authService.isAuthenticated() ? 'YES' : 'NO'}</p>
          <p>Is Student: {authService.isStudent() ? 'YES' : 'NO'}</p>
          <p>Is University: {authService.isUniversity() ? 'YES' : 'NO'}</p>
          <p>Is Admin: {authService.isAdmin() ? 'YES' : 'NO'}</p>
          <p>Current Role: {authService.getCurrentUserRole() || 'NONE'}</p>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Token from Cookie</h2>
          <p className="text-xs break-all bg-gray-100 p-2 rounded">
            {cookieToken || 'No token found'}
          </p>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Decoded JWT Payload</h2>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {tokenInfo ? JSON.stringify(tokenInfo, null, 2) : 'No token to decode'}
          </pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Local Storage</h2>
          <p>Current User: {typeof window !== 'undefined' ? (localStorage.getItem('current_user') || 'Not found') : 'SSR - Not Available'}</p>
          <p>Access Token: {typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || 'Not found') : 'SSR - Not Available'}</p>
          <p>Refresh Token: {typeof window !== 'undefined' ? (localStorage.getItem('refreshToken') || 'Not found') : 'SSR - Not Available'}</p>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">API Client Token Check</h2>
          <button 
            onClick={() => {
              import('@/lib/api/client').then(({ api }) => {
                const tokens = api.getTokens()
                alert(`API Client Tokens:\nAccess: ${tokens.accessToken || 'None'}\nRefresh: ${tokens.refreshToken || 'None'}`)
              })
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Check API Client Tokens
          </button>
          
          <button 
            onClick={async () => {
              try {
                const result = await authService.signIn({
                  email: 'student@test.com',
                  password: 'Student123'
                })
                alert(`Login successful! Role: ${result.user.role}`)
                window.location.reload()
              } catch (error) {
                alert(`Login failed: ${error.message}`)
              }
            }}
            className="bg-green-500 text-white px-4 py-2 rounded ml-2"
          >
            Test Login
          </button>
        </div>
      </div>
    </div>
  )
}