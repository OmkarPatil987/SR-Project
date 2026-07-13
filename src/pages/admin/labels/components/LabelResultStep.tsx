import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import { Visibility, Download, Edit, RestartAlt, CheckCircle } from '@mui/icons-material';
import FilePreviewDrawer from '../../../../components/common/FilePreview';

interface LabelResultStepProps {
    fileUrl: string;
    onEdit: () => void;
    onStartNew: () => void;
}

const LabelResultStep: React.FC<LabelResultStepProps> = ({ fileUrl, onEdit, onStartNew }) => {
    const [previewOpen, setPreviewOpen] = useState(false);

    return (
        <Box>
            <Paper elevation={0} sx={{ border: '1px solid #d1e6dc', borderRadius: '1rem', p: 4, textAlign: 'center' }}>
                <CheckCircle sx={{ color: '#19b369', fontSize: 56, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Label PDF Generated</Typography>
                <Typography variant="body2" sx={{ color: '#509574', mb: 3 }}>
                    Your product label has been generated successfully. You can view, download, or edit it below.
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                    <Button variant="outlined" startIcon={<Visibility />} onClick={() => setPreviewOpen(true)} sx={{ textTransform: 'none' }}>
                        View PDF
                    </Button>
                    <Button
                        variant="outlined"
                        component="a"
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        startIcon={<Download />}
                        sx={{ textTransform: 'none' }}
                    >
                        Download
                    </Button>
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button variant="contained" startIcon={<Edit />} onClick={onEdit} sx={{ bgcolor: '#19b369', '&:hover': { bgcolor: '#159658' }, textTransform: 'none', fontWeight: 700, borderRadius: '0.75rem' }}>
                        Edit
                    </Button>
                    <Button variant="text" startIcon={<RestartAlt />} onClick={onStartNew} sx={{ textTransform: 'none', fontWeight: 700 }}>
                        Start New Label
                    </Button>
                </Stack>
            </Paper>

            <FilePreviewDrawer open={previewOpen} onClose={() => setPreviewOpen(false)} fileUrl={fileUrl} title="Label Preview" />
        </Box>
    );
};

export default LabelResultStep;
