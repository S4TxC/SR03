const SideBar = ({ connectedUsers = [], currentUser, getUserStatus }) => {
    const getStatusColor = (isConnected) => {
        return isConnected ? 'bg-green-400' : 'bg-gray-400';
    };

    const getStatusIcon = (isConnected) => {
        return isConnected ? '●' : '○';
    };

    return (
        <div className="w-80 bg-white bg-opacity-20 border-l-4 border-black h-full">
            <div className="bg-blue-600 px-4 py-4 border-b-4 border-black">
                <div className="flex items-center justify-between">
                    <h3
                        className="text-white font-bold"
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.9em'
                        }}
                    >
                        Online Users
                    </h3>
                    <div
                        className="bg-white bg-opacity-20 px-2 py-1 border-2 border-black text-white font-bold"
                        style={{
                            borderRadius: '0',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.7em'
                        }}
                    >
                        {connectedUsers.length}
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-120px)] p-4">
                {connectedUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <div
                            className="w-12 h-12 bg-gray-400 border-2 border-black flex items-center justify-center mb-3"
                            style={{ borderRadius: '0' }}
                        >
                            <span
                                className="text-white font-bold text-lg"
                                style={{ fontFamily: "'Press Start 2P', cursive" }}
                            >
                                ?
                            </span>
                        </div>
                        <p
                            className="text-center font-bold"
                            style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '0.7em'
                            }}
                        >
                            No users online
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {connectedUsers.map((username, index) => {
                            const isCurrentUser = username === (currentUser?.firstname || 'Guest');
                            const status = isCurrentUser ? true : (getUserStatus ? getUserStatus(username) : true);

                            return (
                                <div
                                    key={index}
                                    className={`
                                        p-3 border-2 border-black transition-all duration-200 hover:shadow-lg
                                        ${isCurrentUser
                                        ? 'bg-blue-100 border-blue-600'
                                        : 'bg-white hover:bg-gray-50'
                                    }
                                    `}
                                    style={{ borderRadius: '0' }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 relative">
                                            {isCurrentUser && currentUser?.avatarUrl ? (
                                                <img
                                                    src={`http://localhost:8080${currentUser.avatarUrl}`}
                                                    alt={`${username}'s avatar`}
                                                    className="w-10 h-10 object-cover border-2 border-black"
                                                    style={{ borderRadius: '0', imageRendering: 'pixelated' }}
                                                />
                                            ) : (
                                                <div
                                                    className={`
                                                        w-10 h-10 border-2 border-black flex items-center justify-center text-white font-bold
                                                        ${isCurrentUser ? 'bg-blue-600' : 'bg-gray-600'}
                                                    `}
                                                    style={{
                                                        borderRadius: '0',
                                                        fontFamily: "'Press Start 2P', cursive",
                                                        fontSize: '0.7em'
                                                    }}
                                                >
                                                    {username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div
                                                className={`
                                                    absolute -bottom-1 -right-1 w-4 h-4 border-2 border-black 
                                                    flex items-center justify-center ${getStatusColor(status)}
                                                `}
                                                style={{ borderRadius: '0' }}
                                                title={`Status: ${status ? 'online' : 'offline'}`}
                                            >
                                                <span
                                                    className="text-white font-bold"
                                                    style={{
                                                        fontFamily: "'Press Start 2P', cursive",
                                                        fontSize: '0.5em'
                                                    }}
                                                >
                                                    {getStatusIcon(status)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <p
                                                    className={`
                                                        font-bold truncate
                                                        ${isCurrentUser ? 'text-blue-600' : 'text-gray-800'}
                                                    `}
                                                    style={{
                                                        fontFamily: "'Press Start 2P', cursive",
                                                        fontSize: '0.7em'
                                                    }}
                                                >
                                                    {username}
                                                    {isCurrentUser && (
                                                        <span className="ml-1 text-blue-500">(You)</span>
                                                    )}
                                                </p>
                                            </div>

                                            <p
                                                className="text-gray-500 mt-1"
                                                style={{
                                                    fontFamily: "'Press Start 2P', cursive",
                                                    fontSize: '0.6em'
                                                }}
                                            >
                                                {status ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="border-t-4 border-black bg-gray-100 px-4 py-3">
                <div className="flex items-center justify-between">
                    <span
                        className="text-gray-600"
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.6em'
                        }}
                    >
                        Room: #{connectedUsers.length > 0 ? 'Active' : 'Empty'}
                    </span>
                    <div
                        className={`
                            w-3 h-3 border border-black
                            ${connectedUsers.length > 0 ? 'bg-green-400' : 'bg-red-400'}
                        `}
                        style={{ borderRadius: '0' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SideBar;