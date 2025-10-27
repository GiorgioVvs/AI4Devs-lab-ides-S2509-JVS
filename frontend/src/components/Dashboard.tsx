import React from 'react';
import './Dashboard.css';

interface DashboardProps {
  refreshTrigger: number;
  onAddCandidate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAddCandidate }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Panel de Reclutador</h2>
        <button 
          className="btn-primary add-candidate-btn"
          onClick={onAddCandidate}
          aria-label="Agregar Nuevo Candidato"
        >
          + Agregar Nuevo Candidato
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-card">
          <h3>Bienvenido al Sistema de Seguimiento de Talento</h3>
          <p>Gestiona tu base de datos de candidatos de manera eficiente. Agrega nuevos candidatos, rastrea su información y optimiza tu proceso de reclutamiento.</p>
          <ul className="features-list">
            <li>✓ Agregar nuevos registros de candidatos</li>
            <li>✓ Subir CVs de candidatos</li>
            <li>✓ Rastrear educación y experiencia</li>
            <li>✓ Gestión segura de datos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

