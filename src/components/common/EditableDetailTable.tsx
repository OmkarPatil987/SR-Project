import React from 'react';
import {
    Box, Button, IconButton, Table, TableBody, TableCell,
    TableHead, TableRow, TextField, Tooltip, Typography
} from '@mui/material';
import { AddCircleOutline, DeleteOutline } from '@mui/icons-material';
import { DetailTableRow } from './DetailTable';

interface EditableDetailTableProps {
    title?: string;
    keyHeader: string;
    valueHeader: string;
    rows: DetailTableRow[];
    onChange: (rows: DetailTableRow[]) => void;
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    addRowLabel?: string;
    emptyHint?: string;
}

const cellInputStyles = {
    '& .MuiOutlinedInput-root': { bgcolor: '#fff', fontSize: '0.875rem' },
    '& .MuiOutlinedInput-input': { py: 0.75 },
};

/**
 * Editable twin of `DetailTable`, used on the QR form for gazette composition
 * and specifications.
 *
 * The rows arrive pre-filled from the gazette record but stay correctable —
 * the dataset carries the occasional stale or mistyped figure, and the QR is
 * what a farmer actually reads. Unlike `DetailTable` this renders even with no
 * rows, otherwise emptying the table would remove the only way to refill it.
 */
const EditableDetailTable: React.FC<EditableDetailTableProps> = ({
    title,
    keyHeader,
    valueHeader,
    rows,
    onChange,
    keyPlaceholder,
    valuePlaceholder,
    addRowLabel = 'Add row',
    emptyHint = 'No rows yet — add one below.',
}) => {
    const updateCell = (index: number, field: keyof DetailTableRow, value: string) => {
        onChange(rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
    };

    const removeRow = (index: number) => {
        onChange(rows.filter((_, rowIndex) => rowIndex !== index));
    };

    const addRow = () => onChange([...rows, { key: '', value: '' }]);

    return (
        <Box>
            {title && (
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    {title}
                </Typography>
            )}

            {/* Scrolls within itself so a long ingredient name never pushes the
                form sideways — same rule as the read-only table. */}
            <Box sx={{ overflowX: 'auto', border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
                <Table size="small" sx={{ minWidth: 420 }}>
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {keyHeader}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, width: '35%' }}>
                                {valueHeader}
                            </TableCell>
                            <TableCell sx={{ width: 56 }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                                    {emptyHint}
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, index) => (
                                // Index keys are deliberate: rows have no id, and every
                                // input is controlled by its position in `rows`.
                                <TableRow key={index}>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <TextField
                                            fullWidth multiline size="small"
                                            value={row.key}
                                            placeholder={keyPlaceholder ?? keyHeader}
                                            onChange={(event) => updateCell(index, 'key', event.target.value)}
                                            sx={cellInputStyles}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <TextField
                                            fullWidth multiline size="small"
                                            value={row.value}
                                            placeholder={valuePlaceholder ?? valueHeader}
                                            onChange={(event) => updateCell(index, 'value', event.target.value)}
                                            sx={cellInputStyles}
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ verticalAlign: 'top' }}>
                                        <Tooltip title="Remove row">
                                            <IconButton size="small" onClick={() => removeRow(index)} sx={{ color: '#c62828', mt: 0.5 }}>
                                                <DeleteOutline fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Box>

            <Button
                size="small"
                startIcon={<AddCircleOutline />}
                onClick={addRow}
                sx={{ mt: 1, textTransform: 'none', fontWeight: 700, color: '#4c9a74' }}
            >
                {addRowLabel}
            </Button>
        </Box>
    );
};

export default EditableDetailTable;
