import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const NewComponent: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        New Component
      </Typography>
      <Box sx={{ mt: 2 }}>
        {/* Add your component content here */}
        <Typography>Component content placeholder</Typography>
      </Box>
    </Paper>
  );
};

export default NewComponent;