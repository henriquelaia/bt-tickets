import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Export tickets to Excel file
 */
export const exportToExcel = (tickets, filename = 'tickets') => {
    console.log('Iniciando exportação Excel com FileSaver...');
    try {
        // Prepare data for export
        const data = tickets.map(ticket => ({
            'ID': ticket.id,
            'Título': ticket.title,
            'Cliente': ticket.clientName,
            'Equipamento': ticket.equipmentType?.replace(/_/g, ' ') || '',
            'Categoria': ticket.category || '',
            'Status': ticket.status?.replace(/_/g, ' ') || '',
            'Prioridade': ticket.priority || '',
            'Data Agendada': ticket.scheduledDate
                ? new Date(ticket.scheduledDate).toLocaleDateString('pt-PT')
                : 'Não agendado',
            'Técnico': ticket.assignedTo || 'Não atribuído',
            'Criado em': new Date(ticket.createdAt).toLocaleDateString('pt-PT')
        }));

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(data);

        // Auto-size columns
        const colWidths = [
            { wch: 12 }, // ID
            { wch: 30 }, // Título
            { wch: 25 }, // Cliente
            { wch: 20 }, // Equipamento
            { wch: 15 }, // Categoria
            { wch: 15 }, // Status
            { wch: 12 }, // Prioridade
            { wch: 15 }, // Data Agendada
            { wch: 20 }, // Técnico
            { wch: 12 }  // Criado em
        ];
        ws['!cols'] = colWidths;

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Tickets');

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const fullFilename = `export_${filename}_${timestamp}.xlsx`;

        // Write to buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Create Blob
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

        console.log('Salvando arquivo Excel:', fullFilename);
        // Save using FileSaver
        saveAs(blob, fullFilename);

        return { success: true };
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Export tickets to PDF file
 */
export const exportToPDF = (tickets, filename = 'tickets') => {
    console.log('Iniciando exportação PDF com FileSaver...');
    try {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text('BT Services - Relatório de Tickets', 14, 20);

        // Add generation date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 14, 28);

        // Reset text color
        doc.setTextColor(0);

        // Prepare table data
        const tableData = tickets.map(ticket => [
            ticket.id.substring(0, 8),
            ticket.title.substring(0, 30),
            ticket.clientName,
            ticket.status?.replace(/_/g, ' ') || '',
            ticket.priority || '',
            ticket.scheduledDate
                ? new Date(ticket.scheduledDate).toLocaleDateString('pt-PT')
                : 'N/A'
        ]);

        // Add table using autoTable
        autoTable(doc, {
            head: [['ID', 'Título', 'Cliente', 'Status', 'Prioridade', 'Data']],
            body: tableData,
            startY: 35,
            styles: {
                fontSize: 8,
                cellPadding: 3
            },
            headStyles: {
                fillColor: [99, 102, 241],
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            margin: { top: 35 }
        });

        // Add summary footer
        const finalY = doc.lastAutoTable.finalY || 35;
        doc.setFontSize(10);
        doc.text(`Total de tickets: ${tickets.length}`, 14, finalY + 10);

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const fullFilename = `export_${filename}_${timestamp}.pdf`;

        // Get blob and save using FileSaver
        const blob = doc.output('blob');
        console.log('Salvando arquivo PDF:', fullFilename);
        saveAs(blob, fullFilename);

        return { success: true };
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Export statistics/analytics to PDF
 */
export const exportStatsToPDF = (stats, period = 'monthly') => {
    try {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('BT Services - Relatório de Estatísticas', 14, 20);

        // Period
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Período: ${period}`, 14, 30);
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 14, 36);

        doc.setTextColor(0);

        // Stats
        let yPos = 50;
        doc.setFontSize(14);
        doc.text('Resumo Geral', 14, yPos);

        yPos += 10;
        doc.setFontSize(11);

        const statsText = [
            `Total de Tickets: ${stats.total || 0}`,
            `Pendentes: ${stats.pending || 0}`,
            `Em Andamento: ${stats.inProgress || 0}`,
            `Concluídos: ${stats.completed || 0}`,
            `Taxa de Conclusão: ${stats.completionRate || 0}%`
        ];

        statsText.forEach(text => {
            doc.text(text, 20, yPos);
            yPos += 8;
        });

        // Save
        const timestamp = new Date().toISOString().split('T')[0];
        const fullFilename = `estatisticas_${timestamp}.pdf`;

        // Get blob and save using FileSaver
        const blob = doc.output('blob');
        saveAs(blob, fullFilename);

        return { success: true };
    } catch (error) {
        console.error('Error exporting stats to PDF:', error);
        return { success: false, error: error.message };
    }
};
