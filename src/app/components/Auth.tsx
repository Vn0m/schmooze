'use client'

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;
const scope = 'user-read-email user-read-private';

// sends user to spotify login page
const Auth = () => {
  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Login with Spotify</h1>
        <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Login with Spotify
        </button>
      </div>
    </div>
  );
};

export default Auth;
