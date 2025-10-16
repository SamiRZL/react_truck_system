import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Grid,
    InputAdornment,
    Alert
} from '@mui/material';
import { LocationOn, MyLocation, AccessTime } from '@mui/icons-material';

export default function DriverForm({ fetchRoute }) {
    const [formData, setFormData] = useState({
        currentLocation: '',
        pickupLocation: '',
        dropoffLocation: '',
        cycleHours: ''
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentLocation.trim())
            newErrors.currentLocation = 'Current location is required';
        if (!formData.pickupLocation.trim())
            newErrors.pickupLocation = 'Pickup location is required';
        if (!formData.dropoffLocation.trim())
            newErrors.dropoffLocation = 'Dropoff location is required';
        if (!formData.cycleHours)
            newErrors.cycleHours = 'Cycle hours are required';
        else if (parseFloat(formData.cycleHours) < 0)
            newErrors.cycleHours = 'Hours must be positive';
        else if (parseFloat(formData.cycleHours) > 70)
            newErrors.cycleHours = 'Hours cannot exceed 70';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const dataToSubmit = {
                ...formData,
                time: new Date().toISOString()
            };
            setSubmitted(true);
            await fetchRoute(dataToSubmit);
            console.log('Form submitted:', dataToSubmit);
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    const handleReset = () => {
        setFormData({
            currentLocation: '',
            pickupLocation: '',
            dropoffLocation: '',
            cycleHours: '',
        });
        setErrors({});
        setSubmitted(false);
    };

    return (
        <Container
            maxWidth="lg"
            className="font-sans"
            sx={{
                py: 5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#0d1117',
            }}
        >
            <Paper
                elevation={5}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    width: '100%',

                    bgcolor: '#1b1e27',
                    color: '#e6edf3',
                    border: '1px solid #374151',
                }}
            >
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{ textAlign: 'center', fontWeight: 700, color: '#fff' }}
                    >
                        Driver Route Planning
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', color: '#8b949e' }}>
                        Enter your current location, route details, and hours worked
                    </Typography>
                </Box>

                {submitted && (
                    <Alert
                        severity="success"
                        sx={{
                            mb: 3,
                            bgcolor: '#0D74CE',
                            color: 'white',
                            '& .MuiAlert-icon': { color: 'white' }
                        }}
                    >
                        Route information submitted successfully!
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} sx={{
                        justifyContent: {
                            lg: 'center',
                        },
                    }}>
                        {[
                            {
                                field: 'currentLocation',
                                label: 'Current Location',
                                placeholder: 'e.g., Chicago, IL',
                                icon: <MyLocation sx={{ color: '#8b949e' }} />,
                                helper: 'Enter your current city and state',
                            },
                            {
                                field: 'pickupLocation',
                                label: 'Pickup Location',
                                placeholder: 'e.g., Denver, CO',
                                icon: <LocationOn sx={{ color: '#8b949e' }} />,
                                helper: 'Where will you pick up the cargo?',
                            },
                            {
                                field: 'dropoffLocation',
                                label: 'Dropoff Location',
                                placeholder: 'e.g., Los Angeles, CA',
                                icon: <LocationOn sx={{ color: '#8b949e' }} />,
                                helper: 'Where will you deliver the cargo?',
                            },
                            {
                                field: 'cycleHours',
                                label: 'Current Cycle Used (Hours)',
                                placeholder: 'e.g., 35',
                                type: 'number',
                                icon: <AccessTime sx={{ color: '#8b949e' }} />,
                                helper: 'Hours worked in current 8-day cycle (max 70)',
                            },
                        ].map(({ field, label, placeholder, type, icon, helper }) => (
                            <Grid item xs={12} key={field}>
                                <TextField
                                    fullWidth
                                    autoComplete="off"
                                    type={type || 'text'}
                                    label={label}
                                    placeholder={placeholder}
                                    value={formData[field]}
                                    onChange={handleChange(field)}
                                    error={!!errors[field]}
                                    helperText={errors[field] || helper}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {icon}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: '#e6edf3',
                                            '& fieldset': { borderColor: '#30363d' },
                                            '&:hover fieldset': { borderColor: '#fff' },
                                            '&.Mui-focused fieldset': { borderColor: '#fff' },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#8b949e',
                                            '&.Mui-focused': { color: '#fff' },
                                        },
                                        '& .MuiFormHelperText-root': { color: '#8b949e' },
                                    }}
                                    required
                                />
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        fontWeight: 700,
                                        bgcolor: '#0D74CE',
                                        '&:hover': { bgcolor: '#0588F0' },
                                        color: '#fff',
                                        borderRadius: 2,
                                    }}
                                >
                                    Calculate Route
                                </Button>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    size="large"
                                    onClick={handleReset}
                                    sx={{
                                        py: 1.5,
                                        minWidth: 120,
                                        color: '#fff',
                                        borderColor: '#374151',
                                        backgroundColor: '#374151',
                                        borderRadius: 2,
                                        '&:hover': {
                                            borderColor: '#4b5563',
                                            backgroundColor: '#4b5563',
                                        },
                                    }}
                                >
                                    Reset
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}
