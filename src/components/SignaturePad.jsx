import { useRef, useState, useEffect } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

const SignaturePad = ({ onSave, onCancel }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size to match display size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
    }, []);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasSignature(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault(); // Prevent scrolling on touch

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handleSave = () => {
        if (!hasSignature) return;
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
    };

    return (
        <div className="signature-pad-container">
            <div className="card p-md" style={{ maxWidth: '500px', width: '100%', margin: '0 auto' }}>
                <h3 className="text-lg font-bold mb-md">Assinatura do Cliente</h3>

                <div className="border rounded mb-md" style={{ height: '200px', background: '#fff', touchAction: 'none' }}>
                    <canvas
                        ref={canvasRef}
                        style={{ width: '100%', height: '100%', display: 'block' }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>

                <div className="flex justify-between gap-md">
                    <button
                        onClick={clearSignature}
                        className="btn btn-outline flex items-center gap-xs"
                        disabled={!hasSignature}
                    >
                        <RotateCcw size={16} />
                        Limpar
                    </button>

                    <div className="flex gap-md">
                        <button onClick={onCancel} className="btn btn-ghost">
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn btn-primary flex items-center gap-xs"
                            disabled={!hasSignature}
                        >
                            <Check size={16} />
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignaturePad;
