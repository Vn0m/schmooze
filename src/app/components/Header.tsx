'use client';

interface HeaderProps {
    userProfile: {
      images?: { profileUrl: string };
      name?: string;
    };
}

const Header = ({ userProfile }: HeaderProps) => {
    return(
        <div className="relative bg-[url('/header.jpg')] bg-cover w-full h-60 bg-center">
            <div className="absolute left-4 top-24 flex items-center space-x-4">
                <img src={userProfile?.images?.profileUrl || '/pfp.jpg'} alt="User Profile" className="w-32 h-32 rounded-full" />
                <div className="flex flex-col">
                <p className="text-[#C7C7C7]">Dashboard</p>
                <h1 className="text-white font-semibold text-[35px]">{userProfile?.name || 'Anonymous'}</h1>
                <p className="text-[#C7C7C7] text-[12px]">3 Public Playlists • 13 followers • 19 following</p>
                </div>
            </div>
        </div>
    )
};

export default Header;