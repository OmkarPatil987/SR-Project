import React from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

export interface DetailTableRow {
    key: string;
    value: string;
}

interface DetailTableProps {
    title?: string;
    keyHeader: string;
    valueHeader: string;
    rows: DetailTableRow[];
}

/**
 * Read-only two-column table used for gazette composition (Ingredient/Content)
 * and specifications (Parameter/Value) on the QR form, the admin QR details
 * view and the public scan page.
 *
 * Renders nothing at all when there are no rows, so callers can drop it in
 * without guarding for empty data.
 */
const DetailTable: React.FC<DetailTableProps> = ({ title, keyHeader, valueHeader, rows }) => {
    if (!rows || rows.length === 0) return null;

    return (
        <Box>
            {title && (
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    {title}
                </Typography>
            )}
            {/* Scroll the table within itself so a long ingredient name never
                pushes the page sideways — the public page is mostly read on phones. */}
            <Box sx={{ overflowX: 'auto', border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
                <Table size="small" sx={{ minWidth: 320 }}>
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {keyHeader}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, width: '35%' }}>
                                {valueHeader}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={`${row.key}-${index}`} sx={{ bgcolor: index % 2 === 0 ? 'transparent' : 'grey.50' }}>
                                <TableCell sx={{ fontWeight: 500, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {row.key}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {row.value}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default DetailTable;
