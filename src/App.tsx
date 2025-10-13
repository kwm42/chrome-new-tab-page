import './App.less';
import Background from './components/Background';
import Header from './components/Header';
import Logo from './components/Logo';
import SearchBar from './components/SearchBar';
import CategorySidebar from './components/CategorySidebar';
import Shortcuts from './components/Shortcuts';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Background />
      <Header />
      <main className="main-content">
        <div className="content-top">
          <Logo />
          <SearchBar />
        </div>
        <div className="content-bottom">
          <CategorySidebar />
          <Shortcuts />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
