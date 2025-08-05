import React from 'react'

const UserInfo = ({ user }) => {
    console.log(user.picture);
    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {user.picture ? (
                    <img
                        src={user.picture}
                        onError={(e) => { e.target.src = './assets/react.png'; }}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md object-cover"
                    />
                ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse" />
                )}
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    {user.nickname && (
                        <p className="text-gray-400 text-sm mt-1">
                            Username: <span className="font-medium">{user.nickname}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserInfo
