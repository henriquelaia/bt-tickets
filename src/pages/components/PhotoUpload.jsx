import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Download, Eye } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function PhotoUpload({ photos = [], onPhotosChange }) {
    const { showSuccess, showError } = useToast();
    const [dragActive, setDragActive] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files) => {
        const validFiles = Array.from(files).filter(file =>
            file.type.startsWith('image/')
        );

        if (validFiles.length === 0) {
            showError('Por favor, selecione apenas ficheiros de imagem.');
            return;
        }

        // Convert files to base64 for localStorage
        Promise.all(
            validFiles.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({
                            id: Date.now() + Math.random(),
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            data: reader.result,
                            uploadedAt: new Date().toISOString()
                        });
                    };
                    reader.readAsDataURL(file);
                });
            })
        ).then(newPhotos => {
            onPhotosChange([...photos, ...newPhotos]);
            showSuccess(`${newPhotos.length} foto(s) adicionada(s)!`);
        });
    };

    const removePhoto = (photoId) => {
        onPhotosChange(photos.filter(p => p.id !== photoId));
        showSuccess('Foto removida');
    };

    const downloadPhoto = (photo) => {
        const link = document.createElement('a');
        link.href = photo.data;
        link.download = photo.name;
        link.click();
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="card">
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Fotografias e Anexos</h3>

            {/* Upload Area */}
            <div
                className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    border: '2px dashed var(--clr-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-xl)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: 'var(--space-lg)',
                    background: dragActive ? 'var(--clr-primary-alpha)' : 'var(--clr-bg-tertiary)'
                }}
            >
                <Upload size={48} style={{ margin: '0 auto var(--space-md)', opacity: 0.5 }} />
                <p style={{ marginBottom: 'var(--space-sm)' }}>
                    <strong>Clique para fazer upload</strong> ou arraste ficheiros
                </p>
                <p className="text-sm text-muted">
                    Suporta: JPG, PNG, GIF, WebP
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
            </div>

            {/* Photo Gallery */}
            {photos.length > 0 && (
                <div>
                    <h4 style={{ marginBottom: 'var(--space-md)' }}>
                        Ficheiros ({photos.length})
                    </h4>
                    <div className="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3 gap-md">
                        {photos.map(photo => (
                            <div
                                key={photo.id}
                                className="card"
                                style={{
                                    padding: 'var(--space-md)',
                                    position: 'relative'
                                }}
                            >
                                {/* Preview */}
                                <div
                                    style={{
                                        width: '100%',
                                        height: '120px',
                                        borderRadius: 'var(--radius-md)',
                                        overflow: 'hidden',
                                        marginBottom: 'var(--space-sm)',
                                        background: 'var(--clr-bg-tertiary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <img
                                        src={photo.data}
                                        alt={photo.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>

                                {/* Info */}
                                <div style={{ marginBottom: 'var(--space-sm)' }}>
                                    <p className="text-sm font-medium" style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {photo.name}
                                    </p>
                                    <p className="text-xs text-muted">
                                        {formatFileSize(photo.size)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-xs">
                                    <button
                                        onClick={() => setSelectedPhoto(photo)}
                                        className="btn btn-secondary btn-sm flex-1"
                                        style={{ padding: 'var(--space-xs) var(--space-sm)' }}
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => downloadPhoto(photo)}
                                        className="btn btn-secondary btn-sm flex-1"
                                        style={{ padding: 'var(--space-xs) var(--space-sm)' }}
                                    >
                                        <Download size={16} />
                                    </button>
                                    <button
                                        onClick={() => removePhoto(photo.id)}
                                        className="btn btn-danger btn-sm flex-1"
                                        style={{ padding: 'var(--space-xs) var(--space-sm)' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedPhoto && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedPhoto(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: 'var(--space-lg)',
                        animation: 'fadeIn 0.3s ease'
                    }}
                >
                    <button
                        onClick={() => setSelectedPhoto(null)}
                        className="btn btn-secondary btn-icon"
                        style={{
                            position: 'absolute',
                            top: 'var(--space-lg)',
                            right: 'var(--space-lg)'
                        }}
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={selectedPhoto.data}
                        alt={selectedPhoto.name}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-xl)'
                        }}
                    />
                </div>
            )}
        </div>
    );
}
