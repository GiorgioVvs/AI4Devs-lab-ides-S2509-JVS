import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import CandidateFormModal from './components/CandidateFormModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitSuccess = () => {
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Sistema de Seguimiento de Talento LTI</h1>
        <p className="subtitle">Gestiona y rastrea la información de candidatos</p>
      </header>
      
      <Dashboard 
        refreshTrigger={refreshTrigger}
        onAddCandidate={handleOpenModal}
      />
      
      {isModalOpen && (
        <CandidateFormModal
          onClose={handleCloseModal}
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}
    </div>
  );
}

export default App;
