import 'server-only'
import { cookies } from 'next/headers'
 
export async function deleteSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    return true
  } catch (error) {
    console.error('Failed to delete session cookie:', error)
    return false
  }
}