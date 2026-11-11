import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer.component';

const UserLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
            
        </div>
    );
};

export default UserLayout;