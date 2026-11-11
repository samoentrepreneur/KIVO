import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer.component';
import FloatingChatButton from '../components/floatingChatButton';

const Wrapper = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <FloatingChatButton/>
      <Footer/>
    </div>
  );
};

export default Wrapper;