import { useEffect } from 'react';

const AdminRedirect = () => {
    useEffect(() => {
        window.location.href = 'http://localhost:8080/admin';
    }, []);

    return <p>Redirecting to Admin...</p>;
};

export default AdminRedirect;