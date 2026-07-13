import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import { History } from '@mui/icons-material';
import CustomStepper from '../../../components/common/stepper/Stepper';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import { GenerateLabelPdfService } from '../../../utils/services/label.service';
import { LabelPdfRequestPayload } from '../../../utils/dto/response/label';
import { LABEL_STEPS } from './constants/labelConstants';
import { NAVIGATE_MODULES, NAVIGATE_ADMIN } from '../../../constant';
import ProductSelectionStep from './components/ProductSelectionStep';
import LabelFormStep, { LabelFormValues } from './components/LabelFormStep';
import LabelResultStep from './components/LabelResultStep';

const GenerateLabel: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [formInitialValues, setFormInitialValues] = useState<LabelFormValues | null>(null);
    const [lastFormValues, setLastFormValues] = useState<LabelFormValues | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSelectionNext = () => {
        setFormInitialValues(null);
        setActiveStep(1);
    };

    const handleFormBack = () => setActiveStep(0);

    const handleGenerate = async (payload: LabelPdfRequestPayload, formValues: LabelFormValues) => {
        setSubmitting(true);
        const { code, data } = await GenerateLabelPdfService(payload);
        if (code === 200 && data?.file_url) {
            setResultUrl(data.file_url);
            setLastFormValues(formValues);
            setActiveStep(2);
        } else {
            dispatch(showSnackbar({ type: 'error', message: 'Failed to generate label PDF.' }));
        }
        setSubmitting(false);
    };

    const handleEditFromResult = () => {
        setFormInitialValues(lastFormValues);
        setActiveStep(1);
    };

    const handleStartNew = () => {
        setSelectedIds([]);
        setFormInitialValues(null);
        setLastFormValues(null);
        setResultUrl(null);
        setActiveStep(0);
    };

    return (
        <Box className="w-full px-4 py-4">
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                    <Typography variant="h4" sx={{ color: '#0e1b15', fontWeight: 900 }}>Label Management</Typography>
                    <Typography variant="body2" sx={{ color: '#509574' }}>Generate compliant product labels from the gazette catalogue.</Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<History />}
                    onClick={() => navigate(`${NAVIGATE_MODULES.ADMIN}${NAVIGATE_ADMIN.LABEL_HISTORY}`)}
                    sx={{ textTransform: 'none' }}
                >
                    View History
                </Button>
            </Stack>

            <CustomStepper steps={LABEL_STEPS} activeStep={activeStep} />

            {activeStep === 0 && (
                <ProductSelectionStep selectedIds={selectedIds} onSelectionChange={setSelectedIds} onNext={handleSelectionNext} />
            )}

            {activeStep === 1 && (
                <LabelFormStep
                    selectedIds={selectedIds}
                    initialFormValues={formInitialValues}
                    onGenerate={handleGenerate}
                    onBack={handleFormBack}
                    submitting={submitting}
                />
            )}

            {activeStep === 2 && resultUrl && (
                <LabelResultStep fileUrl={resultUrl} onEdit={handleEditFromResult} onStartNew={handleStartNew} />
            )}
        </Box>
    );
};

export default GenerateLabel;
