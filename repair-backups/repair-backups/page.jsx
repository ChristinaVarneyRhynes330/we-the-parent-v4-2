import { login } from './actions'

export default function LoginPage({ searchParams }) {
  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
      <form action={login}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input name="email" id="email" required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <input type="password" name="password" id="password" required style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white' }}>
          Log In
        </button>
        {searchParams?.message && (
          <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}