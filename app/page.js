// app/page.js
import Assistant from './assistant/pages'; // correct import path
import './assistant/assistant.css';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome to We The Parent v4</h1>
      <p>The build is successful!</p>
      <p>Now we can begin setting up the login system.</p>

      {/* Assistant component */}
      <div style={{ marginTop: '3rem', border: '1px solid #ccc', padding: '1rem' }}>
        <Assistant />
      </div>
    </main>
  );
}

