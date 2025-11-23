import { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import { useToast } from '../context/ToastContext';

const ExportButton = ({ tickets, filename = 'tickets' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { showSuccess, showError } = useToast();

    const handleExportExcel = async () => {
        try {
            const result = exportToExcel(tickets, filename);
            if (result?.success === false) {
                showError(`Erro ao exportar para Excel: ${result.error}`);
            } else {
                showSuccess(`${tickets.length} tickets exportados para Excel!`);
            }
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            showError('Erro ao exportar para Excel. Verifique o console.');
        }
        setIsOpen(false);
    };

    const handleExportPDF = async () => {
        try {
            const result = exportToPDF(tickets, filename);
            if (result?.success === false) {
                showError(`Erro ao exportar para PDF: ${result.error}`);
            } else {
                showSuccess(`${tickets.length} tickets exportados para PDF!`);
            }
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            showError('Erro ao exportar para PDF. Verifique o console.');
        }
        setIsOpen(false);
    };

    return (
        <div className="export-dropdown" style={{ position: 'relative' }}>
            <button
                className="btn btn-secondary"
                onClick={() => setIsOpen(!isOpen)}
                disabled={!tickets || tickets.length === 0}
            >
                <Download size={20} />
                Exportar
            </button>

            {isOpen && (
                <>
                    <div
                        className="export-overlay"
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 5
                        }}
                    />
                    <div className="export-menu">
                        <button
                            className="export-menu-item"
                            onClick={handleExportExcel}
                        >
                            <FileSpreadsheet size={18} />
                            <span>
                                <strong>Excel</strong>
                                <small>Arquivo .xlsx</small>
                            </span>
                        </button>
                        <button
                            className="export-menu-item"
                            onClick={handleExportPDF}
                        >
                            <FileText size={18} />
                            <span>
                                <strong>PDF</strong>
                                <small>Documento .pdf</small>
                            </span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExportButton;
