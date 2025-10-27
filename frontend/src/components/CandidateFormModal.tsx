import React, { useState, FormEvent } from 'react';
import './CandidateFormModal.css';

interface CandidateFormModalProps {
  onClose: () => void;
  onSubmitSuccess: () => void;
}

interface FormErrors {
  [key: string]: string;
}

const CandidateFormModal: React.FC<CandidateFormModalProps> = ({ onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    work_experience: ''
  });
  
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const validateField = (name: string, value: string): string => {
    const fieldNames: { [key: string]: string } = {
      'first_name': 'El nombre',
      'last_name': 'El apellido',
      'email': 'El correo electrónico',
      'phone': 'El teléfono',
      'address': 'La dirección',
      'education': 'La educación',
      'work_experience': 'La experiencia laboral'
    };

    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'El correo electrónico es requerido';
        if (!emailRegex.test(value)) return 'Formato de correo electrónico inválido';
        return '';
      default:
        if (!value.trim()) {
          const fieldName = fieldNames[name] || name.replace('_', ' ');
          return `${fieldName} es requerido`;
        }
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
      }
    });

    // Validate education and work_experience as JSON
    if (formData.education) {
      try {
        JSON.parse(formData.education);
      } catch {
        newErrors.education = 'La educación debe ser un array JSON válido';
      }
    }
    
    if (formData.work_experience) {
      try {
        JSON.parse(formData.work_experience);
      } catch {
        newErrors.work_experience = 'La experiencia laboral debe ser un array JSON válido';
      }
    }

    // Validate file if uploaded
    if (cvFile) {
      const fileExt = cvFile.name.toLowerCase().split('.').pop();
      if (fileExt !== 'pdf' && fileExt !== 'docx') {
        newErrors.cv = 'El CV debe ser un archivo PDF o DOCX';
      }
      if (cvFile.size > 10 * 1024 * 1024) {
        newErrors.cv = 'El tamaño del archivo CV debe ser menor a 10MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCvFile(file || null);
    if (errors.cv) {
      setErrors(prev => ({ ...prev, cv: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key as keyof typeof formData]);
      });
      
      if (cvFile) {
        formDataToSend.append('cv', cvFile);
      }

      const response = await fetch('http://localhost:3010/api/candidates', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: '¡Candidato agregado exitosamente!' });
        setTimeout(() => {
          onSubmitSuccess();
        }, 1500);
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: `Error al agregar candidato: ${data.message || 'Error desconocido'}` 
        });
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Error al agregar candidato. Por favor intenta de nuevo.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>Agregar Nuevo Candidato</h2>
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">×</button>
      </div>

        <form onSubmit={handleSubmit} className="candidate-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">Nombre *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={errors.first_name ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.first_name && <span className="error-message">{errors.first_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Apellido *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={errors.last_name ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.last_name && <span className="error-message">{errors.last_name}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="education">Educación * (array JSON)</label>
            <textarea
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              rows={4}
              placeholder='[{"degree": "Licenciatura", "field": "Ciencias de la Computación", "institution": "Universidad", "year": "2020"}]'
              className={errors.education ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.education && <span className="error-message">{errors.education}</span>}
            <small className="form-hint">Ingresa la educación como un array JSON</small>
          </div>

          <div className="form-group">
            <label htmlFor="work_experience">Experiencia Laboral * (array JSON)</label>
            <textarea
              id="work_experience"
              name="work_experience"
              value={formData.work_experience}
              onChange={handleChange}
              rows={4}
              placeholder='[{"position": "Desarrollador", "company": "Tech Corp", "duration": "2 años", "description": "Desarrollé aplicaciones"}]'
              className={errors.work_experience ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.work_experience && <span className="error-message">{errors.work_experience}</span>}
            <small className="form-hint">Ingresa la experiencia laboral como un array JSON</small>
          </div>

          <div className="form-group">
            <label htmlFor="cv">CV (PDF o DOCX)</label>
            <input
              type="file"
              id="cv"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            {errors.cv && <span className="error-message">{errors.cv}</span>}
            <small className="form-hint">Tamaño máximo del archivo: 10MB</small>
          </div>

          {submitStatus && (
            <div className={`submit-status ${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Agregar Candidato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateFormModal;

