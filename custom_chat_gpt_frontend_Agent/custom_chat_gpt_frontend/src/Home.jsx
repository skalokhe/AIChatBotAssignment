import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Prompt from './Prompt';
import KnowledgeBase from './KnowledgeBase';

const Home = () => {
  return (
    <Router>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h1>AI Chat Agent</h1>  
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                {/* Navigation Links */}
                <nav>
                <Link to="/prompt">Chat with AI Agent</Link>&nbsp;&nbsp;
                <Link to="/knowledge-base">Create Knowledge Base</Link>
                </nav>
                <br/>
                {/* Routes */}
                <Routes>
                    <Route path="/prompt" element={<Prompt/>} />
                    <Route path="/knowledge-base" element={<KnowledgeBase />} />
                </Routes>
            </div>
        </div>
    </Router>
  );
};

export default Home;
